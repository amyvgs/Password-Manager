import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const baseURL = import.meta.env.VITE_API_URL;

    // on initial component render, check if there is accessToken, if so then user is valid
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!sessionStorage.getItem('accessToken');
    });


    const [user, setUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem("user")) || null;
    });

    // flag to determine if forced logout is occuring
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const nav = useNavigate();
    const location = useLocation();

    // useEffect to reset isLoggingOut in case of previous logout
    useEffect(() => {
        if (isLoggingOut && location.pathname === "/login") {
            setIsLoggingOut(false);
        }
    }, [])

    const validateSession = async () => {
        let isAuth = false;

        try {
            const res = await axios.post(`${baseURL}/api/auth/me`, {}, { withCredentials: true });
            isAuth = true;

            // set and store user data
            setUser(res.data.user);
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            sessionStorage.setItem("accessToken", res.data.accessToken);

            setIsLoggedIn(true);
            nav("/userdashboard", { replace: true });  
            
        } catch (error) {
            console.log("Refresh Token is invalid");
        } 
    };


    const logout = async(forced = false) => {
        // connect to api endpoint to delete cookie safely
        try{
            await axios.post(`${baseURL}/api/auth/logout`, {}, {withCredentials: true});

            // frontend changes
            sessionStorage.clear();
            setUser(null);
            setIsLoggedIn(false);
            setIsLoggingOut(true);

        } catch(error){
            console.log("Error deleting refresh token");
            nav("/login", {replace: true});
        } 

        // complete proper action based on forced or manual logout
        if(forced === true){
            nav("/sessionExpired", { replace: true, state: { loggingOut: true } });
        } else{
            // create timer to setIsloggingOut to false
            nav("/login", {replace:true});
        }
    }


    const errorHandling = (status) => {
        // if supplied error is either 403 or 401 force logout, else return
        if (status === 403 || status === 401){
            logout(true);
        } else{
            return;
        }
    }

    return (
        <AuthContext.Provider value={{validateSession ,isLoggingOut, setIsLoggingOut, isLoggedIn, setIsLoggedIn, user, setUser, errorHandling, logout }} >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);