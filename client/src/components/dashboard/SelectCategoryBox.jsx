import { useEffect, useState } from "react";
import { useCategoryContext } from "../../hooks/CategoryProvider";

const SelectCategoryBox = ({
  context,
  chosenCategory,
  setChosenOption,
  categoryColor,
  setCategoryColor,
  createNewCategory,
  setCreateNewCategory,
  newCategoryName,
  setNewCategoryName,
}) => {
  const { userCategories } = useCategoryContext();
  const contextColor = context === "create" ? "blue-600" : "orange-500";

  // base categories
  const baseCategories = [
    { category_name: "No Category" },
    { category_name: "New Category" },
  ];
  const [selectionCategories, setSelectionCategories] = useState([
    ...baseCategories,
    ...userCategories,
  ]);

  useEffect(() => {
    if (categoryColor === "") setCategoryColor(generateRandomColor());
  }, []);

  useEffect(() => {
    if (setCreateNewCategory === true) {
      setCategoryColor(generateRandomColor());
    }
  }, [setCreateNewCategory]);

  // function to generate random color
  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  // function to change chosen category
  const changeCategory = (e) => {
    const input = e.target.value;

    if (input === "New Category") {
      setCreateNewCategory(true);
      setChosenOption(input);
      return;
    }

    setCreateNewCategory(false);
    if (input === "No Category") {
      setChosenOption(null);
      return;
    }

    if (input) {
      const category = userCategories.find(
        (cat) => cat.category_name === input
      );
      setChosenOption(input);
      setCategoryColor(category.category_color);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center w-full space-x-5 p-5 mb-5">
        <div className="font-bold text-gray-600 dark:text-white">Category: </div>
        <select
          value={chosenCategory === null ? "No Category" : chosenCategory}
          onChange={(e) => changeCategory(e)}
          className={`w-4/5 bg-transparent rounded-2xl focus:outline-none border-2 border-${contextColor} dark:border-orange-600 focus:border-4 p-2`}
        >
          {selectionCategories.map((element, index) => {
            return (
              <option key={index} value={element.category_name}>
                {element.category_name}
              </option>
            );
          })}
        </select>
      </div>

      {createNewCategory && (
        <div className="flex flex-row justify-center items-center w-full h-10 space-x-5 mb-5">
          <div className="font-bold text-gray-600">New Category:</div>
          <input
            onChange={(e) => setNewCategoryName(e.target.value)}
            className={`w-3/5 bg-transparent border-b-2 px-2  border-${contextColor} focus:outline-none focus:border-b-4" placeholder="New Category Name`}
          />
          <input
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            title="Select Category Color"
            type="color"
          />
        </div>
      )}
    </>
  );
};

export default SelectCategoryBox;
