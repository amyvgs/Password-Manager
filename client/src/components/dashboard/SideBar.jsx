import { useAuthContext } from "../../hooks/AuthProvider";
import ThemeToggle from "../ThemeToggle";

const SideBar = ({ categories, updateCategories }) => {
  const { user } = useAuthContext();

  return (
    <>
      <div className="flex flex-col items-center justify-between w-1/5 h-3/4 max-sm:hidden bg-gray-200 border-2 border-gray-300 dark:bg-slate-700 dark:border-slate-800 shadow-xl mt-10">
        <div className="flex flex-col items-center justify-start w-full p-2">
          <div className="flex flex-row w-full justify-start items-center gap-5 p-2 mb-5">
            <div className="flex justify-center items-center rounded-2xl p-3 text-lg bg-blue-500 dark:bg-orange-500 text-white shadow-xl font-bold w-14">
              {user.name ? `${user.name[0]}${user.name[1]}` : "U"}
            </div>
            <h1 className="text-2xl font-light">
              {user.name ? user.name : "User"}
            </h1>
          </div>

          <p className="font-Roboto text-blue-800 dark:text-orange-700 font-semibold">Actions</p>

          {categories.map((element, index) => {
            return (
              <div
                onClick={() => updateCategories(index)}
                key={index}
                className={`${element.selected && "font-bold"} ${
                  element.selected && "pointer-events-none"
                } ${
                  element.selected &&
                  "bg-gradient-to-r from-blue-400 to-blue-600 dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-600"
                } ${
                  element.selected && "!text-white !transition-none"
                } flex flex-row gap-4 items-center justify-start w-full p-3 font-Roboto dark:text-orange-600 text-blue-600 font-semibold border-b-2 border-blue-600 dark:border-orange-600 text-center hover:cursor-pointer hover:bg-gray-400 dark:hover:bg-slate-800 !transition-none`}
              >
                <h1>{element.icon}</h1>
                <h1>{element.name}</h1>
              </div>
            );
          })}
        </div>

        <ThemeToggle />
      </div>

      <div className="flex flex-row w-full md:hidden lg:hidden">
        {categories.map((element, index) => {
          return (
            <div
              onClick={() => updateCategories(index)}
              key={index}
              className={`${element.selected && "font-bold"} ${
                element.selected && "pointer-events-none"
              } ${
                element.selected && "bg-gradient-to-r from-blue-400 to-blue-600"
              } ${
                element.selected && "text-white !transition-none"
              } w-1/3 p-2 font-Roboto text-blue-600 font-semibold border-r-2 border-blue-600 text-center hover:cursor-pointer hover:bg-gray-400 !transition-none`}
            >
              {element.shortName}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SideBar;
