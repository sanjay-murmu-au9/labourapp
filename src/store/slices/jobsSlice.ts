import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Job {
  id: string;
  title: string;
  wage: number;
  distance: number;
  location: string;
  description: string;
  type: string;
  postedBy: string;
  createdAt: number;
}

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  loading: boolean;
  error: string | null;
  filter: string;
}

const initialState: JobsState = {
  jobs: [],
  filteredJobs: [],
  loading: false,
  error: null,
  filter: 'ALL',
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (location: { latitude: number; longitude: number }) => {
    // Will be replaced with actual API call
    const response = await fetch('/api/jobs');
    return response.json();
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    // Will be replaced with actual API call
    const response = await fetch('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return response.json();
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      if (action.payload === 'ALL') {
        state.filteredJobs = state.jobs;
      } else {
        state.filteredJobs = state.jobs.filter(job => job.type === action.payload);
      }
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.filteredJobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.filteredJobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
        if (state.filter === 'ALL' || state.filter === action.payload.type) {
          state.filteredJobs.unshift(action.payload);
        }
      });
  },
});

export const { setFilter, clearJobs } = jobsSlice.actions;
export default jobsSlice.reducer;