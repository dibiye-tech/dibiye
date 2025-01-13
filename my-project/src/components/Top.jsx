import {useEffect, useState, React} from 'react';
import {IoArrowUp} from 'react-icons/io5';

const Top = () => {
    const [backToTopButton, setBackToTopButton] = useState(false);

    useEffect(() =>{
        window.addEventListener('scroll', () =>{
            if (window.scrollY > 100){
                setBackToTopButton(true);
            }else{
                setBackToTopButton(false);
            }
        })
    }, []);
    const scrollUp = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    };


  return (
    <div>
       {
        backToTopButton &&(
            <button onClick={scrollUp} className='fixed right-[100px] bottom-[50px] bg-tertiary text-white py-2 px-3 border border-1 border-white rounded-lg w-auto 
            text-center hover:bg-primary cursor-pointer transition-all duration-700 text-lg'><IoArrowUp/></button>
        )
       }
    </div>
  )
}

export default Top