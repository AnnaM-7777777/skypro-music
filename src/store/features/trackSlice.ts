/* import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/types';

type initialStateType = {
  currentTrack: TrackType | null;
};

const initialState: initialStateType = {
  currentTrack: null,
};

const trackSlice = createSlice({
  name: 'tracks',  
  initialState,  
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
    state.currentTrack = action.payload;    
    },  
  },
});

export const { setCurrentTrack } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer; */

/* import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/types';
import { getSafeTrackUrl } from '@/utils/testTracks';

type initialStateType = {
    currentTrack: TrackType | null;
};

const initialState: initialStateType = {
    currentTrack: null,
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
        },
    },
});

export const { setCurrentTrack } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/types';
import { getSafeTrackUrl } from '@/utils/testTracks';

type initialStateType = {
    currentTrack: TrackType | null;
};

const initialState: initialStateType = {
    currentTrack: null,
};

const trackSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
            state.currentTrack = {
                ...action.payload,
                track_file: getSafeTrackUrl(action.payload.track_file), // ← теперь всегда string
            };
        },
    },
});

export const { setCurrentTrack } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
