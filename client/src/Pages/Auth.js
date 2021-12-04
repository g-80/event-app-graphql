import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./Auth.css";

const Auth = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isSignIn, setSignIn] = useState(false);

  const authToken = useContext(AuthContext);
  const { setAuthValues } = authToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailValue.trim().length === 0 || passwordValue.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        mutation CreateUser($email: String!, $password: String!){
          createUser(userInput: {email: $email password: $password}) {
            _id
            email
          }
        }
      `,
      variables: {
        email: emailValue,
        password: passwordValue,
      },
    };

    if (isSignIn) {
      requestBody = {
        query: `
          query Login($email: String!, $password: String!){
            login(email: $email password: $password) {
              userId
              token
              tokenExpiration
            }
          }
        `,
        variables: {
          email: emailValue,
          password: passwordValue,
        },
      };
    }

    try {
      const response = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed request");
      }
      const responseJson = await response.json();
      if (isSignIn) {
        setAuthValues(
          responseJson.data.login.userId,
          responseJson.data.login.token,
          responseJson.data.login.tokenExpiration
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-form-container">
      <h1 className="auth-heading">{isSignIn ? "Sign In" : "Sign Up"}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-control">
          <label htmlFor="email">Email</label>
          <input
            className="auth-input"
            id="email"
            type="email"
            autoComplete="off"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          ></input>
        </div>
        <div className="auth-control">
          <label htmlFor="password">Password</label>
          <input
            className="auth-input"
            id="password"
            type="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          ></input>
        </div>
        <div className="form-btns-container">
          <button className="form-btn-submit btn-primary" type="submit">
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
          <button
            className="form-btn-switch btn-secondary"
            type="button"
            onClick={() => setSignIn((prev) => !prev)}
          >
            Switch to {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
