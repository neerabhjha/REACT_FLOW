import React, { useEffect, useState } from "react";
import {
  BsFillCloudArrowDownFill,
  BsFillCloudArrowUpFill,
} from "react-icons/bs";
import { MdEmail, MdSettings } from "react-icons/md";

function Actions({ actionDraggable, emailDraggable, intervalState }) {
  const [showDiv, setShowDiv] = useState(false);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };
  useEffect(() => {
    if (intervalState) {
      setShowDiv(false);
    } 
  }, [intervalState]);

  return (
    <>
      <div className="px-6 items-center justify-between flex flex-row cursor-pointer select-none">
        {!actionDraggable || intervalState ? (
          <>
            <div className="text-gray-300 cursor-not-allowed">
              Actions{" "}
              <span className="text-xl text-gray-300 cursor-not-allowed">
                ..................................{" "}
              </span>
            </div>
            <BsFillCloudArrowDownFill className="w-6 h-6 mt-2  cursor-not-allowed text-gray-300" />{" "}
          </>
        ) : (
          <>
            <div onClick={toggleDiv} className=" cursor-pointer text-gray-700">
              Actions{" "}
              <span className="text-xl  cursor-pointer text-gray-700">
                ..................................{" "}
              </span>
            </div>
            {showDiv ? (
              <BsFillCloudArrowUpFill
                className="w-6 h-6 mt-2  cursor-pointer text-gray-700"
                onClick={toggleDiv}
              />
            ) : (
              <BsFillCloudArrowDownFill
                className="w-6 h-6 mt-2  cursor-pointer text-gray-700"
                onClick={toggleDiv}
              />
            )}
          </>
        )}
      </div>
      {showDiv && (
        <div className="items-center justify-between p-4 inline-grid grid-rows-3 grid-cols-3 gap-2">
          {emailDraggable ? (
            <div className="items-center justify-center text-center flex flex-col gap-1">
              <div
                draggable
                onDragStart={(event) => onDragStart(event, "emailNode")}
                className="border-2 border-black w-12 h-12 bg-blue-50 items-center justify-center text-center rounded-xl hover:bg-gray-400 cursor-pointer shadow-md p-1"
              >
                <MdEmail className="h-8 w-8 text-blue-900 ml-[2px] mt-[2px]" />
              </div>
              <span className="text-xs">Email</span>
            </div>
          ) : (
            "Not Draggable"
          )}

          <div className="items-center justify-center text-center flex flex-col gap-1">
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "removeJourney")}
              className="border-2 border-black w-12 h-12 bg-blue-50 items-center justify-center text-center rounded-xl hover:bg-gray-400 cursor-pointer shadow-md p-1"
            >
              <MdSettings className="h-8 w-8 text-red-700 ml-[2px] mt-[2px]" />
            </div>
            <span className="text-xs">Remove journey</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Actions;
