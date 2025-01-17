import { useEffect, useState } from "react";
import api from "../api";
import SideBar from "../components/dashboard/SideBar";
import InfoDisplay from "../components/dashboard/InfoDisplay";
import CreateIcon from "@mui/icons-material/Create";
import ListIcon from "@mui/icons-material/List";
import CategoryIcon from "@mui/icons-material/Category";
import { useCategoryContext } from "../hooks/CategoryProvider";

const Dashboard = ({ errorHandling }) => {
  const { isLoading, obtainUserCategories } = useCategoryContext();

  // all categories to display on side bar
  const categories = [
    {
      name: "Create New Password",
      shortName: "Create",
      selected: true,
      icon: <CreateIcon />,
    },
    {
      name: "See All Passwords",
      shortName: "All",
      selected: false,
      icon: <ListIcon />,
    },
    {
      name: "See Categories",
      shortName: "Categories",
      selected: false,
      icon: <CategoryIcon />,
    },
  ];

  const [allCategories, updateAllCategories] = useState(categories);

  // useEffect to obtain and store user categories
  useEffect(() => {
    obtainUserCategories();
  }, []);

  const updateCategories = (index) => {
    const newCategories = allCategories.map((element, idx) => {
      if (index !== idx) {
        element.selected = false;
      } else {
        element.selected = true;
      }
      return element;
    });

    updateAllCategories([...newCategories]);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center font-semibold text-3xl">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-row max-sm:flex-col max-sm:justify-start max-sm:mt-20 justify-center items-center w-screen h-screen dark:bg-slate-600 dark:text-white p-5 space-x-5 max-sm:space-x-0 overflow-hidden">
      <SideBar categories={allCategories} updateCategories={updateCategories} />
      <div className="max-sm:w-full  w-4/5 h-full flex flex-col items-center justify-center mt-10 max-sm:mt-0">
        {/* <button onClick={testToken} className="rounded-lg p-2 font-bold">Click Button to test token</button> */}
        <InfoDisplay errorHandling={errorHandling} categories={allCategories} />
      </div>
    </div>
  );
};

export default Dashboard;
