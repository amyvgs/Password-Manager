import { useNavigate } from "react-router-dom";
import frontImage from "../assets/frontImage.png";
import Header from "../components/Header";

export default function Home() {
    // useNavigate to go to create account
    const nav = useNavigate();

    // function to send user to create account
    const navigateCreateAccount = () => {
        nav("/createAccount");
    }

    return (
        <div className="bg-gradient-to-tl bg-blue-300 flex flex-col justify-start w-full h-full z-20 overflow-y-hidden max-sm:overflow-y-auto">
            <div className="flex lg:flex-row max-sm:flex-col justify-center items-center text-center w-screen h-screen animate-fadeIn">
                <div className="flex flex-col items-center justify-center w-3/5 h-full p-10 bg-gradient-to-r from-white via-white to-transparent">
                    <div className="flex flex-row items-center justify-start space-x-3 w-full mb-5">
                        <div><h1 className="font-Roboto max-sm:text-2xl text-7xl text-blue-700 font-light ">Passwords Are Sacred.</h1></div>
                    </div>

                    <div className="flex w-full text-start px-5 font-Roboto mb-10">
                        <h1>We believe that you should securely store your passwords with no worries. That's where we come in. With PasswordSafe you can securely store and access all your passwords with ease.</h1>
                    </div>

                    <div className="flex flex-row items-center justify-center space-x-5 w-full">
                        <button onClick={navigateCreateAccount} className="rounded-3xl p-3 text-white text-xl bg-blue-800 hover:bg-blue-700 w-1/2 hover:scale-105 transition-all ease-in-out duration-600">Start Here</button>
                    </div>

                    
                </div>

                <div className="w-2/5 object-fill">
                    <img src={frontImage} width={550} height={550}/>
                </div>

            </div>
            <div className="absolute bottom-0 bg-blue-800 w-full h-20"></div>
        </div>
    );
}