import styles from './Auth.module.css';

import axios from 'axios';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import getErrorMessage from './GetErrorMessage.js';
import useCheckLogin from './hooks/useCheckLogin.jsx';

export default function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState("register");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // useEffect to check if the browser has any stored valid credentials
    // I used this to redirect user to '/dashboard' to avoid double login
    useCheckLogin(setLoading);

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
        if (name === "email") setEmail(value);
        if (name === "confirm-password") setConfirmPassword(value);
        setError("");
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (loading) return; // Prevent multiple submissions while loading

        setLoading(true);

        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/register/",
                { username, email, password }, 
                { withCredentials: true } // we don't really need this because the browser isn't sending nor expecting any cookies
            );

            if (response.data.success == true) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                setLoading(false);
                setStep("success");
            }
        } catch (error) {
            setError(getErrorMessage(error.response.data));
            setLoading(false);
        }
    }

    return (
        <div className={styles.authPage}>
            { step === "register" && (
                <form className={styles.authForm} onSubmit={handleRegister}>
                    <h1>Create an Account</h1>
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

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        className={styles.textInput}
                        id="email"
                        name="email"
                        value={email}
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
                    
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input 
                        type="password" 
                        className={styles.textInput}
                        id="confirm-password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={handleChange}
                    /> <br />

                    <p className={styles.errorMessage}>{error}</p>
                    <button type="submit" className={styles.authButton}>{ loading ? "Loading..." : "Register"}</button> 

                    <br />

                    <p>Already have an account? <Link to="/login" className={styles.authLink}>Log in</Link></p>
                </form>
            )}

            { step === "success" && (
                <SuccessNotificationPage />
            )}
        </div>
    )
}

function SuccessNotificationPage() {

    const navigate = useNavigate();

    return (
        <div className={styles.authPage}>
            <div className={styles.notificationContainer}>
                <h1>Account Created Successfully!</h1>
                <br />
               
                <button 
                    className={styles.authProceed}
                    onClick={(() => {navigate("/login")})}
                >Continue to Login</button>
            </div>
        </div>
    )
}