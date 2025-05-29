import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("login failed");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError("failed to login");
            console.error(err.message);
        }


    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">E-mail:</label>
                <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                <br/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                <br/>

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
