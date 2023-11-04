import { createSlice  } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
}

//this is for setting the local storage the auth one is for sending to the server api requests
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setCredentials: (state,action) =>{
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state,action) =>{
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials,logout } = authSlice.actions;

export default authSlice.reducer;