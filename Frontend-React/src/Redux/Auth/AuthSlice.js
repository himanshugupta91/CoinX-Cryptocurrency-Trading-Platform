import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api, { API_BASE_URL } from "@/Api/api";

// Async Thunks

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
            const user = response.data;
            if (user.jwt) localStorage.setItem("jwt", user.jwt);
            userData.navigate("/");
            return user.jwt;
        } catch (error) {
            return rejectWithValue(error.response?.data ? error.response.data : error.message);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
            const user = response.data;
            if (user.twoFactorAuthEnabled) {
                userData.navigate(`/two-factor-auth/${user.session}`);
                return; // Don't return JWT yet if 2FA is enabled? Or handle logically in component. 
                // Existing logic suggests we might not get JWT yet if 2FA is on? 
                // Logic in Action.js: if (user.jwt) -> setItem. 
                // If 2FA enabled, user.jwt might be null or we just navigate.
                // Let's return the whole user object or handle 2FA specifically.
                // For consistency with old reducer: payload was user.jwt.
            }
            if (user.jwt) {
                localStorage.setItem("jwt", user.jwt);
                userData.navigate("/");
                return user.jwt;
            }
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data ? error.response.data : error.message);
        }
    }
);

export const twoStepVerification = createAsyncThunk(
    "auth/twoStepVerification",
    async ({ otp, session, navigate }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/two-factor/otp/${otp}`,
                {},
                { params: { id: session } }
            );
            const user = response.data;
            if (user.jwt) {
                localStorage.setItem("jwt", user.jwt);
                navigate("/");
                return user.jwt;
            }
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data ? error.response.data : error.message);
        }
    }
);

export const getUser = createAsyncThunk(
    "auth/getUser",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            // Old action dispatched only message or null
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch }) => {
        localStorage.clear();
        return null;
    }
)

export const sendVerificationOtp = createAsyncThunk(
    "auth/sendVerificationOtp",
    async ({ jwt, verificationType }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/api/users/verification/${verificationType}/send-otp`,
                {},
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async ({ jwt, otp }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/api/users/verification/verify-otp/${otp}`,
                {},
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const enableTwoStepAuthentication = createAsyncThunk(
    "auth/enableTwoStepAuthentication",
    async ({ jwt, otp }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/api/users/enable-two-factor/verify-otp/${otp}`,
                {},
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendResetPassowrdOTP = createAsyncThunk(
    "auth/sendResetPassowrdOTP",
    async ({ sendTo, verificationType, navigate }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/users/reset-password/send-otp`,
                { sendTo, verificationType }
            );
            const user = response.data;
            navigate(`/reset-password/${user.session}`);
            return user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const verifyResetPassowrdOTP = createAsyncThunk(
    "auth/verifyResetPassowrdOTP",
    async ({ otp, password, session, navigate }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/auth/users/reset-password/verify-otp`,
                { otp, password },
                { params: { id: session } }
            );
            navigate("/password-update-successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    user: null,
    loading: false,
    error: null,
    jwt: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => { state.loading = false; state.jwt = action.payload; })
            .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Login
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.loading = false; state.jwt = action.payload; })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Two Step Verification
            .addCase(twoStepVerification.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(twoStepVerification.fulfilled, (state, action) => { state.loading = false; state.jwt = action.payload; })
            .addCase(twoStepVerification.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Get User
            .addCase(getUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Logout
            .addCase(logout.fulfilled, (state) => { state.jwt = null; state.user = null; state.loading = false; })

            // Send Verification OTP
            .addCase(sendVerificationOtp.pending, (state) => { state.loading = true; })
            .addCase(sendVerificationOtp.fulfilled, (state) => { state.loading = false; }) // Old reducer didn't intentionally store payload?
            .addCase(sendVerificationOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Verify OTP
            .addCase(verifyOtp.pending, (state) => { state.loading = true; })
            .addCase(verifyOtp.fulfilled, (state) => { state.loading = false; })
            .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Enable Two Step
            .addCase(enableTwoStepAuthentication.pending, (state) => { state.loading = true; })
            .addCase(enableTwoStepAuthentication.fulfilled, (state) => { state.loading = false; })
            .addCase(enableTwoStepAuthentication.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Reset Password OTP
            .addCase(sendResetPassowrdOTP.pending, (state) => { state.loading = true; })
            .addCase(sendResetPassowrdOTP.fulfilled, (state) => { state.loading = false; })
            .addCase(sendResetPassowrdOTP.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Verify Reset Password OTP
            .addCase(verifyResetPassowrdOTP.pending, (state) => { state.loading = true; })
            .addCase(verifyResetPassowrdOTP.fulfilled, (state) => { state.loading = false; })
            .addCase(verifyResetPassowrdOTP.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    },
});

export default authSlice.reducer;
