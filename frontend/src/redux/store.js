// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // make sure path is correct
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrdersReducer from "./slices/adminOrderSlice";



const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        order: orderReducer,
        admin:adminReducer,
        adminProducts:adminProductReducer,
        adminOrders:adminOrdersReducer,


    },
});

export default store;
