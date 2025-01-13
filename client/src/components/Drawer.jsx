import { useEffect, useRef, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { createPortal } from "react-dom";

export default function Drawer(){
    const drawerDisplay = [
        {name: "About Us"},
        {name: "FAQs"},
        {name: "Login"}
    ]


    const [isOpen, setIsOpen] = useState(false);

    // ref for drawer dropdown
    const divRef = useRef(null);

     // close popup by clicking out of box
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (divRef.current && !divRef.current.contains(event.target)){
                    setIsOpen(false);
                }
            };
            
            // event listener
            document.addEventListener("mousedown", handleClickOutside);
    
            // clean event listener
            return () => {document.removeEventListener("mousedown", handleClickOutside)};
        }, [])

    return(
        <>
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 h-10 w-10 z-20">
                <MenuIcon />
            </div>

            {isOpen && 
                createPortal(
                <div onClick={() => setIsOpen(false)} className="flex flex-col items-center fixed inset-0 w-screen h-screen bg-black/50 md:hidden lg:hidden">
                    <div onClick={(e) => e.stopPropagation()} className="absolute flex flex-col justify-start items-center w-3/4 h-1/2 bg-white top-24 opacity-100 transition-all dark:bg-slate-700">
                        {drawerDisplay.map((element, index) => {
                            return(
                                <div key={index} className="flex flex-row justify-center items-center text-blue-400 w-full p-2 border-b-2 text-2xl hover:bg-gray-300 hover:cursor-pointer dark:bg-slate-700 dark:text-orange-400 dark:hover:bg-slate-900">
                                    {element.name}
                                </div>
                            );
                        })}
                    </div>

                </div>, document.body
                )
            }
            
        </>
    );
}