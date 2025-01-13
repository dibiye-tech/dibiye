import React from 'react';
import Button from './Button';

const Newsletter = () => {
  return (
    <div className='overflow-hidden'>
        <div className='bg-[#63ADDA] py-20 md:py-16 px-auto mb-10 flex flex-col gap-5 items-center justify-center'>
            <div>
                <p className='text-white text-[18px] md:text-[20px] lg:text-[24px]'>Rejoignez-nous</p>
            </div>
            <div className='pt-5'>
                <div className='pb-0 md:pb-5'>
                    <Button className={`hidden md:block absolute text-white bg-[#096197] border rounded-[20px] py-3 px-6 ml-[390px] lg:ml-[590px] cursor-pointer`}>S'inscrire</Button>
                    <input type="search" name="" id="" className='border rounded-[20px] px-5 py-3 w-[300px] md:w-[500px] lg:w-[700px]'placeholder='Rejoignez notre newsletter...'/>
                </div>
                <div>
                    <Button className={`bg-white border rounded-[20px] py-3 px-5 w-[300px] mt-3 text-center text-[#096197] cursor-pointer hover:bg-[#096197] hover:text-white hover:border-[#096197] md:hidden`}>S'inscrire</Button>
                </div>
            </div>
        </div>
    </div>
  )
};

export default Newsletter;