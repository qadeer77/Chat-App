import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circles } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import axios from 'axios';
import cors from 'cors';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address", "error");
      return;
    }

    if (!validatePassword(password)) {
      Swal.fire(
        "Invalid Password",
        "Please enter a password with a minimum of 6 characters",
        "error"
      );
      return;
    }

    setIsLoading(true);

    const data = {
      email: email,
      password: password,
    };

    axios
      .post(
        "https://51b4-202-47-49-109.ngrok-free.app/api/v1/users/login",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("response====>>> ", response.status);
        if (response.status === 200) {
          navigate("/chat");
        } else {
          Swal.fire("Login Failed", "Invalid credentials", "error");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Login Failed", "An error occurred during login", "error");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const socket = io('https://51b4-202-47-49-109.ngrok-free.app', {
      cors: true,
    });

    socket.on('connect', () => {
      console.log('User connected via socket');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from socket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={`login-form-container ${isLoading ? 'blur' : ''}`}>
      <h2 className="form-title">Login</h2>
      <form>
        <label>
          Email:
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button
          type="button"
          className="form-button"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {isLoading ? (
        <div className="loader-overlay">
          <Circles height={80} width={80} radius={9} color="green" ariaLabel="loading" />
        </div>
      ) : null}
    </div>
  );
}

export default Login;
