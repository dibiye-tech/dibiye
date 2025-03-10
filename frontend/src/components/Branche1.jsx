import React, { useState, useEffect } from 'react';
import quotes from '../../images/quotes.png';
import { getBranchesBySousCategory } from '../hooks/useFetchQuery';
import { useNavigate } from 'react-router-dom';

const Branche = () => {

    const sousCategoryId = 4;  
    
    const [branches, setBranches] = useState([]);  
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await getBranchesBySousCategory(sousCategoryId);
                if (data) {
                    setBranches([{
                        sousCategoryId: sousCategoryId, 
                        sousCategoryName: data[0]?.sous_category?.name,
                        branches: data
                    }]);
                    console.log(data);
                } else {
                    setError(`Impossible de charger les branches pour la sous-catégorie ID ${sousCategoryId}`);
                }
            } catch (error) {
                setError('Une erreur est survenue lors de la récupération des branches.');
            }
            setLoading(false);
        };
    
        loadBranches();
    }, []); 

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleBrancheClick = (sousCategoryId, brancheId) => {
        navigate(`/documents/sous_category/${sousCategoryId}/branche/${brancheId}`);  
    };

    return (
        <div className='container mx-auto px-10 md:px-5'>
            <div className='text-sm md:text-md lg:text-lg xl:text-xl'>
                <h2 className='text-center text-[#DE290C] font-bold text-md md:text-lg lg:text-xl xl:text-2xl pt-10'>
                    <a href="/bibliotheque">Bibliothèque</a> &gt;&gt; Loisirs
                </h2>
                <hr className='bg-[#DE290C] w-[100px] h-1 mx-auto mt-2 mb-10' />
                <p className='text-sm lg:text-lg'>
                    <img src={quotes} alt="" />
                    <p className='font-bold pb-3 pl-12 text-sm md:text-md lg:text-lg xl:text-xl'>
                        Apprenez, évoluez, grandissez : notre offre d'enseignement vous accompagne vers la réussite.
                    </p>
                    <span className='text-sm md:text-md lg:text-lg xl:text-xl'>
                        Nos formations vous donnent accès aux dernières connaissances et pratiques dans votre domaine d'expertise,
                        vous permettant de rester compétitif et performant. Le monde du travail évolue constamment. Nos formations
                        vous donnent les outils nécessaires pour vous adapter aux changements et saisir de nouvelles opportunités.
                        L'apprentissage est un processus continu. Notre offre d'enseignement vous permet de vous former tout au long
                        de votre vie et de rester stimulé intellectuellement.
                    </span>
                    <img src={quotes} alt="" className='ml-[75%] lg:ml-[25%]' />
                </p>
            </div>

            <div className='pt-10 md:pt-20'>
                {branches.map((data) => (
                    <div key={data.sousCategoryId} className="mb-10">
                        <h3 className='text-md md:text-lg lg:text-xl underline text-[#DE290C] pb-10'>{data.sousCategoryName}</h3>
                        <div className='flex justify-start items-start gap-10 md:gap-20 flex-wrap'>
                            {data.branches.map((branche) => (
                                <div key={branche.id} className="mb-4 bg-white shadow-lg rounded-b-md" onClick={() => handleBrancheClick(data.sousCategoryId, branche.id)}>
                                    {branche.image && <img src={branche.image} alt={branche.name} className="w-[300px] h-[200px] rounded-t-md" />}
                                    <h4 className='font-semibold py-5 pl-3'>{branche.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Branche;
