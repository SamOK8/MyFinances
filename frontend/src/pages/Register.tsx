import React, {useEffect, useState} from "react";

const Register = () => {
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
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 400) {
            setError("user with email already exists");
        }else if (!response.ok) {
            throw new Error("");
        }

        }catch (err: any) {
            setError("failed to register");
            console.error(err.message);
        }
    }



    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">E-mail:</label>
                <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                <br/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}
                       required/>
                <br/>

                <button type="submit">Register</button>
            </form>
            <h3>{error}</h3>

        </div>
    );
};

export default Register;
