import { useAuthContext } from "../../hooks/AuthProvider";

const SideBar = ({ categories, updateCategories }) => {

    const {user} = useAuthContext();

    return (
        <>
            <div className="flex flex-col items-center w-1/5 h-3/4 max-sm:hidden bg-gray-200 border-2 border-gray-300 dark:bg-slate-900 shadow-xl mt-10">
                <div className="flex flex-row w-full justify-start items-center gap-5 p-2 mb-5">
                    <div className="flex justify-center items-center rounded-2xl p-3 text-lg bg-blue-500 text-white shadow-xl font-bold w-14">{user.name ? `${user.name[0]}${user.name[1]}` : "U"}</div>
                    <h1 className="text-2xl font-light">{user.name ? user.name : "User"}</h1>
                </div>

                <div className="flex items-center justify-start w-full p-2">
                    <h1 className="font-Roboto text-blue-800 font-semibold">Actions</h1>
                </div>
                {categories.map((element , index) => {
                    return (
                        <div onClick={() => updateCategories(index)} key={index} className={`${element.selected && "font-bold"} ${element.selected && 'pointer-events-none'} ${element.selected && 'bg-gradient-to-r from-blue-400 to-blue-600'} ${element.selected && 'text-white'} flex flex-row gap-4 items-center justify-start w-full p-3 font-Roboto text-blue-600 font-semibold border-b-2 border-blue-600 text-center hover:cursor-pointer hover:bg-gray-400`}>
                            <h1>{element.icon}</h1>
                            <h1>{element.name}</h1>                  
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-row w-full md:hidden lg:hidden">
                {categories.map((element, index) => {
                    return (
                        <div onClick={() => updateCategories(index)} key={index} className={`${element.selected && "font-bold"} ${element.selected && 'pointer-events-none'} ${element.selected && 'bg-gradient-to-r from-blue-400 to-blue-600'} ${element.selected && 'text-white'} w-1/3 p-2 font-Roboto text-blue-600 font-semibold border-r-2 border-blue-600 text-center hover:cursor-pointer hover:bg-gray-400`}>
                            {element.shortName}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default SideBar;