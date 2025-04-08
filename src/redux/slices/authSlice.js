import { createSlice } from "@reduxjs/toolkit";
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (user === null || user === undefined) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  token: localStorage.getItem("token") || null,
  isAuthenticated:
    !!localStorage.getItem("token") && !!localStorage.getItem("user"),
  isLoading: false,
  error: null,
  preferences: {
    languageChecked: false,
    offersAndPackages: false,
    notifications: false,
    renewalSubscription: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    authFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUserPreferences(state, action) {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
  },
});

export const {
  startAuth,
  authSuccess,
  authFailure,
  logoutSuccess,
  updateUserPreferences,
} = authSlice.actions;
export default authSlice.reducer;
