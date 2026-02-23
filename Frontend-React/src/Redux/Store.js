import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/AuthSlice";
import coinReducer from "./Coin/CoinSlice";
import walletReducer from "./Wallet/WalletSlice";
import orderReducer from "./Order/OrderSlice";
import assetReducer from "./Assets/AssetSlice";
import watchlistReducer from "./Watchlist/WatchlistSlice";
import withdrawalReducer from "./Withdrawal/WithdrawalSlice";

const rootReducer = {
    auth: authReducer,
    coin: coinReducer,
    wallet: walletReducer,
    order: orderReducer,
    asset: assetReducer,
    watchlist: watchlistReducer,
    withdrawal: withdrawalReducer,
};

export const store = configureStore({
    reducer: rootReducer,
});