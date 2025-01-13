// Ingenierie.js
import React from 'react'

import Branches from '../components/Branches/Branches'
import Tendance from '../components/Tendance/Tendance'
import Footer from '../components/Footer/Footer'
import Top from '../components/Top'
import Vercards from '../components/Vercards'

const Ingenierie = () => {
  return (
    <div>
       
        <div className="mt-12"> {/* Ajoute un espace entre le Navbar et Vercards */}
          <Vercards />
        </div>
        <Branches />
        <Tendance />
        <Footer />
        <Top />
    </div>
  )
}

export default Ingenierie
