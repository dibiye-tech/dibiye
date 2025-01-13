import React from 'react';

import { MdWavingHand } from "react-icons/md";

const Popup = () => {
  return (
    <div>
        <div className='bg-white border rounded-full py-2 px-3 flex gap-3 items-center justify-center w-auto absolute right-10 lg:right-52 mt-52 cursor-pointer'>
            <p className='text-[14px] md:text-[16px] lg:text-[18px] text-[#096197] font-[poppins]'>Ecrivez nous</p>
            <MdWavingHand className='text-yellow-400'width={50} height={50}/>
        </div>
    </div>
  )
};

export default Popup;