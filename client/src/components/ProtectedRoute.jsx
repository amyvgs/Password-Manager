import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthProvider";
import { cloneElement } from "react";

const ProtectedRoute = ({children}) => {
   const { isLoggedIn, isLoggingOut,  errorHandling } = useAuthContext();

    // if user is not valid, send to login page
    if (!isLoggedIn && !isLoggingOut){
        return <Navigate to="/login"/>
    }
    return cloneElement(children, { errorHandling })
};

export default ProtectedRoute;