import React from 'react'
import { FaFileExcel } from 'react-icons/fa';

const Empty = ({
  paragraph
}) => {
  return (
    <div className="Empty box bg-white flex justify-center items-center rounded-3xl  p-6 flex-col    ">
      <span>
        <FaFileExcel className="text-purple-dark w-8 h-8" />
      </span>
        <p className="text-lg md:text-xl lg:text-2xl font-inter font-semibold text-purple mt-2 leading-9 text-center ">
         {paragraph}
        </p>
    </div>
  );
}

export default Empty