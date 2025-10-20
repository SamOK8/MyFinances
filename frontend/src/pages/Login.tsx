import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(''); // po 3 sekundách smaž chybu
            }, 3000);

            // 🧹 Vyčištění timeoutu, pokud se `error` změní dříve
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
            const res = await fetch(`${apiUrl}/api/auth/login`, {
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
        <div className="loginForm">

            <form onSubmit={handleLogin} className="box" >
                <label htmlFor="email">E-mail:</label>
                <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                <br/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                <br/>
                <div className="loginButtons">
                    <button type="submit">Login</button>
                    <button onClick={()=> navigate("/register")}>New account: Register</button>
                </div>
                {error && <p className="errorText">{error}</p>}
            </form>

        </div>
    );
};

export default Login;
