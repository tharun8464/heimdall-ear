import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  level3QuestionAnswered: [],
  isTestFinished: false,
};

const gamifiedPsychoSlice = createSlice({
  initialState,
  name: "gamifiedPsychoSlice",
  reducers: {
    setLevel3QuestionAnswered: (state, action) => {
      const index = state.level3QuestionAnswered.findIndex(
        item => item.id === action.payload.id,
      );

      if (index === -1) {
        state.level3QuestionAnswered.push(action.payload);
        return;
      } else {
        state.level3QuestionAnswered.splice(index, 1);
        state.level3QuestionAnswered.push(action.payload);
        return;
      }
    },

    setIsTestFinished: (state, action) => {
      state.isTestFinished = action.payload;
    },
  },
});

export const { setLevel3QuestionAnswered, setIsTestFinished } =
  gamifiedPsychoSlice.actions;
export default gamifiedPsychoSlice.reducer;
