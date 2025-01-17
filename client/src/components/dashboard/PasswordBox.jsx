import { useEffect, useState } from "react";
import EditButton from "./EditButton";

// component to map passwords display
const PasswordBox = ({
  password,
  index,
  isSearch,
  uiUpdateDelete,
  uiUpdateChange,
  handleDelete,
}) => {
  // formatting database date to readable format
  const formatDate = (passwordDate) => {
    let date = new Date(passwordDate);
    let formattedDate = date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // am and pm
    });
    return formattedDate;
  };

  const [passwordDate, setPasswordDate] = useState("");
  const [displayPassword, setDisplayPassword] = useState(false);

  useEffect(() => {
    setPasswordDate(formatDate(password.last_updated));
  }, [password]);

  return (
    <div className="flex flex-row w-full justify-center items-center gap-3">
      <div
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: "forwards",
        }}
        className={`flex flex-row justify-between items-center rounded-xl w-[90%] h-20 shadow-xl gap-5 bg-gray-400 border-2 border-gray-600 dark:border-slate-900 p-3 font-Roboto mb-5 ${
          isSearch ? "opacity-100" : "opacity-0 animate-fadeIn z-10"
        } z-10`}
      >
        <div
          title={`Category: ${password.category || "none"}`}
          style={{
            backgroundColor: password.category_color || "",
            borderStyle: password.category ? "solid" : "dashed",
          }}
          className={`h-full w-5 border-2  border-black/50`}
        />

        <div className="flex flex-col justify-start w-1/4">
          <h1 className="font-bold text-black/70 text-2xl line-clamp-1 max-sm:text-sm w-full">
            {password.password_name}
          </h1>
          <h1 className="text-xs w-full">Last Updated: {passwordDate}</h1>
        </div>

        {displayPassword ? (
          <div
            title="click to hide"
            onClick={() => setDisplayPassword(false)}
            className="flex justify-center items-center text-center overflow-x-hidden rounded-2xl bg-gray-700 bg-opacity-40 p-2 px-9 w-1/2 hover:bg-gray-800 hover:cursor-pointer hover:bg-opacity-40"
          >
            <h1 className="max-sm:text-sm">{password.password}</h1>
          </div>
        ) : (
          <div
            title="click to reveal"
            onClick={() => setDisplayPassword(true)}
            className="flex justify-center items-center text-center overflow-x-hidden rounded-2xl bg-gray-700 bg-opacity-40 p-1 px-9 w-1/2 hover:bg-gray-800 hover:cursor-pointer hover:bg-opacity-40"
          >
            <p className="text-gray-800 opacity-70 text-2xl truncate">
              **********************************************
            </p>
          </div>
        )}
      </div>
      <div className={`flex items-center justify-center w-10 mb-5`}>
        <EditButton
          type="password"
          value={password}
          handleDelete={handleDelete}
          uiUpdateChange={uiUpdateChange}
          uiUpdateDelete={uiUpdateDelete || null}
        />
      </div>
    </div>
  );
};

export default PasswordBox;
