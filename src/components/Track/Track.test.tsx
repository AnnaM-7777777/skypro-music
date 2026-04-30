import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TrackList from './Track';
import { trackSliceReducer } from '@/store/features/trackSlice';
import { favoritesSlice } from '@/store/features/favoritesSlice';
import { TrackType } from '@/sharedTypes/sharedTypes';

jest.mock('./Track.module.css', () => new Proxy({}, { get: (_, key) => key }));

jest.mock('@/components/Icons', () => ({
    IconLike: ({ isFilled, onClick, 'data-testid': testId }: any) => (
        <button
            data-testid={testId || 'like-button'}
            data-filled={isFilled}
            onClick={onClick}
            type='button'
        >
            {isFilled ? '♥' : '♡'}
        </button>
    ),
}));

jest.mock('@/components/Toast/Toast', () => ({
    __esModule: true,
    default: ({ message }: { message: string }) => (
        <div data-testid='toast' role='alert'>
            {message}
        </div>
    ),
}));

jest.mock('@/utils/withReauth', () => ({
    withReauth: async <T,>(fn: (token: string) => Promise<T>) => fn('mock-token'),
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, ...rest }: any) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}));

jest.mock('@/utils/helpers', () => ({
    formatDuration: (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
}));

jest.mock('@/store/store', () => {
    const actual = jest.requireActual('@/store/store');
    return {
        ...actual,
        useAppDispatch: () => jest.fn(),
        useAppSelector: (selector: any) =>
            selector({
                tracks: { currentTrack: null, isPlaying: false },
                favorites: { items: [], loading: false, error: null, trackIds: [] },
            }),
    };
});

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

const mockTracks: TrackType[] = [
    {
        _id: 1,
        name: 'Rock Song',
        author: 'Rock Band',
        album: 'Rock Album',
        duration_in_seconds: 240,
        release_date: '2022-04-16',
        genre: ['Рок'],
        track_file: '/tracks/1.mp3',
        logo: null,
        stared_user: [],
    },
    {
        _id: 2,
        name: 'Pop Hit',
        author: 'Pop Star',
        album: 'Pop Album',
        duration_in_seconds: 180,
        release_date: '2023-01-20',
        genre: ['Поп'],
        track_file: '/tracks/2.mp3',
        logo: null,
        stared_user: [],
    },
];

const createStore = () =>
    configureStore({
        reducer: {
            tracks: trackSliceReducer,
            favorites: favoritesSlice.reducer,
        },
    });

describe('Список треков', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('Рендеринг', () => {
        it('отображает заголовки колонок', () => {
            render(
                <Provider store={createStore()}>
                    <TrackList tracks={[]} />
                </Provider>
            );
            expect(screen.getByText('Трек')).toBeInTheDocument();
            expect(screen.getByText('Исполнитель')).toBeInTheDocument();
            expect(screen.getByText('Альбом')).toBeInTheDocument();
        });

        it('рендерит треки с корректными данными', () => {
            render(
                <Provider store={createStore()}>
                    <TrackList tracks={mockTracks} />
                </Provider>
            );
            expect(screen.getByText('Rock Song')).toBeInTheDocument();
            expect(screen.getByText('Rock Band')).toBeInTheDocument();
            expect(screen.getByText('4:00')).toBeInTheDocument();
            expect(screen.getByText('Pop Hit')).toBeInTheDocument();
            expect(screen.getByText('3:00')).toBeInTheDocument();
        });

        it('отображает кнопку лайка для каждого трека', () => {
            render(
                <Provider store={createStore()}>
                    <TrackList tracks={mockTracks} />
                </Provider>
            );
            expect(screen.getAllByTestId('like-button')).toHaveLength(2);
        });
    });

    describe('Состояние загрузки', () => {
        it('показывает скелетоны при isLoading=true', () => {
            render(
                <Provider store={createStore()}>
                    <TrackList tracks={[]} isLoading={true} />
                </Provider>
            );
            expect(screen.queryByText('Rock Song')).not.toBeInTheDocument();
            const skeletons = document.querySelectorAll('.skeleton');
            expect(skeletons.length).toBeGreaterThan(5);
        });
    });

    describe('Лайк трека', () => {
        it('показывает тост, если нет токена', async () => {
            const user = userEvent.setup();
            localStorage.removeItem('token');

            render(
                <Provider store={createStore()}>
                    <TrackList tracks={mockTracks} />
                </Provider>
            );

            await user.click(screen.getAllByTestId('like-button')[0]);
            expect(await screen.findByTestId('toast')).toBeInTheDocument();
            expect(
                screen.getByText('Чтобы ставить лайки, пожалуйста, авторизуйтесь')
            ).toBeInTheDocument();
        });

        it('отправляет POST-запрос при добавлении лайка', async () => {
            const user = userEvent.setup();
            localStorage.setItem('token', 'valid-token');
            mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

            render(
                <Provider store={createStore()}>
                    <TrackList tracks={mockTracks} />
                </Provider>
            );

            await user.click(screen.getAllByTestId('like-button')[0]);

            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalledWith(
                    expect.stringContaining('/catalog/track/1/favorite/'),
                    expect.objectContaining({
                        method: 'POST',
                        headers: expect.objectContaining({
                            Authorization: 'Bearer mock-token',
                        }),
                    })
                );
            });
        });

        it('показывает тост об ошибке при неудачном запросе', async () => {
            const user = userEvent.setup();
            localStorage.setItem('token', 'valid-token');
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            render(
                <Provider store={createStore()}>
                    <TrackList tracks={mockTracks} />
                </Provider>
            );

            await user.click(screen.getAllByTestId('like-button')[0]);

            expect(await screen.findByTestId('toast')).toBeInTheDocument();
            expect(
                screen.getByText('Не удалось обновить лайк. Попробуйте позже.')
            ).toBeInTheDocument();
        });
    });

    describe('Пустой список', () => {
        it('корректно рендерит пустой список', () => {
            render(
                <Provider store={createStore()}>
                    <TrackList tracks={[]} />
                </Provider>
            );
            expect(screen.getByText('Трек')).toBeInTheDocument();
            expect(screen.queryByText('Rock Song')).not.toBeInTheDocument();
        });
    });
});
