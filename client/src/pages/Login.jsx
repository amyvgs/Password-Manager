import { useEffect, useState } from "react";
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/AuthProvider";


export default function Login() {
    // useStates for login credentials
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // useState for error message
    const [errorMessage, setErrorMessage] = useState("");

    const nav = useNavigate();

    const { validateSession ,setIsLoggedIn, setUser } = useAuthContext();

    const navigateCreate = () => {
        nav("/createAccount");
    }

    useEffect(() => {
        setIsLoggedIn(false);
        // if refresh cookie is valid sign user in
        validateSession()

    }, [])


    // function to handle login submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseURL = import.meta.env.VITE_API_URL;

        try {
            // api connection
            setErrorMessage("");

            const res = await axios.post(`${baseURL}/api/auth/login`, {
                email: email,
                password: password
            }, { withCredentials: true });

            // obtain needed data to store
            const userInfo = res.data.user
            const accessToken = res.data.accessToken;
            
            // store user data in sessionStorage
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("user", JSON.stringify(userInfo));
            
            // change proper useStates
            setIsLoggedIn(true);
            setUser(userInfo);
            
            // navigate to user dashboard upon success
            nav('/userdashboard', {replace:true});
        } catch (error) {
            // display server message error to ui
            setErrorMessage(error.response.data.message);

        } finally {
            // clear ui inputs
            setEmail("");
            setPassword("");
        }


    }

    return (
        <>
            
                <div className="flex flex-col items-center justify-center w-screen h-screen bg-no-repeat bg-cover bg-[url('./assets/blueback.jpeg')] overflow-y-hidden">
                    <div className="flex flex-col items-center justify-center max-sm:w-3/4 max-md:w-3/4 w-2/6 h-2/3 mt-20 bg-white dark:bg-slate-800 dark:text-white rounded-lg p-5 shadow-xl shadow-black">
                        <h1 className="font-Roboto text-3xl font-semibold">Login</h1>
                        <h1 className="mb-2 font-Roboto">Welcome Back!</h1>

                        <p className="text-red-500 font-Roboto mb-2">{errorMessage}</p>

                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="w-full mb-7">
                                <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white" htmlFor="email">Email <EmailIcon sx={{ height: "20px", width: "20px" }} /> </label>
                                <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="email" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 dark:bg-transparent dark:border-black" placeholder="Your Email" required></input>
                            </div>

                            <div className="w-full mb-5">
                                <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white" htmlFor="password">Password <PasswordIcon sx={{ height: "20px", width: "20px" }} /></label>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 mb-2 dark:bg-transparent dark:border-black" placeholder="Your Password" required></input>
                                <p className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer">Forgot Password?</p>
                            </div>


                            <button type="submit" className="w-full dark:bg-orange-500 dark:hover:bg-orange-700  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none mb-7">Login</button>

                            <div className="w-full text-center mb-10">
                                <p onClick={navigateCreate} className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer">Do not have Account? Click here to create one!</p>
                            </div>

                        </form>
                    </div>
                </div>
        </>
    );
}