import { useState } from "react";

export default function ThemeToggle(){
    const [isDark, setIsDark] = useState(false);

    
    const toggleDarkMode = () => {
        setIsDark(!isDark);
        document.body.classList.toggle("dark");
    }

    return(
        <div>

        </div>
    );
}