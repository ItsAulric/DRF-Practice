import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function useCheckLogin(setLoading) {
    const navigate = useNavigate();

    // useEffect to check if the browser has any stored valid credentials
    useEffect(() => {
        const isLoggedIn = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/auth/user/",
                    { withCredentials: true }
                )

                // If response fetches ANY username, navigate to '/dashboard'
                if (response.data?.username) {
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        isLoggedIn();
    }, []);
}

export default useCheckLogin;