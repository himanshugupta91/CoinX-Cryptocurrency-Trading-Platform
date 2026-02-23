
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

// Async Thunks
export const getUserWallet = createAsyncThunk(
    "wallet/getUserWallet",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/wallet", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const getWalletTransactions = createAsyncThunk(
    "wallet/getWalletTransactions",
    async ({ jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/wallet/transactions", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("wallet transaction", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const depositMoney = createAsyncThunk(
    "wallet/depositMoney",
    async ({ jwt, orderId, paymentId, navigate }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/wallet/deposit`, null, {
                params: {
                    order_id: orderId,
                    payment_id: paymentId,
                },
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log(response.data);
            if (navigate) {
                navigate("/wallet");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
    }
);

export const paymentHandler = createAsyncThunk(
    "wallet/paymentHandler",
    async ({ jwt, amount, paymentMethod }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/api/payment/${paymentMethod}/amount/${amount}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (response.data.payment_url) {
                window.location.href = response.data.payment_url;
            }

            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const transferMoney = createAsyncThunk(
    "wallet/transferMoney",
    async ({ jwt, walletId, reqData }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `/api/wallet/${walletId}/transfer`,
                reqData,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    userWallet: {},
    loading: false,
    error: null,
    transactions: [],
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getUserWallet
            .addCase(getUserWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWallet.fulfilled, (state, action) => {
                state.userWallet = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getWalletTransactions
            .addCase(getWalletTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWalletTransactions.fulfilled, (state, action) => {
                state.transactions = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getWalletTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // depositMoney
            .addCase(depositMoney.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(depositMoney.fulfilled, (state, action) => {
                state.userWallet = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(depositMoney.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // transferMoney
            .addCase(transferMoney.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(transferMoney.fulfilled, (state, action) => {
                state.userWallet = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(transferMoney.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // paymentHandler
            .addCase(paymentHandler.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paymentHandler.fulfilled, (state, action) => {
                // Typically paymentHandler initiates a redirect, but we can store the result if needed
                // For now, mirroring legacy behavior which might not have updated specific state significantly other than loading
                state.loading = false;
                state.error = null;
            })
            .addCase(paymentHandler.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default walletSlice.reducer;
