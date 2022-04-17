import { createSlice } from "@reduxjs/toolkit";
import { Token } from "../Interfaces/IToken";

const initialState: Token = {
	token: "",
};

export const userTokenSlice = createSlice({
	name: "userToken",
	initialState,
	reducers: {
		saveToken: (state, action) => {
			state.token = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { saveToken } = userTokenSlice.actions;

export default userTokenSlice.reducer;