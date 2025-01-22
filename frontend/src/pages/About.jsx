import React from 'react'
import home from '../../images/home1.png'
import Fonction from '../components/Fonction'
import Footer from '../components/Footer'
import Comment from '../components/Comment'
import Banner from '../components/Banner2'

const About = () => {
  return (
    <div>
        <div>
            <img src={home} alt="" className=''
                style={{
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    height: '90vh',
                    width: '100%',
                  }}
            />
        </div>
        <div className='container mx-auto px-10 md:px-5 overflow-hidden py-20'>
            <Fonction />
            <div className='py-20 text-sm md:text-md lg:text-lg xl:text-xl text-center'>
                <h1 className='text-[#DE290C] font-bold pb-5 text-xl lg:text-2xl'>Notre Vision</h1>
                <p>
                    Notre vision globale est de devenir une plateforme incontournable pour les étudiants, en simplifiant leur accès aux opportunités académiques et en leur fournissant les ressources nécessaires pour réussir leurs parcours éducatifs. Nous aspirons à centraliser toutes les informations liées aux concours, universités, et écoles, tout en offrant une bibliothèque numérique riche et diversifiée. Notre rôle est de guider les jeunes dans leur quête de savoir et de réussite, en leur permettant de faire des choix éclairés, de se préparer efficacement, et d’explorer pleinement leur potentiel. Par cette initiative, nous voulons contribuer au développement d’une génération compétente et épanouie, prête à relever les défis de demain.
                </p>
            </div>
            <div className='pb-20 text-sm md:text-md lg:text-lg xl:text-xl text-center'>
                <h2 className='text-[#DE290C] font-bold pb-5 text-xl lg:text-2xl'>Notre Mission</h2>
                <p>
                    Notre plateforme a pour mission de démocratiser l'accès à l'information éducative en permettant à toute personne de rester informée des concours disponibles, afin de leur offrir une chance équitable de participation. Nous proposons également une bibliothèque enrichie de livres utiles pour accompagner les étudiants dans leur parcours académique et leur développement personnel. De plus, nous mettons en lumière les universités ainsi que les écoles placées sous leur tutelle, afin que chaque étudiant puisse identifier, dès le départ, l’établissement dans lequel son diplôme supérieur sera délivré. En regroupant ces ressources, nous visons à créer un espace unique et accessible pour soutenir la réussite éducative et professionnelle de chacun.
                </p>
            </div>
        </div>
        <Banner />
        <Comment />
        <Footer />
    </div>
  )
}

export default About
