import { Button, Drawer, Form, Input } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenMailer, setEmailData } from "../../redux/slices/EmailSlice";
import { MdEmail } from "react-icons/md";
import { Handle, Position } from "reactflow";

const EmailNode = () => {
  const { open, emailData, idFromEmailNode } = useSelector(
    (state) => state.emailReducer
  );
  const dispatch = useDispatch();

  const showDrawer = () => {
    dispatch(OpenMailer(true));
  };
  const onClose = () => {
    dispatch(OpenMailer(false));
  };
  const onSubmit = (values) => {
    try {
      // console.log("OnEmailSubmit", values);
      const newEmailData = {
        id: idFromEmailNode,
        email: values.email,
        message: values.message,
      };
      const updatedEmailData = [...emailData, newEmailData];
      console.log("updatedEmailData: ", updatedEmailData);
      dispatch(setEmailData(updatedEmailData));
      dispatch(OpenMailer(false));
      // dispatch(setEmailSubmitState(true));
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Email Failed:", errorInfo);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="email-t-t"
        className=" bg-black h-[10px] w-[10px] rounded-full"
      />
      <Handle
        type="source"
        position="bottom"
        id="email-s-b"
        className=" bg-black h-[10px] w-[10px] rounded-full"
      />

      <div
        className="flex flex-row border-2 border-blue-800 rounded-md w-[226px] h-[58px] "
        onClick={showDrawer}
      >
        <MdEmail className="w-[25%] h-full p-1 bg-blue-50 rounded-md rounded-r-none text-blue-900" />
        <div className=" flex flex-1 w-full items-center justify-center border-l-2 border-blue-800 bg-white p-1 rounded-md rounded-l-none active:bg-gray-500">
          Email
        </div>
      </div>
      <Drawer
        title="Send an Email"
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
            label="Email Id"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter an email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[
              {
                required: true,
                message: "Please input message!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
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
    </>
  );
};

export default EmailNode;
