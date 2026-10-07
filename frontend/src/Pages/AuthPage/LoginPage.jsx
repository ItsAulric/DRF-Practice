import styles from './Auth.module.css';

import axios from 'axios';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useCheckLogin from './hooks/useCheckLogin';

function LoginPage() {

    const navigate = useNavigate();

    // State variables for username, password, loading state, and error message
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Input handler function to update state variables based on input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
    }

    useCheckLogin(setLoading);

    // Function to handle login form submission
    const handleLogIn = async (e) => {
        e. preventDefault();

        if (loading) return;
        
        setLoading(true);

        // Check if all fields have value
        if (!username || !password) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        // POST request to django API
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/login/",
                { username, password },
                { withCredentials : true }
                // { withCredentials : true } Allows the request to send and receive cookies.
                // This is needed for Django session authentication.
            );

            if (response.data.success == true) {
                setLoading(false);
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.response.data.error);
            setPassword("");
            setLoading(false);
        }
    }

    return (
        <div className={styles.authPage}>
            <form className={styles.authForm} onSubmit={handleLogIn}>
                { loading ? <h1> Loading </h1> : <h1> Welcome Back </h1>}
                <br />

                <h3>Please enter your details.</h3>
                <br />
                
                <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    className={styles.textInput}
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                /> <br />

                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    className={styles.textInput}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                /> <br />
                
                <Link to="/forgot-password" className={styles.recoverLink}>Forgot Password?</Link>
                <br />

                <p className={styles.errorMessage}>{error}</p>

                <button type="submit" className={styles.authButton}>{ loading ? "Loading..." : "Login"}</button>
                <br />

                <p>Don't have an account? <Link to="/register" className={styles.authLink}>Register for free</Link></p>
            </form>
        </div>
    )
}

export default LoginPage;