import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PasswordBox from "./PasswordBox";
import EditButton from "./EditButton";
import usePasswords from "../../hooks/usePassword";
import loading from "../../assets/loading.png";
import { useCategoryContext } from "../../hooks/CategoryProvider";

const CategoryDisplay = ({
  category,
  setShowDisplay,
  setChosenCategory,
  uiUpdateCategory,
}) => {
  const { deleteUserCategory } = useCategoryContext();
  const {
    isLoading,
    allPasswords,
    setAllPasswords,
    uiUpdateChange,
    uiUpdateDelete,
    handleDeletePassword,
  } = usePasswords("category", { category_id: category.category_id });

  const [categoryName, setCategoryName] = useState(
    category.category_name || ""
  );
  const [categoryColor, setCategoryColor] = useState(
    category.category_color || ""
  );

  // update current category ui
  const updateCurrent = (name, color) => {
    setCategoryName(name);
    setCategoryColor(color);

    // update current passwords with new potential values;
    setAllPasswords((prev) =>
      prev.map((password) => {
        const newPass = {
          ...password,
          category_color: color,
          category_name: name,
        };
        return newPass;
      })
    );
  };

  // function for back button
  const backAction = () => {
    setChosenCategory(null);
    setShowDisplay(false);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteUserCategory(category.category_id);
      setShowDisplay();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full">
      <div className="w-full justify-between">
        <div
          onClick={backAction}
          className="flex items-center justify-center w-10 p-3 hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-800 rounded-2xl"
        >
          <ArrowBackIcon />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full text-4xl font-bold mb-5">
        <h1 style={{ color: categoryColor }}>{categoryName}</h1>
        <EditButton
          type="category"
          value={category}
          handleDelete={handleDeleteCategory}
          uiUpdateChange={uiUpdateCategory}
          updateCurrent={updateCurrent}
        />
      </div>

      <div className="flex flex-col items-center justify-start w-full h-4/5 bg-gray-200 dark:bg-slate-800 p-5 overflow-y-scroll">
        {isLoading ? (
          <div className="flex flex-col w-full h-full justify-center items-center">
            <img
              src={loading}
              className="animate-spin"
              width={40}
              height={40}
            />
            <h1 className="font-semibold text-2xl">Loading...</h1>
          </div>
        ) : (
          allPasswords.map((password, index) => {
            return (
              <PasswordBox
                key={index}
                index={index}
                password={password}
                uiUpdateDelete={uiUpdateDelete}
                handleDelete={handleDeletePassword}
                uiUpdateChange={uiUpdateChange}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryDisplay;
