import React from 'react'
import { MdEmail, MdMarkEmailRead } from 'react-icons/md';
import { Handle, Position } from 'reactflow';

function EmailSentNode() {
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
            className="flex flex-row border-2 border-green-500 rounded-md w-[226px] h-[58px] "
          >
            <MdMarkEmailRead className="w-[25%] h-full p-1 bg-blue-50 rounded-md rounded-r-none text-green-500" />
            <div className="text-green-500 flex flex-1 w-full items-center justify-center border-l-2 border-green-500 bg-white p-1 rounded-md rounded-l-none">
              Email Sent
            </div>
          </div>
         
        </>
      );
    };
    

export default EmailSentNode