import React from "react";
import { TiTick } from "react-icons/ti";
import { Handle } from "reactflow";

export const FormSubmittedNode = () => {
  return (
    <div className="group static">
      {/* <Handle position="left invisible">
            <Popconfirm
              title="Delete the node"
              description="Are you sure to delete this node?"
              onConfirm={handleDelete}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <div className="group-hover:visible cursor-pointer mt-8 absolute">
                <AiFillDelete className="text-red-700 text-3xl" />
              </div>
            </Popconfirm>
          </Handle> */}
      <Handle
        type="source"
        position="bottom"
        id="event-s-b"
        className=" bg-black h-[10px] w-[10px] rounded-full "
      />
      <Handle
        type="source"
        position="right"
        id="event-s-r"
        className=" bg-black h-[10px] w-[10px] rounded-full "
      />
      <Handle
        type="target"
        position="top"
        id="event-t-t"
        className=" bg-black h-[10px] w-[10px] rounded-full"
      />

      <div className="cursor-pointer mt-[19px] ml-[255px] h-5 w-10 flex items-center justify-center bg-[#363636] text-white rounded-md absolute invisible group-hover:visible p-2">
        Yes
      </div>
      <div className="cursor-pointer mt-[65px] ml-24 h-5 w-16 flex items-center justify-center bg-[#363636] text-white rounded-md absolute invisible group-hover:visible p-2">
        Timeout
      </div>

      <div className="flex flex-row border-2 border-green-500 rounded-md w-[250px] h-[60px] ">
        <TiTick className="w-[25%] h-full p-1 bg-blue-50 rounded-md rounded-r-none text-green-500" />
        <div className="text-green-500 flex flex-1 w-full items-center justify-center border-l-2 border-green-500 bg-white p-1 rounded-md rounded-l-none">
          Form Submitted By User
        </div>
      </div>
    </div>
  );
};
