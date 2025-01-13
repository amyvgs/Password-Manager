import { useEffect, useRef, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { createPortal } from "react-dom";
import EditModal from "./EditModal";

const EditButton = ({type, value, handleDelete, uiUpdateChange, uiUpdateDelete, updateCurrent}) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [isToggled, setIsToggled] = useState(false);

     // ref for outer div
     const divRef = useRef(null);
    const boxRef = useRef(null);
    const buttonRef = useRef(null);

    // close popup by clicking out of box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setIsToggled(false);
            }
        };

        // event listener
        document.addEventListener("mousedown", handleClickOutside);

        // clean event listener
        return () => { document.removeEventListener("mousedown", handleClickOutside) };
    }, [])

    const editAction = () => {
        setOpenEdit(true);
        setIsToggled(false);
    }

    const deleteHelper = () => {
        type === "password" ? handleDelete(value.password_id, value) : handleDelete();
        setIsToggled(false);
    }



    return (
        <>
            <div ref={divRef} className="relative flex flex-col items-center justify-center">
                <div ref={buttonRef} onClick={() => setIsToggled(!isToggled)} className=" flex items-center justify-center rounded-2xl hover:bg-gray-500 hover:cursor-pointer hover:bg-opacity-50 p-1 ">
                    <MoreVertIcon />
                </div>

                {isToggled &&
                  <div onClick={(e) => e.stopPropagation()} ref={boxRef} className="absolute top-10 w-22 h-22  bg-gray-300 dark:bg-slate-600 dark:text-white flex flex-col justify-center items-center p-4 shadow-xl space-y-3 z-50">
                        <div onClick={deleteHelper} className="w-full flex flex-row text-base justify-center items-center text-red-500 border-b-2 border-gray-500 hover:bg-gray-400 hover:cursor-pointer hover:font-bold">
                            <h1>Delete</h1>
                            <DeleteOutlineIcon/>
                        </div>

                        <div onClick={editAction} className="w-full flex flex-row text-base justify-center items-center border-b-2 border-gray-500 hover:bg-gray-500 hover:cursor-pointer hover:font-bold">
                            <h1>Edit</h1>
                            <EditIcon />
                        </div>
                    </div>
                }
            </div>

            {openEdit && createPortal(<EditModal setOpenEdit={setOpenEdit} type={type} value={value} uiUpdateChange={uiUpdateChange} uiUpdateDelete={uiUpdateDelete} updateCurrent={updateCurrent}/>, document.body)}
        </>
    );

}

export default EditButton;