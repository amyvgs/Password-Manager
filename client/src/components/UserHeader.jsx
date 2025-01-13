// user navbar to be displayed upon validated user

import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileDropDown from './ProfileDropdown';
import { useState } from 'react';
// import { white } from "@mui/material/colors" 

export default function UserHeader() {
    return (
        <>
            <div className="dark:bg-slate-800 fixed top-0 left-0 flex flex-row justify-between items-center w-full h-15 p-5 border-b-2 border-blue-700 z-40 bg-white overflow-x-hidden">
                <div className="flex justify-center items-center hover:cursor-pointer hover:bg-gray-200 w-10 h-10">
                    <SettingsIcon />
                </div>

                <div className="flex flex-row text-center font-Roboto font-semibold">
                    <p className="text-blue-600 text-2xl">Password</p>
                    <p className="text-amber-500 text-2xl">Safe</p>
                </div>

                <ProfileDropDown />


            </div>

        </>
    );
}