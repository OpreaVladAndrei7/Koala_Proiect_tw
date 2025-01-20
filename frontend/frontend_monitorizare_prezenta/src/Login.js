import "./Login.css";
import "./App.css";
import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Login successful!") {
          alert("Login successful!");
          localStorage.setItem("userId", data.user_id);
          if (data.type === "OE") {
            navigate("/main");
          }
          if (data.type === "attendant") {
            navigate("/attendance");
          }
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("Failed to log in. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
    }
  };
  return (
    <div className="App">
      <div className="login container">
        <form onSubmit={handleSubmit}>
          <h1 className="mb-4 text-center text-dark">Login</h1>

          <div className="mb-3">
            <label htmlFor="emailLogin" className="form-label">
              Email address
            </label>
            <input
              id="emailLogin"
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordLogin" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordLogin"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
