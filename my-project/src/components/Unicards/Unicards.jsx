import React from 'react'
const Data =[
{
    id:1,
    image:"../images/Uni1.png",
    title: "UNIVERSITE DE DOUALA",
  },
  {
    id:2,
    image:"../images/Uni2.png",
    title: "UNIVERSITE DE YAOUNDE1",
  },
  {
    id:3,
    image:"../images/Uni3.png",
    title: "UNIVERSITE DE  BAMENDA",
  },
  {
      id:4,
      image:"../images/Uni4.png",
      title: "UNIVERSITE DE  YAOUNDE 2",
    },
    {
      id:5,
      image:"../images/Uni5.png",
      title: "UNIVERSITE DE BUEA",
    },
    {
      id:6,
      image:"../images/Uni6.png",
      title: "UNIVERSITE DE  NGAOUNDERE",
    },
    
]
const Unicards = () => {
  return (
    <div className='my-10 mx-auto container'>
      <div className=''>
      <h1 className='text-center capitalize font-bold text-secondary text-shadow-sm text-2xl pt-10 pb-6'>UNIVERSITES OU INSTITUTS</h1>
      <hr className='w-[100px] mx-auto border-t-2 border-secondary pb-10'/>
      <p className='text-xl pb-10'>Le site vous permet aussi de rechercher les concours par universite ou institut. Ici nous avons les differents universites de l’etat et les institituts prives, 
        vous pouvez cliquez pour voir les differents concours qu’ils proposent</p>
      <div className='flex flex-col md:flex-row gap-10 flex-wrap justify-center items-center'>
        {
          Data.map(({id, image, title, description}) => {
            return (
                <div className='bg-white drop-shadow-[12px_10px_10px_rgba(0,0,0,0.5)] rounded-3xl hover:scale-105 transition ease-in-out duration-300 w-[335px] sm:w-[375px] h-[576px]'>
                  <div className='flex flex-col'>
                  <div  className='overflow-hidden'>
                    <img src={image} alt='' className='rounded-t-3xl h-[300px] w-full object-contain py-5'/>
                  </div>
                  <div className='p-6'>
                    <h1 className='text-xl text-primary py-2 font-bold'>{title}</h1>
                    <span><p className='text-xl py-5'>Pour voir tous les concours</p></span>
                    <a href='#' className='text-xl text-secondary px-1 py-5'>cliquez ici</a>
                  </div>
                  
                </div>
                </div>
            )
          })
        }
        
    </div>
    <div className='flex mx-auto mt-6 justify-center 2xl:justify-end container'>
        <a className="text-xl lg:text-2xl font-bold flex justify-center items-center flex-wrap" href=''>VOIR PLUS
        <ChevronRight /><ChevronRight /></a>
        
        </div>
    </div>
    </div>
  )
}

export default Unicards