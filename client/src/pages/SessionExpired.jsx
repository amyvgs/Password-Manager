import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthProvider";

export default function SessionExpired(){
    const nav = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // if user is attempting to access page without state, redirect to home page
        if (location.state?.loggingOut !== true) nav("/")

        // set forced logout back to false
       const timer = setTimeout(() => {
            nav("/login");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return(
        <div className="w-screen h-screen flex flex-col justify-center items-center dark:bg-slate-700 font-Roboto text-3xl font-semibold">
            <div className="text-center">
                <h1 className="text-black">Session Expired. Logging you out..</h1>
            </div>
        </div>
    );
}