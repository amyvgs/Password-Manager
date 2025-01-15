import { useState } from "react";
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateAccount() {
    // useStates for sign up credentials
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // useState for ui messages
    const [errorMessage, setErrorMessage] = useState("");

    // useNavigate to go to login
    const nav = useNavigate();

    // function to go to login page
    const navigateLogin = () => {
        nav("/login")
    }

    // function to handle sign up submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseURL = import.meta.env.VITE_API_URL

        try {
            // add api endpoint connection logic here
            const res = await axios.post(`${baseURL}/api/auth/register`, {
                email: email,
                username: userName,
                password: password,
                firstname: firstName,
                lastname: lastName
            }, {withCredentials: true});
            
            const accessToken = res.data.accessToken;
            sessionStorage.setItem("accessToken", accessToken);

            nav("/userdashboard");
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }finally{
            // clear ui 
            setEmail("");
            setUserName("");
            setPassword("");
            setConfirmPassword("");
            setFirstName("");
            setLastName("");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-no-repeat bg-cover bg-[url('./assets/blueback.jpeg')] overflow-y-hidden">
            <div className="flex flex-col items-center justify-start max-sm:w-3/4 max-md:w-3/4 max-sm:h-4/5 max-md:h-4/5 w-2/6 h-3/4 mt-20 bg-white dark:bg-slate-800 dark:text-white rounded-lg p-7 shadow-xl shadow-black overflow-y-auto">
                <h1 className="font-Roboto text-3xl font-semibold">Sign-Up</h1>
                <h1 className="mb-2 font-Roboto">Create Your Account Down Below!</h1>

                <p className="text-red-500 font-Roboto mb-2">{errorMessage}</p>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="w-full mb-5">
                        <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white" htmlFor="email">Email <EmailIcon sx={{ height: "20px", width: "20px" }} /> </label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="email" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 dark:bg-transparent dark:border-black" placeholder="Your Email" required></input>
                    </div>

                    <div className="w-full mb-5">
                        <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white" htmlFor="email">Username <PersonIcon sx={{ height: "20px", width: "20px" }} /> </label>
                        <input onChange={(e) => setUserName(e.target.value)} value={userName} id="userName" type="text" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 dark:bg-transparent dark:border-black" placeholder="Create Username" required></input>
                    </div>

                    <div className="flex flex-row items-center justify-center w-full mb-5 gap-5">
                        <div className="w-1/2">
                            <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white" htmlFor="password">Password <PasswordIcon sx={{ height: "20px", width: "20px" }} /></label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 mb-2 dark:bg-transparent dark:border-black" placeholder="Your Password" required></input>
                        </div>

                        <div className="w-1/2">
                            <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white max-sm:truncate max-md:truncate">Confirm Password <PasswordIcon sx={{ height: "20px", width: "20px" }} /></label>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmpassword" type="password" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 mb-2 dark:bg-transparent dark:border-black" placeholder="Confirm Password" required></input>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center w-full mb-5 gap-5">
                        <div className="w-1/2">
                            <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white">First Name <PasswordIcon sx={{ height: "20px", width: "20px" }} /></label>
                            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName" type="text" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 mb-2 dark:bg-transparent dark:border-black" placeholder="Your First Name" required></input>
                        </div>

                        <div className="w-1/2">
                            <label className="flex flex-row text-gray-700 text-sm font-bold mb-2 w-full gap-2 dark:text-white max-sm:truncate max-md:truncate">Last Name<PasswordIcon sx={{ height: "20px", width: "20px" }} /></label>
                            <input value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" type="text" className="w-full h-10 rounded-lg border-2 border-gray-500 border-opacity-35 p-2 mb-2 dark:bg-transparent dark:border-black" placeholder="Your Last Name" required></input>
                        </div>
                    </div>


                    <button type="submit" className="w-full dark:bg-orange-500 dark:hover:bg-orange-700 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none mb-7">Login</button>

                    <div className="w-full text-center mb-10 max-sm:hidden max-md:hidden">
                        <p onClick={navigateLogin} className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer">Have Account? Log In Here!</p>
                    </div>

                </form>
            </div>
        </div>
    );
}