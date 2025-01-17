import { useEffect, useRef, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthContext } from "../hooks/AuthProvider";
import LogoutIcon from '@mui/icons-material/Logout';
import { createPortal } from 'react-dom';

export default function ProfileDropDown(){
    // import user info to component with authContext
    const { user, logout } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);


    // ref for div
    const boxRef = useRef(null);
    const buttonRef = useRef(null);

    // close popup by clicking out of box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)){
                setIsOpen(false);
            }
        };
        
        // event listener
        document.addEventListener("mousedown", handleClickOutside);

        // clean event listener
        return () => {document.removeEventListener("mousedown", handleClickOutside)};
    }, [])

    
    return(

        <div className="relative z-20"> 
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800 dark:text-white h-10 w-10 z-20">
                <AccountCircleIcon/>
            </div>

        

            {isOpen && 
                createPortal(<div onClick={(e) => e.stopPropagation()} ref={boxRef} className="absolute top-24 right-4 bg-gray-300 dark:bg-slate-800 dark:text-white flex flex-col justify-center items-center p-5  z-50 shadow-xl">
                    <div>
                        <h1>{user.username}</h1>
                    </div>

                    <div>
                        <button onClick={logout} className="rounded-lg gap-3 p-2 bg-blue-600 text-white">Logout <LogoutIcon/></button>
                    </div>
                </div>, document.body)
            } 
            
        </div>
    );

}