import React from "react";

import { AiOutlineClose } from "react-icons/ai";
import { RiContactsBookLine } from "react-icons/ri";

import { submitCompanyDetails } from "../../../service/api";
import { getStorage, setStorage, setSessionStorage, getSessionStorage, removeSessionStorage } from "../../../service/storageService";

const Tools = (props) => {
  const [tools, setTools] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

  const inputRef = React.useRef(null);

  const [submitError, setSubmitError] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let res = JSON.parse(await getSessionStorage("companyDetails"));
      if (res !== null && res.tools?.length !== 0) {
        setTools(res.tools);
      }
    };
    initial();
  }, []);

  const handleSubmit = async () => {
    let res = JSON.parse(await getSessionStorage("companyDetails"));
    let user = JSON.parse(await getSessionStorage("user"));
    res.user_id = user._id;
    // //console.log(res);
    let access_token = await getStorage("access_token");
    // //console.log(access_token)
    let response = await submitCompanyDetails(res, access_token);
    if (response && response.status === 200) {
      setSessionStorage("user", JSON.stringify(response.data.user));
      removeSessionStorage("companyDetails");
      window.location.reload();
    } else {
      setSubmitError("Something went wrong");
    }
  };

  return (
    <div>
      <p className="font-bold text-lg">Tools</p>
      <div className="flex flex-wrap items-center">
        <input
          className="w-4/5 text-600 my-3 mr-3"
          style={{ borderRadius: "10px" }}
          type="text"
          ref={inputRef}
          onChange={() => {
            if (inputRef.current) {
              const res = tools.findIndex((el) => {
                return (
                  el.toLowerCase() === inputRef.current.value.toLowerCase()
                );
              });
              if (res !== -1) {
                setDisabled(true);
                setError("Already added");
              } else {
                setDisabled(false);
                setError(null);
              }
            }
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && disabled === false) {
              if (inputRef.current) {
                if (inputRef.current.value !== "") {
                  let t = tools;
                  await setTools([...tools, inputRef.current.value]);
                  t.push(inputRef.current.value);
                  // //console.log(t);
                  inputRef.current.value = "";
                  let res = await getSessionStorage("companyDetails");
                  res = JSON.parse(res);
                  res.tools = t;
                  setSessionStorage(
                    "companyDetails",
                    JSON.stringify(res)
                  );
                  setError(null);
                }
              }
            }
          }}
        />
        <button
          type="button"
          className="bg-blue-600 rounded-sm text-white  py-2 px-3"
          disabled={disabled}
          onClick={async () => {
            if (inputRef.current && inputRef.current.value !== "") {
              let t = tools;
              await setTools([...tools, inputRef.current.value]);
              t.push(inputRef.current.value);
              inputRef.current.value = "";
              let res = await getSessionStorage("companyDetails");
              res = JSON.parse(res);
              res.tools = t;
              setSessionStorage(
                "companyDetails",
                JSON.stringify(res)
              );
              setError(null);
            }
          }}
        >
          Add
        </button>
        {error && <p className="text-sm text-red-500 mb-5">{error}</p>}
      </div>
      <div className="flex flex-wrap">
        {tools &&
          tools.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-gray-400 mr-3 my-2 text-black py-1 px-2 flex items-center space-x-3"
              >
                <p>{item}</p>
                <p
                  className="cursor-pointer"
                  onClick={async () => {
                    const res1 = tools.filter((el) => {
                      return el !== item;
                    });
                    let res = await getSessionStorage("companyDetails");
                    res = JSON.parse(res);
                    res.tools = res1;
                    setSessionStorage(
                      "companyDetails",
                      JSON.stringify(res)
                    );
                    setTools(res1);
                  }}
                >
                  <AiOutlineClose />
                </p>
              </div>
            );
          })}
      </div>
      <div className="pt-5 flex w-full">
        <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          onClick={() => props.setStep(1)}
        >
          Prev
        </button>
        {tools?.length !== 0 ? (
          <button className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white" onClick={() => { handleSubmit() }}>
            Submit
          </button>
        ) : (
          <button disabled className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Tools;
