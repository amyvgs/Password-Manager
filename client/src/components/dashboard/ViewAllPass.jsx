import { useEffect, useState } from "react";
import PasswordBox from "./PasswordBox";
import usePasswords from "../../hooks/usePassword";
import loading from "../../assets/loading.png"

const ViewAllPasswords = ({ }) => {
    const { isLoading, allPasswords, uiUpdateChange, handleDeletePassword } = usePasswords("all", {});
    const [filteredPasswords, setFilteredPasswords] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    // useEffect to obtain and store all user passwords within useState
    useEffect(() => {
        setFilteredPasswords(allPasswords);
    }, [allPasswords]);

    const filterPasswords = (e) => {
        const userSearch = allPasswords.filter((password) => {
            return password.password_name.toLowerCase().includes(e.target.value.toLowerCase());
        });

        setIsSearch(true);
        setFilteredPasswords([...userSearch])
    }

    return (
        <>
            <div className="flex flex-col w-full h-4/5 items-center justify-start bg-gray-100 shadow-lg p-10 font-Roboto max-sm:overflow-y-auto">
                <div className="flex flex-row items-center justify-center w-full h-1/5 gap-5">
                    <input onChange={filterPasswords} placeholder="Search Passwords..." className="bg-white/50 rounded-3xl w-5/6 p-2 border-2 border-gray-300 shadow-sm" />
                </div>

                <div className="flex flex-col items-center justify-start w-full h-4/5 bg-gray-300 p-5 overflow-y-scroll">
                    {isLoading ?
                        <div className="flex flex-col w-full h-full justify-center items-center">
                            <img src={loading} className="animate-spin" width={40} height={40} />
                            <h1 className="font-semibold text-2xl">Loading...</h1>
                        </div>
                        :
                        (filteredPasswords.length === 0 ?
                            <div className="flex w-full h-full items-center justify-center font-semibold text-2xl">
                                <h1>No Passwords Created Yet!</h1>
                            </div>
                            :
                            filteredPasswords.map((password, index) => {
                                return <PasswordBox key={index} index={index} isSearch={isSearch} password={password} uiUpdateChange={uiUpdateChange} handleDelete={handleDeletePassword} />
                            }))
                    }
                </div>
            </div>


        </>
    );
}

export default ViewAllPasswords;