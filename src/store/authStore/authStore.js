import { createSlice } from '@reduxjs/toolkit'

// Intentamos cargar la informacion del usuario guardada en el navegador
const savedUser = JSON.parse(localStorage.getItem("infoUser")) || null;

export const authStore = createSlice({
  name: 'authStore',
  initialState: {
    infoUser  : savedUser,
    isLogin   : !!savedUser,
    token     : savedUser?.access || "",
    refreshToken: savedUser?.refresh || "",
    role      : savedUser?.role || "",
    username  : savedUser?.username || "",
    password  : "",
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, refreshToken, username, role } = action.payload;
      const userData = {
        access: token,
        refresh: refreshToken || "",
        username,
        role,
        isLogin: true,
      };
      localStorage.setItem("infoUser", JSON.stringify(userData));
      state.isLogin      = true;
      state.token        = token;
      state.refreshToken = refreshToken || "";
      state.username     = username;
      state.role         = role;
      state.infoUser     = userData;
    },
    loginFail: (state) => {
      localStorage.removeItem("infoUser");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.infoUser     = null;
      state.isLogin      = false;
      state.token        = "";
      state.refreshToken = "";
      state.username     = "";
      state.role         = "";
      state.password     = "";
    },
    logout: (state) => {
      localStorage.removeItem("infoUser");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.isLogin      = false;
      state.token        = "";
      state.refreshToken = "";
      state.username     = "";
      state.role         = "";
      state.password     = "";
      state.infoUser     = null;
    },
    setAuthenticated: (state, action) => {
      const { access, refresh, role, username } = action.payload;
      const userData = {
        access,
        refresh: refresh || "",
        role,
        username,
        isLogin: true,
      };
      localStorage.setItem("infoUser", JSON.stringify(userData));
      state.token        = access;
      state.refreshToken = refresh || "";
      state.role         = role;
      state.username     = username;
      state.isLogin      = true;
      state.infoUser     = userData;
    },
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  },
});

export const { loginSuccess, loginFail, logout, setAuthenticated, handleFormStore } = authStore.actions;
