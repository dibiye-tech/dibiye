import React from 'react';
import { Link } from 'react-router-dom';
import home from '../../images/librairie.jpg';

const Error = () => {
  return (
    <div className='overflow-y-hidden'>
      <div style={styles.container} className='container mx-auto px-10 md:px-5 pt-10 flex flex-col items-center justify-start gap-3 overflow-y-hidden'>
        <img src={home} alt="" className='h-[200px] md:h-[500px] w-auto md:w-[80%] rounded-lg md:rounded-2xl'/>
        <h1 className='font-bold text-[40px] lg:text-[90px] py-5 md:py-10'>404 Not Found!</h1>
        <p style={styles.message}>Désolé, la page que vous cherchez n'existe pas.</p>
        <Link to="/" style={styles.link}>Retourner à la page d'accueil</Link>
      </div>
    </div>
  )
};

const styles = {
    container: {
      textAlign: 'center',
      padding: '50px',
      height: '100vh',
    },
    header: {
      fontSize: '48px',
      color: '#d9534f',
    },
    message: {
      fontSize: '18px',
      color: '#555',
    },
    link: {
      display: 'inline-block',
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#2278AC',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '5px',
    }
  };

export default Error;
