const inintialState = {
  token: localStorage.getItem("token"),
  login: "",
  userName: "",
};

const user = (state = inintialState, action) => {
  switch (action.type) {
    case "Exit":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
      };
    case "/user/register/pending":
      return {
        ...state,
        loadUser: true,
        error: null,
      };
    case "/user/register/fulfilled":
      return {
        ...state,
        loadUser: false,
        login: action.payload.name,
      };
    case "/user/register/rejected":
      return {
        ...state,
        loadUser: false,
        error: action.error,
      };
    case "user/login/pending":
      return {
        ...state,
        loadUser: true,
        error: null,
      };
    case "/user/login/fulfilled":
      return {
        ...state,
        loadUser: false,
        token: action.payload,
      };
    case "/user/login/rejected":
      return {
        ...state,
        loadUser: false,
        error: action.error,
      };
    case "get/user/pending":
      return {
        ...state,
        loadUser: true,
        error: null,
      };
    case "get/user/fulfilled":
      return {
        ...state,
        loadUser: false,
        userName: action.payload.name,
        login: action.payload.login,
      };
    case "get/user/rejected":
      return {
        ...state,
        loadUser: false,
        message: action.payload,
        error: action.error,
      };
    default:
      return {
        ...state,
      };
  }
};

export default user;

export const registerUser = (name, login, password) => {
  return async (dispatch) => {
    dispatch({ type: "/user/register/pending" });
    try {
      const res = await fetch("http://localhost:4000/user/sign", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, login, password }),
      });
      const user = await res.json();
      if (user.user) {
        dispatch({ type: "/user/register/fullfilled", payload: user.user });
      } else {
        dispatch({
          type: "/user/register/rejected",
          payload: user,
        });
      }
    } catch (err) {
      dispatch({ type: "/user/register/rejected", error: err.toString() });
    }
  };
};
export const loginUser = (login, password) => {
  return async (dispatch) => {
    dispatch({ type: "/user/login/pending" });
    try {
      const res = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const token = await res.json();
      if (token.token) {
        dispatch({ type: "/user/login/fulfilled", payload: token.token });
        localStorage.setItem("token", token.token);
      }
    } catch (err) {
      dispatch({ type: "/user/login/rejected", error: err.toString() });
    }
  };
};

export const getUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.user.token;
    dispatch({ type: "get/user/pending" });
    try {
      const res = await fetch("http://localhost:4000/user", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await res.json();
      dispatch({
        type: "get/user/fulfilled",
        payload: {
          login: user.login,
          name: user.name,
        },
      });
    } catch (error) {
      dispatch({ type: "get/user/rejected", error });
    }
  };
};
