import { useState, React } from 'react';
import  CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';

const BannerImg = {
    backgroundColor: '#63ADDA',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',

}



const Banner2 = () => {

    const [ counterState, setCounterState ] = useState(false);

  return (
    
    <div className='mt-10 mb-5' style={BannerImg}>
        <div className=' backdrop-blur-sm py-10'>
            <div className='space-y-10 max-w-5xl mx-auto text-white'>
                <ScrollTrigger onEnter={() => setCounterState(true)} onExit={() =>setCounterState(false)}>
                    <div className='flex flex-col md:flex-row justify-center items-center gap-10 p-4 mx-auto text-sm md:text-md lg:text-lg'>
                        <div className='w-3/5 flex flex-col justify-center items-center gap-3'>
                            <img src='images/user.png'/>
                            <div className='flex items-center justify-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl'>
                                { counterState &&
                                    <div>
                                        <CountUp start={0} end={700} duration={2.75}></CountUp>+
                                    </div>
                                }
                                <p className=''>Utilisateurs</p>
                            </div>
                        </div>
                        <div className='w-3/5 flex flex-col justify-center items-center gap-3'>
                            <img src='images/livre.png'/>
                            <div className='flex items-center justify-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl'>
                                { counterState &&
                                    <div>
                                        <CountUp start={0} end={500} duration={2.75}></CountUp>+
                                    </div>
                                }
                                <p className=''>Livres</p>
                            </div>
                        </div>
                        <div className='w-3/5 flex flex-col justify-center items-center gap-3'>
                            <img src='images/troph.png'/>
                            <div className='flex items-center justify-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl'>
                                { counterState &&
                                    <div>
                                        <CountUp start={0} end={120} duration={2.75}></CountUp>+
                                    </div>
                                }
                                <p className=''>Concours</p>
                            </div>
                        </div>
                    </div>
                </ScrollTrigger>
            </div>
        </div>
    </div>
  )
}

export default Banner2