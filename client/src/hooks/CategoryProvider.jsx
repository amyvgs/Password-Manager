import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import api from "../api";

// create password context
const CategoryContext = createContext();

// create provider component
export const CategoryProvider = ({children}) => {

    // useStates
    const [userCategories, setUserCategories] = useState(() => {
        const userCategories = JSON.parse(sessionStorage.getItem("categories")) || [];
        return [...userCategories];
    });

    const [isLoading, setIsLoading] = useState(true);

    // general error handling for application
    const { errorHandling } = useAuthContext();


    // obtain user made cateogories
    const obtainUserCategories = async () => {
        try {
            const res = await api.post("http://localhost:3000/api/user/obtainCategories");

            // store user categories within session storage for future display
            const resCategories = res.data.userCategories;

            setUserCategories([...resCategories]);
            sessionStorage.setItem("categories", JSON.stringify(resCategories));
        } catch (error) {
            console.error(error);
            errorHandling(error.status || 500);
        } finally {
            setIsLoading(false);
        }
    };


    // ui update when adding or removing categories
    const uiAddCategories = (newCategory) => {
        setUserCategories((prev) => [...prev, newCategory]);
    }

    const uiDeleteCategories = (categoryId) => {
        setUserCategories((prevCategories) => prevCategories.filter((category) => {
            return category.category_id !== categoryId;
        }));
    }

    // function to update ui on change
    const uiUpdateCategory = (categoryID, updatedCategory) => {
        setUserCategories((prev) => prev.map((category) => {
            return category.category_id === categoryID ? updatedCategory : category;
        }))
    } 

    // delete given user category
    const deleteUserCategory = async (category_id) => {
        try {
            // optimistic update
            uiDeleteCategories(category_id);

            const res = await api.post("http://localhost:3000/api/manage/deleteCategory", { category_id: category_id });
            console.log(res.data.message);

        } catch(error){
            console.error(error);
            errorHandling(error.status || 500);
            
            // undo optimistic update -> change to recieve object and obtain id from that 
            uiAddCategories(category_id);
        }

    }

    return(
        <CategoryContext.Provider value={{deleteUserCategory, uiAddCategories, uiDeleteCategories, uiUpdateCategory, userCategories, setUserCategories, obtainUserCategories, isLoading }}>
            {children}
        </CategoryContext.Provider>
    );
}


export const useCategoryContext = () => useContext(CategoryContext);