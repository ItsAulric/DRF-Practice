import styles from "./DashboardPage.module.css";

import axios from "axios";
import Cookies from 'js-cookie';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DashboardPage() {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    // useEffect to check if the browser has any stored valid credentials
    useEffect(() => {                                               
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
                navigate("/login");
            }
        }
        isLoggedIn();
    }, []); 

    const handleLogout = async () => {
        setLoading(true);

        if (loading) return; // Prevent multiple submissions while loading
        
        try {
            // csrftoken is received from the login response from django backend stored in the browser cookies.
            // We need to send this token in the headers of the logout request to prevent CSRF attacks.
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

            if (response.data.success === true) {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    // ====================== Posts =========================
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/ratings/post/",
                    { withCredentials: true }
                );
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    const [showReview, setShowReview] = useState(null);

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

            <div className={styles.postsContainer}>
                <h1>Posts</h1>
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    <div className={styles.postsList}>
                        {posts.map((post) => (
                            <div key={post.id} className={styles.breakthis}>
                                <div className={styles.postItem}>
                                    <h2>{post.title}</h2>
                                    <p>Rating: {post.average_rating}</p>
                                    <button
                                        onClick={() => {setShowReview(showReview === post.id ? null : post.id);}}>
                                        {showReview === post.id ? "Cancel review" : "Leave a review"}
                                    </button>
                                </div>
                                {showReview === post.id
                                    ? <RatingForm post_id={post.id} user_id={userData.id} average_rating={post.average_rating}/> 
                                    : null
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className={styles.authButton} onClick={handleLogout}>{loading ? "Logging out..." : "Logout"}</button>
        </div>
    )
}

import BasicRating from "./BasicRating";
import * as React from 'react';
import { popperClasses } from "@mui/material/Popper";

function RatingForm(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [value, setValue] = React.useState(0);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);

        try {
            const post_id = props.post_id;
            const rating = value;
            const response = await axios.post(
                'http://127.0.0.1:8000/api/ratings/rate/',
                { post_id, rating },
                {
                    withCredentials: true,
                    headers : {
                        "X-CSRFToken": Cookies.get("csrftoken")
                    }
                }
            );
            setMessage(response.data.message);
            setLoading(false);
        } catch (error) {
            setError("mama mo");
            setLoading(false);
        }
    }
    
    return (
        <form className={styles.rateForm} onSubmit={handleSubmit}>
            <h2>Review Form</h2>
            <BasicRating value={value} setValue={setValue} average_rating={props.average_rating}
            post_id={props.post_id} user_id={props.user_id}/>
            <br />
            {error ? <h1>mama mo</h1> : <h1>{message}</h1>}
            <button type="submit">Submit</button>
        </form>
    )
}