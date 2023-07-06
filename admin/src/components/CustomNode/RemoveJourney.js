import React from 'react'
import { MdSettings } from 'react-icons/md';
import { Handle, Position } from 'reactflow';

function RemoveJourney() {
  return (
    <>
    <Handle type='target' position="left" id='remove-t-l' className=" bg-black h-[10px] w-[10px] rounded-full"
 />
    <div className="flex flex-row border-2 border-blue-800 rounded-md w-[226px]">
      <MdSettings className="w-[25%] h-full p-2 bg-blue-50 rounded-md rounded-r-none text-red-700" />
      <div className="text-red-700 flex-1  flex items-center justify-center text-center border-l-2 border-blue-800 bg-white p-1 rounded-md rounded-l-none">
        Remove from journey
      </div>
    </div>
    </>
  )
}

export default RemoveJourney