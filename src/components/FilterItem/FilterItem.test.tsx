import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterItem from './FilterItem';
import { FilterType } from '@/utils/filter';

jest.mock('./FilterItem.module.css', () => ({
    filter__item: 'filter__item',
    filter__button: 'filter__button active',
    filter__dropdown: 'filter__dropdown',
    dropdown__summary: 'dropdown__summary',
    dropdown__list: 'dropdown__list',
    dropdown__item: 'dropdown__item',
    filter__count: 'filter__count',
    selected: 'selected',
    active: 'active',
}));

const mockProps = {
    titleFilter: 'жанру',
    list: ['Рок', 'Поп', 'Джаз'],
    nameFilter: 'genre' as FilterType,
    activeFilter: null as FilterType,
    onChangeActiveFilter: jest.fn(),
    onSelect: jest.fn(),
    selectedValues: [] as string[],
};

describe('Выпадающий фильтр', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Рендеринг', () => {
        it('отображает кнопку с заголовком фильтра', () => {
            render(<FilterItem {...mockProps} />);
            expect(screen.getByRole('button', { name: 'жанру' })).toBeInTheDocument();
        });

        it('не отображает список, когда меню закрыто', () => {
            render(<FilterItem {...mockProps} activeFilter={null} />);
            expect(screen.queryByText('Рок')).not.toBeInTheDocument();
        });

        it('отображает список элементов, когда меню активно', () => {
            render(<FilterItem {...mockProps} activeFilter='genre' />);
            expect(screen.getByText('Рок')).toBeInTheDocument();
            expect(screen.getByText('Поп')).toBeInTheDocument();
        });
    });

    describe('Управление меню', () => {
        it('открывает список при клике на кнопку', async () => {
            const user = userEvent.setup();
            render(<FilterItem {...mockProps} activeFilter={null} />);

            await user.click(screen.getByRole('button', { name: 'жанру' }));
            expect(mockProps.onChangeActiveFilter).toHaveBeenCalledWith('genre');
        });

        it('закрывает список при повторном клике', async () => {
            const user = userEvent.setup();
            render(<FilterItem {...mockProps} activeFilter='genre' />);

            await user.click(screen.getByRole('button', { name: 'жанру' }));
            expect(mockProps.onChangeActiveFilter).toHaveBeenCalledWith(null);
        });

        it('добавляет класс active к кнопке, когда меню открыто', () => {
            render(<FilterItem {...mockProps} activeFilter='genre' />);
            expect(screen.getByRole('button', { name: 'жанру' })).toHaveClass('active');
        });
    });

    describe('Выбор элементов', () => {
        it('вызывает onSelect с выбранным значением', async () => {
            const user = userEvent.setup();
            render(<FilterItem {...mockProps} activeFilter='genre' />);

            await user.click(screen.getByText('Рок'));
            expect(mockProps.onSelect).toHaveBeenCalledWith('Рок');
        });

        it('подсвечивает выбранный элемент классом selected', () => {
            render(<FilterItem {...mockProps} activeFilter='genre' selectedValues={['Поп']} />);
            expect(screen.getByText('Поп')).toHaveClass('selected');
            expect(screen.getByText('Рок')).not.toHaveClass('selected');
        });

        it('обрабатывает множественный выбор через selectedValues', () => {
            render(
                <FilterItem {...mockProps} activeFilter='genre' selectedValues={['Рок', 'Джаз']} />
            );
            expect(screen.getByText('Рок')).toHaveClass('selected');
            expect(screen.getByText('Джаз')).toHaveClass('selected');
            expect(screen.getByText('Поп')).not.toHaveClass('selected');
        });
    });

    describe('Счётчик выбранных', () => {
        it('показывает количество выбранных, когда меню закрыто', () => {
            render(<FilterItem {...mockProps} selectedValues={['Рок', 'Поп']} />);
            expect(screen.getByText('2')).toBeInTheDocument();
        });

        it('скрывает счётчик, когда меню открыто', () => {
            render(<FilterItem {...mockProps} activeFilter='genre' selectedValues={['Рок']} />);
            expect(screen.queryByText('(1)')).not.toBeInTheDocument();
        });

        it('показывает сводку внутри открытого меню', () => {
            render(
                <FilterItem {...mockProps} activeFilter='genre' selectedValues={['Рок', 'Поп']} />
            );
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('Рок')).toBeInTheDocument();
            expect(screen.getByText('Поп')).toBeInTheDocument();
        });
    });
});
