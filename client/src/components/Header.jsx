import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from './Drawer';

export default function Header() {
    // toggle dark mode 
    const [isDark, setIsDark] = useState(false);
    const nav = useNavigate();

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        document.body.classList.toggle("dark");
    }

    const navigateLogin = () => {
        nav("/login")
    }

    const navigateHome = () => {
        nav("/")
    }


    return (
        <div className="dark:bg-slate-800 fixed top-0 left-0 flex flex-row justify-between items-center w-full h-15 p-5 border-b-2 border-blue-700 z-50 bg-white overflow-x-hidden">
            <div onClick={navigateHome} className="flex flex-row hover:cursor-pointer">
                <p className="text-blue-600 text-xl">Password</p>
                <p className="text-amber-500 text-xl">Safe</p>
            </div>

            <div className='flex flex-row items-center justify-center sm:w-1/6 lg:w-1/3 space-x-10'>
                <div className='hover:bg-gray-200 hover:cursor-pointer lg:hidden md:hidden'>
                    <Drawer/>
                </div>

                <div className='flex flex-row space-x-5 max-sm:hidden max-md:hidden'>
                    <h1 className='hover:cursor-pointer hover:border-b-2 dark:hover:border-orange-300 hover:border-blue-300 dark:text-white'>About Us</h1>
                    <h1 className='hover:cursor-pointer hover:border-b-2 dark:hover:border-orange-300 hover:border-blue-300 dark:text-white'>FAQs</h1>
                </div>

                {isDark ?
                    <div onClick={toggleDarkMode} className={`hover:bg-gray-300 rounded-full p-1 transition-all ease-in duration-300`}>
                        <DarkModeIcon />
                    </div>
                    :
                    <div onClick={toggleDarkMode} className={`hover:bg-gray-300 rounded-3xl p-1 transition-all ease-in duration-300`}>
                        <LightModeIcon />
                    </div>
                }

                <button onClick={navigateLogin} className={`dark:bg-orange-500 dark:hover:bg-orange-400 bg-blue-500 hover:bg-blue-400 p-2 rounded-lg text-white font-Roboto max-sm:hidden max-md:hidden`}>Log-In</button>
            </div>
        </div>
    );
}