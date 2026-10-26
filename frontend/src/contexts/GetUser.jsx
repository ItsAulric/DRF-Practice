
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/auth/user/',
                { withCredentials: true }
            );

            setUserData(response.data);
            return response.data;
        } catch (error) {
            setUserData(null);

            if (
                error.response?.status !== 401 &&
                error.response?.status !== 403
            ) {
                console.error('Failed to fetch user:', error);
            }

            return null;
        } finally {
            setAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider
            value={{
                userData,
                setUserData,
                authLoading,
                fetchUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (context === null) {
        throw new Error('useUser must be used inside UserProvider');
    }

    return context;
}
