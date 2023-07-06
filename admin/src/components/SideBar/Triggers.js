import React, { useEffect, useState } from "react";
import {
  BsFillCloudArrowDownFill,
  BsFillCloudArrowUpFill,
} from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";

const Triggers = ({ actionDraggable, intervalState }) => {
  const [showDiv, setShowDiv] = useState(true);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };
  useEffect(() => {
    if (actionDraggable) setShowDiv(false);
  });

  return (
    <>
      <div className="px-6 items-center justify-between flex flex-row select-none">
        {actionDraggable || intervalState ? (
          <>
            <div className="text-gray-300 cursor-not-allowed">
              Trigger{" "}
              <span className="text-xl text-gray-300 cursor-not-allowed">
                ..................................{" "}
              </span>
            </div>
            <BsFillCloudArrowDownFill className="w-6 h-6 mt-2  cursor-not-allowed text-gray-300" />{" "}
          </>
        ) : (
          <>
            <div onClick={toggleDiv} className=" cursor-pointer text-gray-700">
              Trigger{" "}
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
          <div className="items-center justify-center text-center flex flex-col gap-1">
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "triggerNode")}
              className="border-2 border-black w-12 h-12 bg-blue-50 items-center justify-center text-center rounded-xl hover:bg-gray-400 cursor-pointer shadow-md p-1"
            >
              <FaUserCheck className="h-8 w-8 text-blue-900 ml-[2px] mt-[2px]" />
            </div>
            <span className="text-xs">Form sent</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Triggers;
