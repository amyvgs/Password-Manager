import { useEffect, useState } from "react";
import api from "../api";
import { useAuthContext } from "./AuthProvider";

const usePasswords = (context, info) => {
    // error handling from global auth context
    const {errorHandling} = useAuthContext();

    // useStates 
    const [isLoading, setIsLoading] = useState(true);
    const [allPasswords, setAllPasswords] = useState([]);

    const uiUpdateDelete = (passID) => {
        setAllPasswords((prev) => prev.filter((password) => {
            return password.password_id !== passID;
        }))
    }

    // function to update ui on change
    const uiUpdateChange = (passID, updatedPassword) => {
        setAllPasswords((prev) => prev.map((pass) => {
            return pass.password_id === passID ? updatedPassword : pass;
        }))
    }

    // function to delete current password, potentially move logic into hook
    const handleDeletePassword = async (passwordId, password) => {
        // attempt to delete on backend
        try {
            const res = await api.post("http://localhost:3000/api/manage/deletePassword", { password_id: passwordId });
            uiUpdateDelete(passwordId);
        } catch (error) {
            console.error(error);
            errorHandling(error.status || 500);

            // if failed replenish deleted password
            setAllPasswords([...allPasswords, { password }])
        }
    }

    // useEffect to update allPasswords with the context of the passwords givem
    useEffect(() => {
        const obtainPasswords = async () => {
            const url = context === "all" ? "http://localhost:3000/api/user/obtainPasswords" : "http://localhost:3000/api/user/obtainPasswordsWithCat";

            try {
                const res = await api.post(url, info, { withCredentials: true });
                setAllPasswords(res.data.userPasswords);
            } catch (error) {
                console.error(error);
                errorHandling(error.status || 500);
            } finally{
                setIsLoading(false);
            }
        };

        obtainPasswords();
    }, [])

    return {isLoading, allPasswords, setAllPasswords, uiUpdateChange, uiUpdateDelete, handleDeletePassword};

}

export default usePasswords;
