import React from 'react'
import { useState } from 'react'
const BannerImg = {
    backgroundColor: '#63ADDA',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',

};

const Historique = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleChange = (event) => {
      setSearchTerm(event.target.value);
      onSearch(searchTerm); 
    
    };

  return (
    <div className="overflow-hidden">
     <div className="bg-[#63ADDA] py-20 md:py-16 px-auto mb-10 flex flex-col gap-5 items-center justify-center">
        <div>
            <p className="text-white text-[18px] md:text-[20px] lg:text-[24px]">Rejoignez-nous</p>
        </div>
        <div className="pt-5">
            <div className="pb-0 md:pb-5">
                <button className="hidden md:block absolute text-white bg-[#096197] border rounded-[20px] py-3 px-7 ml-[380px] lg:ml-[580px] cursor-pointer">S'inscrire</button>
                <input type="search" name="" id="" className="border rounded-[20px] py-3 w-[300px] md:w-[500px] lg:w-[700px] outline-none placeholder:text-primary placeholder:pl-8" placeholder="Rejoignez notre newsletter..." />
            </div>
            <div>
                <button className="bg-white border rounded-[20px] py-3 px-6 w-[300px] mt-3 text-center text-[#096197] cursor-pointer hover:bg-[#096197] hover:text-white hover:border-[#096197] md:hidden">S'inscrire</button>
            </div>
        </div>
     </div>
    </div>
          
  )
}

export default Historique