import React from 'react'
const BannerImg = {
    backgroundColor: '#63ADDA',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',

}


const Banner = () => {
  return (
    
    <div className='items-center flex my-10 justify-center' style={BannerImg}>
        <div className='container backdrop-blur-sm py-10'>
        <div className='backdrop:blur-sm py-10'>
            
            <div className='space-y-6 max-w-xl mx-auto text-white'>
                <div className='flex flex-col md:flex-row justify-center sm:justify-between items-center gap-10'>
                    <div className='w-3/5'>
                        <img src='images/icon1.png'/>
                        <p>150+ utilisateurs</p>

                    </div>
                    <div className='w-3/5'>
                        <img src='images/icon2.png'/>
                        <p>100+ concours</p>
 
                    </div>
                    <div className='w-3/5'>
                        <img src='images/icon3.png'/>
                        <p>100+ avis des utilisateurs</p>

                    </div>



                </div>

            </div>

        </div>

    </div>
    </div>
  )
}

export default Banner