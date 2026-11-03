import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
    name : "customers",
    initialState : {
        items : [],
        loading : false,
        search : ""
    },
    reducers : {
        setCustomers(state, action){
            state.items = action.payload;
        },
        setSearch(state, action){
            state.search = action.payload;
        }
    }
});

export const { setCustomers, setSearch } = customerSlice.actions;

export default customerSlice.reducer;