// authService.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUp,
  signIn,
  updateUser,
  uploadAvatar,
} from "../../Services/api.js";
import {
  authSuccess,
  authFailure,
  logoutSuccess,
  startAuth,
} from "../slices/authSlice.js";


// Sign Up Thunk
export const handleSignUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { dispatch }) => {
    try {
      dispatch(startAuth());
      const response = await signUp(userData );
      ("response ======>>>  ", response);

      dispatch(authSuccess({ user: response.results, token: response.token }));
      return response;
    } catch (error) {
      dispatch(authFailure(error.message));
    }
  }
);

export const signInThunk = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await signIn({ email, password });
      ("Response :: => ", response);
      localStorage.setItem("user", JSON.stringify(response.userData_login));

      dispatch(
        authSuccess({
          user: response.userData,
          token: response.token,
        })
      );
      return response;
    } catch (error) {
      dispatch(
        authFailure(error.response ? error.response.data : error.message)
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Logout Thunk
export const handleLogout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(authFailure(error.message));
    }
  }
);
export const handleUpdateUser = createAsyncThunk(
  "auth/updateUser",
  async (
    { updatedData, profilePic },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      dispatch(startAuth());

      const state = getState();
      const { user, token } = state.auth;
      const userId = user._id;

      const updateResponse = await updateUser(userId, updatedData, token);
      ("Update Response =>", updateResponse);

      let userUpdated = { ...user, ...updatedData };

      if (profilePic) {
        const avatarResponse = await uploadAvatar(userId, profilePic, token);
        userUpdated = { ...userUpdated, profilePic: avatarResponse.profilePic };
      }
      dispatch(authSuccess({ user: userUpdated, token }));
      localStorage.setItem("user", JSON.stringify(userUpdated));

      return userUpdated;
    } catch (error) {
      console.error("Error updating user:", error);
      return rejectWithValue(error.message);
    }
  }
);

