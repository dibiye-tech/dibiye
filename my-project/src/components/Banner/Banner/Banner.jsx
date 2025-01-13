import {useState,React}  from 'react';
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';

const BannerImg = {
    backgroundColor: '#63ADDA',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',

}


const Banner = () => {

    const [counterState, setCounterState ] = useState(false);

  return (
    
    <div className='my-10' style={BannerImg}>
        <div className=' backdrop-blur-sm py-10'>
            <div className='space-y-10 max-w-5xl mx-auto text-white'>
                <ScrollTrigger onEnter={() => setCounterState(true)} onExit={() =>setCounterState(false)}>
                <div className='flex flex-col md:flex-row justify-center sm:justify-between items-center gap-10 p-4 mx-auto text-xl'>
                    <div className='w-3/5 flex flex-col justify-center items-center gap-3'>
                        <img src='images/icon1.png'/>
                        <div className='flex items-center justify-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl'>
                            {counterState &&
                            <CountUp start={0} end={150} duration={2.75}></CountUp>
                            }
                        <p>Utilisateurs</p>
                        </div>
                    </div>
                    <div className='w-3/5 flex flex-col justify-center items-center gap-3'>
                        <img src='images/exam.png'/>
                        <div className='flex items-center justify-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl'>
                            {counterState &&
                            <CountUp start={0} end={200} duration={2.75}></CountUp>

                            }
                            
                        <p>Concours</p>
                        </div>
 
                    </div>
                    <div className='w-3/5 flex flex-col justify-center items-center gap-3'>
                        <img src='images/icon3.png'/>
                        <div className='flex items-center justify-center gap-4 font-bold text-xl md:text-2xl lg:text-3xl'>
                            {counterState &&
                            <CountUp start={0} end={100} duration={2.75}></CountUp>

                            }
                        <p>Avis utilisateurs</p>
                        </div>
                    </div>
                </div>
            </ScrollTrigger>
        </div>
     </div>
</div>
  )
}

export default Banner