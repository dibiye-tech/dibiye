import React from 'react'
import tel from '../../images/tel.jpg'

const Commentaire = () => {
  return (
    <div>
      <div className='container mx-auto px-10 md:px-5 flex flex-col md:flex-row justify-center md:justify-between items-center py-10'>
        <div className='w-1/1 md:w-2/4'>
            <img src={tel} alt="" />
        </div>
        <div>
            <p className='text-[#096197] text-md md:text-lg lg:text-xl'>Votre avis</p>
            <div className='text-md md:text-lg lg:text-xl'>
                    <form className="mt-6">
                        <textarea
                            rows="8"
                            cols="40"
                            className="w-full p-3 border-2 border-[#096197] rounded-md outline-none"
                            placeholder="Écrivez un commentaire..."
                            required
                        />
                        <button
                            type="submit"
                            className="mt-3 px-3 py-2 bg-[#096197] text-white rounded-md hover:bg-[#074C73] transition-colors"
                        >
                            Ajouter un commentaire
                        </button>
                    </form>
                </div>
        </div>
      </div>
    </div>
  )
}

export default Commentaire