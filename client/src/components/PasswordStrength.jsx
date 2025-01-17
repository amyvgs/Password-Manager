import { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import CreatePassword from "./dashboard/CreatePass";

const PasswordStrengthInput = ({ password, setPassword }) => {
  // set scales for password strength
  const strengthScores = ["", "Weak", "Intermediate", "Strong"];

  // criteria objects for tooltip display
  let criteriaObjects = {
    passLength: {
      criteria: "Password is at least 10 characters long",
      met: false,
    },
    digits: { criteria: "Password contains digits", met: false },
    uppercase: { criteria: "Password contains uppercase letters", met: false },
    specialChar: {
      criteria: "Password contains special characters (@$!%*?&#)",
      met: false,
    },
  };

  // useStates
  const [passStrength, setPassStrength] = useState(0);
  const [criterias, updateCriterias] = useState(criteriaObjects);

  // password strength algorithm
  const detectStrength = (pass) => {
    // if password is empty, return and set to 0
    if (pass.length === 0) {
      setPassStrength(0);
      return;
    }

    // create a new object with updated met attributes
    const updatedCriterias = {
      passLength: { ...criterias.passLength, met: pass.length >= 10 },
      digits: { ...criterias.digits, met: /[0-9]/.test(pass) },
      uppercase: { ...criterias.uppercase, met: /[A-Z]/.test(pass) },
      specialChar: { ...criterias.specialChar, met: /[@$!%*?&#_]/.test(pass) },
    };

    // determine score based on which criterias are met
    const score = Object.values(updatedCriterias).reduce(
      (total, critera) => (total = total + (critera.met ? 1 : 0)),
      0
    );

    // set proper password strength
    if (score <= 2) {
      setPassStrength(1);
    } else if (score <= 3) {
      setPassStrength(2);
    } else {
      setPassStrength(3);
    }

    // update corresponding useStates
    updateCriterias({ ...updatedCriterias });
  };

  // function to occur on change in input
  const inputChange = (e) => {
    let input = e.target.value || "";
    setPassword(input);
    detectStrength(input);
  };

  return (
    <div className="flex flex-row max-sm:flex-col max-sm:space-y-5 items-center justify-center w-full space-x-5 font-Roboto mb-10">
      <div className="flex flex-row w-3/4 rounded-2xl shadow-xl">
        <div className="flex justify-center items-center font-bold g-blue-300 h-10 p-2 bg-blue-300 dark:bg-orange-300 border-2 border-blue-400 dark:border-orange-300 text-gray-600 rounded-l-2xl">
          Password:
        </div>
        <input
          value={password}
          onChange={(e) => inputChange(e)}
          className="w-full bg-transparent border-2 px-2  border-blue-600 dark:border-orange-600 focus:outline-none focus:border-4 rounded-r-2xl"
          placeholder="Enter Password Here"
        ></input>
      </div>

      <div className="flex flex-col justify-start items-center w-1/4 max-sm:w-full bg-white/60 dark:bg-black/60 p-3 rounded-xl shadow-lg">
        <div className="flex flex-row w-full justify-start items-center mb-2 gap-5">
          <h1 className="">Strength: {strengthScores[passStrength]} </h1>
          <div className="relative inline-block group">
            <p>
              <InfoIcon sx={{ width: "20px", height: "20px" }} />
            </p>
          </div>
        </div>

        <div className="flex justify-start items-center w-full bg-gray-400 h-2 rounded-xl shadow-md">
          <div
            className="h-2 w-2/3 bg-gray-600 rounded-xl transition-all ease-in-out duration-700"
            style={{
              backgroundColor: `${
                passStrength === 1
                  ? "red"
                  : passStrength === 2
                  ? "yellow"
                  : "green"
              }`,
              width: `${
                passStrength === 0
                  ? "0%"
                  : passStrength === 1
                  ? "33%"
                  : passStrength === 2
                  ? "66%"
                  : "100%"
              }`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthInput;
