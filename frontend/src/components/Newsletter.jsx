import React, { useState } from 'react';
import Button from './Button';
import { subscribeToNewsletter } from '../hooks/useFetchQuery';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!email || !email.includes('@')) {
          toast.error('Veuillez entrer une adresse e-mail valide.');
          return;
        }
    
        const result = await subscribeToNewsletter(email);
    
        if (result.success) {
            toast.success(result.message); 
            setEmail('');  
          } else {
            toast.error(result.message);  
          }
    };

  return (
    <div className='overflow-hidden'>
        <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover
        />
        
        <div className='bg-[#63ADDA] py-20 md:py-16 px-auto mb-10 flex flex-col gap-5 items-center justify-center'>
            <div>
                <p className='text-white text-[18px] md:text-[20px] lg:text-[24px]'>Rejoignez-nous</p>
            </div>

            <form onSubmit={handleSubmit} className='pt-5'>
                <div className='pb-0 md:pb-5'>
                    <button
                        className={`hidden md:block absolute text-white bg-[#096197] border rounded-[20px] py-3 px-6 ml-[390px] lg:ml-[590px] cursor-pointer`} 
                        type="submit"
                    >
                        S'inscrire
                    </button>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={handleInputChange} 
                        name="email" 
                        id="email" 
                        className='border rounded-[20px] px-5 py-3 w-[300px] md:w-[500px] lg:w-[700px]' 
                        placeholder='Rejoignez notre newsletter...'
                    />
                </div>

                <div>
                    <button 
                        className={`bg-white border rounded-[20px] py-3 px-5 w-[300px] mt-3 text-center text-[#096197] cursor-pointer hover:bg-[#096197] hover:text-white hover:border-[#096197] md:hidden`} 
                        type="submit"
                    >
                        S'inscrire
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Newsletter;
