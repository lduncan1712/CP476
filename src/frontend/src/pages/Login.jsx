//IMPORTS
import { useState } from "react";
import "./Login.css";

//LOGIN COMPONENT
const Login = ({ onLogin }) => {
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [error, setError] = useState("");

  //FORM VALIDATION
  const handleSubmit = (event) => {
    event.preventDefault();
    const isUsernameValid = username === "user";
    const isPasswordValid = password === "password";
    if (!isUsernameValid) 
    { setError("Unrecognized username, try again");
      return; }
    else if (!isPasswordValid) { setError("Incorrect password, try again");
      return; }
    else {  setError("");
             onLogin(); }
  }

// USER INTERFACE
  return (
    <div className="login-page">
      <div className="title">Budget App</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username:"
          value={username}
          onChange={(e) => set_username(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password:"
          value={password}
          onChange={(e) => set_password(e.target.value)}
        />

        <button type="submit">Sign In</button>
        {error && <p className="error">{error}</p>}
        
      </form>
    </div>
  );
};

export default Login;