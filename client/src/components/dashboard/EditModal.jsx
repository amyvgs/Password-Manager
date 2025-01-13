import { useEffect, useRef, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import SelectCategoryBox from "./SelectCategoryBox";
import api from "../../api";
import { useAuthContext } from "../../hooks/AuthProvider";
import { useCategoryContext } from "../../hooks/CategoryProvider";

const EditModal = ({ type, value, setOpenEdit, uiUpdateChange, uiUpdateDelete, updateCurrent }) => {
    // error handling
    const { errorHandling } = useAuthContext();
    const {uiAddCategories} = useCategoryContext();

    // useStates for password attributes
    const [passwordName, setPasswordName] = useState(value.password_name || "");
    const [password, setPassword] = useState(value.password || null);
    const [createNewCategory, setCreateNewCategory] = useState(false);
    const [passwordCategory, setPasswordCategory] = useState(value.category || "");
    const [newCategoryName, setNewCategoryName] = useState("");

    // useState for changing category
    const [originalCatName, setOriginalCatName] = useState(value.category || "");
    const [categoryName, setCategoryName] = useState(value.category_name || "");
    const [categoryColor, setCategoryColor] = useState(value.category_color || "");


    // cancel function
    const cancelEdit = () => {
        setPassword(null);
        setPasswordCategory(null);
        setOpenEdit(false);
    }

    // function to create changes on backend
    const handleUpdate = async () => {
        // conditionally decide url and body information
        const currId = type === "password" ? value.password_id : value.category_id;
        const url = type === "password" ? "http://localhost:3000/api/manage/updatePassword" : "http://localhost:3000/api/manage/updateCategory";
        const body = type === "password" ?
            {
                password_id: value.password_id, 
                password_name: passwordName, 
                password: password, 
                category: createNewCategory ? newCategoryName : passwordCategory, 
                category_color: passwordCategory === null ? "" : categoryColor, 
                last_updated: Date.now() 
            }
            : 
            { 
                category_id: value.category_id, 
                category_name: categoryName, 
                category_color: categoryColor 
            }

        let res;

        // connect to api and optimistically update
        try {
            res = await api.post(url, body)
            uiUpdateChange(currId, body);
            console.log(res.data.message);
        } catch (error) {
            console.log(error);
            errorHandling(error.status || 500);
        } finally {
            if (type === "category") {
                updateCurrent(categoryName, categoryColor);
            }

            if(uiUpdateDelete && type === "password" && originalCatName !== passwordCategory){
                uiUpdateDelete(value.password_id);
            }

            // look to see if category exists before optimistically updating;
            if (createNewCategory) {
                uiAddCategories({ category_id: res.data.category_id, category_name: res.data.category_name, category_color: categoryColor });
            }

            setOpenEdit(false);

        }
    }

    return (
        <div onClick={cancelEdit} className="fixed inset-0 flex justify-center items-center w-full h-full z-50 bg-black/60">
            <div onClick={(e) => e.stopPropagation()} className="w-1/2 h-4/6 max-sm:w-3/4 flex flex-col justify-center items-center bg-gray-100 font-Roboto p-5 shadow-2xl shadow-black/60 rounded-lg overflow-y-auto">
                <h1 className="font-bold text-3xl mb-10">{type === "password" ? "Edit Password" : "Edit Category"}</h1>

                {type === "password" ?
                    <div className="flex flex-col justify-center items-center w-full">
                        <div className="flex flex-row items-center w-full mb-5 space-x-2">
                            <div className="text-start font-semibold text-lg text-gray-500">Name:</div>
                            <input className="w-full border-b-2 border-orange-500 bg-transparent focus:outline-none focus:border-b-4 p-2" value={passwordName} onChange={(e) => setPasswordName(e.target.value)} />
                        </div>

                        <div className="flex flex-row items-center w-full mb-5 space-x-2">
                            <div className="text-start font-semibold text-lg text-gray-500">Password:</div>
                            <input className="w-full border-b-2 border-orange-500 bg-transparent focus:outline-none focus:border-b-4 p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <SelectCategoryBox chosenCategory={passwordCategory} setChosenOption={setPasswordCategory} categoryColor={categoryColor} setCategoryColor={setCategoryColor} createNewCategory={createNewCategory} setCreateNewCategory={setCreateNewCategory} newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName} />

                    </div>
                    :
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="flex flex-row items-center w-full mb-5 space-x-2">
                            <div className="text-start font-semibold text-lg text-gray-500">Name:</div>
                            <input className="w-full border-b-2 border-orange-500 bg-transparent focus:outline-none focus:border-b-4 p-2" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        </div>

                        <div className="flex flex-row items-center justify-center w-full mb-10 space-x-3">
                            <div className="text-start font-semibold text-lg text-gray-500">Color:</div>
                            <input onChange={(e) => setCategoryColor(e.target.value)} value={categoryColor} type="color" />
                        </div>


                    </div>
                }

                <div className="flex justify-center items-center flex-row space-x-5">
                    <button onClick={handleUpdate} className="rounded-2xl text-white bg-green-600 p-2 hover:bg-green-500">Update <CheckIcon /></button>
                    <button onClick={cancelEdit} className="rounded-2xl p-2 text-white bg-red-600 hover:bg-red-500">Cancel <ClearIcon /></button>
                </div>
            </div>
        </div>
    );
}

export default EditModal;