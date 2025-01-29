import React from 'react'
import tel from '../../images/tel.jpg'

const Commentaire = () => {
  return (
    <div>
      <div className='container mx-auto px-10 md:px-5 flex flex-col md:flex-row justify-center items-center'>
        <div className='w-2/4'>
            <img src={tel} alt="" />
        </div>
        <div>
            <p>Votre avis</p>
            <form action="">
                <textarea name="" id=""></textarea>
                <button type="submit">Envoyer</button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Commentaire