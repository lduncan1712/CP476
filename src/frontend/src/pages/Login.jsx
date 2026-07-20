//IMPORTS
import { useState } from "react";
import "./Login.css";
import {api} from '../api';

//LOGIN COMPONENT
const Login = ({ onLogin }) => {
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [error, setError] = useState("");

  //FORM VALIDATION
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await api("/login", {
        method: 'POST', 
        body: JSON.stringify({username: username, password: password})
    });

    if (response.error) {
      setError(response.error);
      return;
    }

    localStorage.setItem('token', response.token);
    setError("");
    onLogin();
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