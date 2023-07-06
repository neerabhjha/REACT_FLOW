import { Button, Drawer, Form, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { callEventFunction, setEventData } from "../../redux/slices/EventSlice";
import { Handle, Position } from "reactflow";
import shortid from "shortid";

const TriggerNode = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { eventData } = useSelector((state) => state.eventReducer);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Event Failed:", errorInfo);
  };

  const onSubmit = (values) => {
    try {
      console.log("onEventSubmit: ", values);
      const newEventData = {
        eventId: shortid.generate(),
        eventName: values.event,
        eventTime: values.waitingTime,
      };
      const updatedEventData = [...eventData, newEventData];
      console.log("updatedEventData: ", updatedEventData);
      dispatch(setEventData(updatedEventData));
      dispatch(callEventFunction(true));
      setOpen(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="group">
      <Handle
        type="source"
        position={Position.Bottom}
        className=" bg-black h-[10px] w-[10px] rounded-full"
        id="main-s"
      />

      <div className="cursor-pointer mt-16 ml-24 h-5 w-10  flex items-center justify-center bg-[#363636] text-white  rounded-md absolute invisible group-hover:visible p-2">
        Yes
      </div>

      <div
        className="flex flex-row border-2 border-blue-800 rounded-md w-[226px] h-[58px]"
        onClick={showDrawer}
      >
        <FaUserCheck className="w-[25%] h-full p-2 bg-blue-50 rounded-md rounded-r-none text-blue-900" />
        <div className="flex flex-1 items-center justify-center border-l-2 border-blue-800 bg-white p-1 rounded-md rounded-l-none active:bg-gray-500">
         Form Sent Out
        </div>
      </div>
      <Drawer
        title="Select an event"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        key="right"
      >
        <Form
          name="basic"
          layout="vertical"
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Event"
            name="event"
            rules={[
              {
                required: true,
                message: "Please select an event!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select an event"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "formSubmit", label: "Form Submit" },
                { value: "formUpdate", label: "Form Update" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Waiting Time"
            name="waitingTime"
            rules={[
              {
                required: true,
                message: "Please select a time!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select time"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[{ value: "1hr", label: "1hr" }]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-300 text-gray-800 shadow-none relative hover:bg-gray-400 active:bg-blue-800"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default TriggerNode;
