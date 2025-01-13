import CreatePassword from "./CreatePass";
import ViewAllPasswords from "./ViewAllPass";
import ViewCategories from "./ViewCategories";

// sets proper display of chosen user section 
const InfoDisplay = ({ errorHandling, categories }) => {
    const currentChoice = categories.find((category) => category.selected);
    return (
        <>
            {currentChoice.name === "Create New Password" && <CreatePassword errorHandling={errorHandling}/>}
            {currentChoice.name === "See All Passwords" && <ViewAllPasswords errorHandling={errorHandling}/>}
            {currentChoice.name === "See Categories" && <ViewCategories errorHandling={errorHandling}/>}
        </>

    );
}

export default InfoDisplay;