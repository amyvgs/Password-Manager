import { useEffect, useState } from "react";
import CategoryBox from "./CategoryBox";
import CategoryDisplay from "./CategoryDisplay";
import { useCategoryContext } from "../../hooks/CategoryProvider";

const ViewCategories = ({}) => {
    const {userCategories, uiUpdateCategory} = useCategoryContext();

    const [showDisplay, setShowDisplay] = useState(false);
    const [chosenCategory, setChosenCategory] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState(userCategories);

    const onInputChange = (e) => {
        const userFilter = userCategories.filter((category) => {
            return category.category_name.toLowerCase().includes(e.target.value.toLowerCase());
        })

        setFilteredCategories([...userFilter]);
    }

    useEffect(() => {
        setFilteredCategories(userCategories);
    }, [userCategories])

    return (
        <div className="flex flex-col w-full h-4/5 items-center justify-center bg-gray-100 shadow-lg p-10 font-Roboto max-sm:overflow-y-auto">
            {!showDisplay &&
             <div className="flex flex-row items-center justify-center w-full h-1/5 gap-5">
                <input onChange={onInputChange} placeholder="Search Categories..." className="bg-white/50 rounded-3xl w-5/6 p-2 border-2 border-gray-300 shadow-sm" />
            </div>}

            {showDisplay ?
            <CategoryDisplay category={chosenCategory} setShowDisplay={setShowDisplay} uiUpdateCategory={uiUpdateCategory} setChosenCategory={setChosenCategory} />
            :
            <div className="grid grid-cols-3 max-sm:grid-cols-2 w-full h-4/5 overflow-y-scroll text-center bg-gray-200 shadow-inner p-5 gap-5">
                {userCategories.length === 0 ?
                    <p className="flex h-full justify-center items-center col-span-3 font-semibold text-2xl ">You Have No Categories Stored</p>
                    :
                    filteredCategories.map((category, index) => {
                        return <CategoryBox setChosenCategory={setChosenCategory} setShowDisplay={setShowDisplay} key={index} category={category} />
                    })
                }
            </div>
            }
        </div>
    );
}

export default ViewCategories;