import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';

interface FavoritesState {
    trackIds: number[]; // Храним только ID для лёгкой проверки
    tracks: TrackType[]; // Полные данные треков (опционально, для быстрого доступа)
    isLoading: boolean;
}

const initialState: FavoritesState = {
    trackIds: [],
    tracks: [],
    isLoading: false,
};

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        // Загрузка избранного
        setFavorites: (
            state,
            action: PayloadAction<{ trackIds: number[]; tracks?: TrackType[] }>
        ) => {
            state.trackIds = action.payload.trackIds;
            state.tracks = action.payload.tracks || [];
        },

        // Добавление трека в избранное
        addFavorite: (state, action: PayloadAction<TrackType>) => {
            if (!state.trackIds.includes(action.payload._id)) {
                state.trackIds.push(action.payload._id);
                state.tracks.push(action.payload);
            }
        },

        // Удаление трека из избранного
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.trackIds = state.trackIds.filter(id => id !== action.payload);
            state.tracks = state.tracks.filter(track => track._id !== action.payload);
        },

        // Проверка, есть ли трек в избранном
        toggleFavorite: (state, action: PayloadAction<TrackType>) => {
            const id = action.payload._id;
            const index = state.trackIds.indexOf(id);

            if (index === -1) {
                state.trackIds.push(id);
                state.tracks.push(action.payload);
            } else {
                state.trackIds.splice(index, 1);
                state.tracks = state.tracks.filter(track => track._id !== id);
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setFavorites, addFavorite, removeFavorite, toggleFavorite, setLoading } =
    favoritesSlice.actions;

// Селекторы
export const selectFavoriteIds = (state: { favorites: FavoritesState }) => state.favorites.trackIds;

export const selectFavoriteTracks = (state: { favorites: FavoritesState }) =>
    state.favorites.tracks;

export const selectIsFavorite = (state: { favorites: FavoritesState }, trackId: number) =>
    state.favorites.trackIds.includes(trackId);

export default favoritesSlice.reducer;
