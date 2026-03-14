import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/types';
import { getSafeTrackUrl } from '@/utils/testTracks';

type initialStateType = {
    currentTrack: TrackType | null;
    isPlaying: boolean;
};

const initialState: initialStateType = {
    currentTrack: null,
    isPlaying: false,
};

const trackSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
            state.currentTrack = {
                ...action.payload,
                track_file: getSafeTrackUrl(action.payload.track_file),
            };
            state.isPlaying = true;
        },
        setPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
    },
});

export const { setCurrentTrack, setPlaying } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;