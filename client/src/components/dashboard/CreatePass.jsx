import { useEffect, useState } from "react";
import PasswordStrengthInput from "../PasswordStrength";
import api from "../../api";
import SelectCategoryBox from "./SelectCategoryBox";
import { useAuthContext } from "../../hooks/AuthProvider";
import { useCategoryContext } from "../../hooks/CategoryProvider";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function CreatePassword() {
    const { errorHandling } = useAuthContext();
    const { uiAddCategories } = useCategoryContext();

    // use states
    const [password, setPassword] = useState("");
    const [passwordName, setPasswordName] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [categoryColor, setCategoryColor] = useState("");
    const [createNewCategory, setCreateNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // chosen option is chosen category
    const [chosenCategory, setChosenOption] = useState(null);

    const clearForm = () => {
        setPassword("");
        setPasswordName("");
        setChosenOption(null);
        setCreateNewCategory(false);
    }


    //function to create password instance on back end
    const submitPassword = async () => {
        // initial checks for submitting proper information
        if (passwordName === "" || password === "") {
            setMessage("Please ensure that you supply a password name and password");
            setIsError(true);
            return;
        }

        if (createNewCategory && (chosenCategory === "" || chosenCategory === null)) {
            setMessage("You Must Give A Name For A New Category");
            setIsError(true);
            return;
        }

        // variable to store axios promise, access value in all blocks
        let res;

        try {
            res = await api.post("/api/user/createPassword", { name: passwordName, password: password, chosenCategory: createNewCategory ? newCategoryName : chosenCategory, categoryColor: categoryColor });
            if (createNewCategory) {
                uiAddCategories({ category_name: createNewCategory ? newCategoryName : chosenCategory, category_id: res.data.category_id, category_color: categoryColor });
            }

            setMessage("Password Created Successfully!");
            setIsError(false);
        } catch (error) {
            errorHandling(error.status || 500);
            setMessage(error.data.response.message);
            setIsError(true);
        } finally {
            // complete ui changes after submission
            clearForm();
        }
    }

    return (
        <div className="flex flex-col w-full h-4/5 items-center justify-center bg-gray-200 shadow-lg p-10 font-Roboto max-sm:overflow-y-auto">
            <div className="w-full h-full bg-gray-300 p-5 shadow-xl">
                <h1 className="font-bold underline text-xl">Create Password</h1>
                <h1 className={`${isError ? "text-red-500" : "text-green-500"} mb-5`}> {message === "" ? <br /> : message}</h1>
                <div className="flex flex-row w-full mb-10 rounded-2xl shadow-xl">
                    <div className="flex justify-center items-center font-bold text-gray-600 bg-blue-300 h-10 p-2 border-2 border-blue-400 rounded-l-2xl">Name:</div>
                    <input value={passwordName} onChange={(e) => setPasswordName(e.target.value)} className="w-full bg-transparent border-2 rounded-r-2xl px-2  border-blue-600 focus:outline-none focus:border-4" placeholder="Enter Password Name Here" />
                </div>

                <PasswordStrengthInput password={password} setPassword={setPassword} />

                <SelectCategoryBox context="create" chosenCategory={chosenCategory} setChosenOption={setChosenOption} categoryColor={categoryColor} setCategoryColor={setCategoryColor} createNewCategory={createNewCategory} setCreateNewCategory={setCreateNewCategory} newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName} />

                <div className="flex flex-row justify-center items-center gap-4 w-full">
                    <button onClick={submitPassword} className="rounded-md py-3 px-10 bg-orange-600 text-white font-semibold hover:bg-orange-500 hover:scale-105 shadow-lg ">Create Password</button>
                    <button onClick={clearForm} title="restart" className="rounded-full hover:bg-gray-300 p-2"><RestartAltIcon /></button>
                </div>
            </div>
        </div>
    );
}