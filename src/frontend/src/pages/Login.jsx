//IMPORTS
import { useState } from "react";
import "./Login.css";
import {api} from '../api';

//LOGIN COMPONENT
const Login = ({ onLogin }) => {
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [error, setError] = useState("");


  const submit = async (path, body) => {

    //Endpoint Call
    const response = await api(path, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    //Display Error If Raised
    if (response.error) {
      setError(response.error);
      return;
    }

    //Set Token
    localStorage.setItem('token', response.token);
    setError("");
    onLogin();
  }

  const handleLogin = (event) => {
    event.preventDefault();
    submit("/login", { username: username, password: password });
  }

  const handleCreate = (event) => {
    event.preventDefault();
    submit("/users", { name: username, username: username, password: password });
  }

// USER INTERFACE
  return (
    <div className="login-page">
      <div className="title">Budget App</div>
      <form>
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

         <div className="button-row">
          <button type="button" onClick={handleLogin}>Login</button>
          <button type="button" onClick={handleCreate}>Create Account</button>
        </div>
        {error && <p className="error">{error}</p>}
        
      </form>
    </div>
  );
};

export default Login;