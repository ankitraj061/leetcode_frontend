import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../utils/axiosClient";

export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/api/auth/register", userData);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/api/auth/login", credentials);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const checkAuth = createAsyncThunk(
    "auth/check",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/api/auth/check");
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post("/api/auth/logout");
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)








const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        isInitialized: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // User registration
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isInitialized = true;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
                state.isAuthenticated = false;
                state.user = null;
            })


            // User login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isInitialized = true;
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
                state.isAuthenticated = false;
                state.user = null;
            })


            // User logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
                state.isAuthenticated = false;
                state.user = null;
            })


            // Check auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isInitialized = true;
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload || null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isInitialized = true;
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
                state.isAuthenticated = false;
                state.user = null;
            })




    },
});

export default authSlice.reducer;




