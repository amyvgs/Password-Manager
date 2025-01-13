import { useState } from "react";
import CateogryDisplay from "./CategoryDisplay";

const CategoryBox = ({setChosenCategory, setShowDisplay, category}) => {

    // function to occur on onClick
    const showDisplayClick = () => {
        setChosenCategory(category);
        setShowDisplay(true);
    }


    return(  
        <div onClick={showDisplayClick} title={category.category_name} className="flex flex-col col-span-1 h-40 shadow-xl rounded-2xl hover:opacity-70 hover:cursor-pointer">
            <div style={{backgroundColor: category.category_color}} className={`flex flex-row justify-end h-1/2 border-b-2`}>

            </div>

            <div className="flex justify-center items-center h-1/2 font-Roboto font-semibold text-xl bg-gray-300 text-gray-600 max-sm:truncate">
                {category.category_name}
            </div>

        </div>
    );
}


export default CategoryBox;