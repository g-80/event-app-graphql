import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  const clearAuthValues = () => {
    // sign out
    setUserId(null);
    setToken(null);
    setTokenExpiration(null);
  };

  const setAuthValues = (userId, token, tokenExpiration) => {
    // sign in
    setUserId(userId);
    setToken(token);
    setTokenExpiration(tokenExpiration);
  };

  const contextValue = {
    authValues: { userId, token, tokenExpiration },
    setAuthValues,
    clearAuthValues,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
