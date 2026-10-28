
import styles from "./DashboardPage.module.css";

import axios from "axios";
import Cookies from "js-cookie";

import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useUser } from "../../contexts/GetUser";
import BasicRating from "./BasicRating";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { userData, authLoading, setUserData } = useUser();

    const [posts, setPosts] = useState([]);
    const [showReview, setShowReview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authLoading || !userData) return;

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
    }, [authLoading, userData]);

    const handleLogout = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const token = Cookies.get("csrftoken");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/logout/",
                {},
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": token,
                    },
                }
            );

            if (response.data.success === true) {
                setUserData(null);
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <p>Checking authentication...</p>;
    }

    if (!userData) {
        return <Navigate to="/login" replace />;
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

            <div className={styles.postsContainer}>
                <h1>Posts</h1>

                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    <div className={styles.postsList}>
                        {posts.map((post) => (
                            <div key={post.id} className={styles.breakthis}>
                                {post.user === userData.id 
                                    ? <h1>You own this</h1> 
                                    : null
                                }
                                <div className={styles.postItem}>
                                    <h2>{post.title}</h2>
                                    <p>Rating: {post.average_rating}</p>

                                    <button
                                        onClick={() =>
                                            setShowReview(
                                                showReview === post.id
                                                    ? null
                                                    : post.id
                                            )
                                        }
                                    >
                                        {showReview === post.id
                                            ? "Cancel review"
                                            : "Leave a review"}
                                    </button>
                                </div>

                                {showReview === post.id ? (
                                    <RatingForm
                                        post_id={post.id}
                                        user_id={userData.id}
                                        average_rating={post.average_rating}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                className={styles.authButton}
                onClick={handleLogout}
                disabled={loading}
            >
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
}

function RatingForm(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [value, setValue] = useState(0);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/ratings/rate/",
                {
                    post_id: props.post_id,
                    rating: value,
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            console.error(error);
            setError("Failed to submit your review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.rateForm} onSubmit={handleSubmit}>
            <h2>Review Form</h2>

            <BasicRating
                value={value}
                setValue={setValue}
                average_rating={props.average_rating}
                post_id={props.post_id}
                user_id={props.user_id}
            />

            <br />

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}
