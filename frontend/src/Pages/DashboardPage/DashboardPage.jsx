import styles from "./DashboardPage.module.css";

import axios from "axios";
import Cookies from 'js-cookie';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DashboardPage() {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {                                               // useEffect to check if the browser has any stored valid credentials
        const isLoggedIn = async () => {                            
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/auth/user/",
                    { withCredentials: true }
                );

                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        isLoggedIn();
    }, []); 

    const handleLogout = async () => {
        setLoading(true);
        
        try {
            const token = Cookies.get("csrftoken");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/logout/",
                {},
                {
                    withCredentials: true,
                    headers : {
                        "X-CSRFToken": token
                    }
                }
            );

            if (response.data.success == true) {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div className={styles.dashboard}>
            <h1>Profile Dashboard</h1>

            <div className={styles.profileContainer}>
                <div className={styles.profileLabels}>
                    <h2>Username</h2>
                    <h2>Email</h2>
                </div>

                <div className={styles.profileContent}>
                    <h2>{userData.username}</h2>
                    <h2>{userData.email}</h2>
                </div>
            </div>

            <button className={styles.authButton} onClick={handleLogout}>{loading ? "Logging out..." : "Logout"}</button>
        </div>
    )
}