import { Popconfirm } from "antd";
import React from "react";
import {
  AiFillQuestionCircle,
  AiFillDelete,
  AiFillHourglass,
} from "react-icons/ai";
import { RxUpdate } from "react-icons/rx";
import { TbMessageQuestion } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { Handle } from "reactflow";
import { setDeleteState } from "../../../redux/slices/EventSlice";
import { toast } from "react-hot-toast";

export const FormSubmitNode = () => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(setDeleteState(true));
  };
  const cancel = (e) => {
    console.log(e);
    // toast.error('Not deleted');
  };

  return (
    <div className="group static">
      <Handle position="left invisible">
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
      </Handle>
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

      <div className="group">
        <div className="flex flex-row border-2 border-blue-800 rounded-md w-[250px] h-[60px] ">
          <AiFillQuestionCircle className="w-[25%] h-full p-1 bg-blue-50 rounded-md rounded-r-none text-blue-900" />
          <div className="flex flex-1 items-center justify-center text-center border-l-2 border-blue-800 bg-white p-1 rounded-md rounded-l-none">
            Wait for event "Form Submit" untill "1hr"
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormUpdateNode = () => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(setDeleteState(true));
  };
  const cancel = (e) => {
    console.log(e);
    // toast.error('Not deleted');
  };

  return (
    <div className="group static">
      <Handle position="left invisible">
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
      </Handle>
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

      <div className="group">
        <div className="flex flex-row border-2 border-blue-800 rounded-md w-[250px] h-[60px] ">
          <RxUpdate className="w-[25%] h-full p-1 bg-blue-50 rounded-md rounded-r-none text-blue-900" />
          <div className="flex flex-1 items-center justify-center text-center border-l-2 border-blue-800 bg-white p-1 rounded-md rounded-l-none">
            Wait for event "Form Update" untill "1hr"
          </div>
        </div>
      </div>
    </div>
  );
};
