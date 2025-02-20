import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getHistory, getBookDetails, deleteHistory, deleteAllHistory } from '../hooks/useFetchQuery';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';

const History = () => {
    const [histories, setHistories] = useState([]);
    const baseUrl = "http://localhost:8000";

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                const localHistoryIds = JSON.parse(localStorage.getItem('history')) || [];
                const localHistoryPromises = localHistoryIds.map(id => getBookDetails(id));
                const localHistoryDocuments = await Promise.all(localHistoryPromises);

                // Combiner l'historique avec une vérification pour le document
                const combinedHistory = [
                    ...data.map(item => item.document ? { document: item.document } : null).filter(Boolean), 
                    ...localHistoryDocuments.map(doc => ({ document: doc }))
                ];
                setHistories(combinedHistory);
            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        };

        fetchHistory();
    }, [toast]);

    const handleDeleteHistory = async (historyId) => {
        try {
            await deleteHistory(historyId);
            setHistories(prevHistories => prevHistories.filter(history => history && history.document.id !== historyId));
            toast.success("Ce document a été supprimé de l'historique!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleDeleteAllHistory = async () => {
        try {
            await deleteAllHistory();
            setHistories([]);
            localStorage.removeItem('history'); 
            toast.success("Tout l'historique a été supprimé!", {
                position: "top-right",
                autoClose: 3000,
             });
        } catch (error) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const settings = {
        dots: false,
        arrows: true,
        infinite: false,
        slidesToScroll: 2,
        slidesToShow: 5,
        className: "center",
        autoplay: false,
        nextArrow: <ChevronRight color="#096197" size={150} />,
        prevArrow: <ChevronLeft color="#096197" size={150} />,
        responsive: [
            {
                breakpoint: 1250,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: false,
                    arrows: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: false,
                    arrows: true,
                }
            },
        ]
    };

    return (
        <div className='container mx-auto px-10 md:px-5 lg:px-10 py-10'>
            <ToastContainer />
            <div>
                {histories.length > 0 ? (
                    <div className='flex justify-between gap-3 items-center pb-8'>
                        <p className='font-bold text-md md:text-lg lg:text-xl'>Mon Historique</p>
                        <div>
                            <button 
                                onClick={handleDeleteAllHistory}
                                className='text-red-500 hover:text-red-700 flex gap-2 items-center'>
                                <span>Supprimer l'historique</span>
                                <FaTrashAlt />
                            </button>
                        </div>
                    </div>
                ) : null}
                {histories.length > 0 && (
                    <Slider {...settings}>
                        {histories.map((history, index) => (
                            history.document ? (
                                <div key={index} className='flex flex-col gap-2 md:gap-4 h-auto md:w-[200px] ml-2 md:ml-10'>
                                    <Link to={`/book/${history.document.id}`}>
                                        <div>
                                            <img
                                                src={`${baseUrl}${history.document.image}`}
                                                alt={history.document.title}
                                                className='w-[130px] md:w-[200px] h-[180px] md:h-[250px] rounded-lg'
                                                onError={(e) => { e.target.onerror = null; e.target.src = `${history.document.image}` }}
                                            />
                                        </div>
                                    </Link>
                                    <div className='flex items-center justify-start lg:gap-5 py-3'>
                                        <div className='w-[100px] md:w-[140px] line-clamp-1 hover:line-clamp-2'>{history.document.title}</div>
                                        <div className='bg-white rounded-full shadow-md p-1 md:p-2 lg:p-3 cursor-pointer text-[#096197]' onClick={() => handleDeleteHistory(history.document.id)}>
                                            <AiOutlineDelete className='w-auto md:w-[20px] h-auto md:h-[20px]' />
                                        </div>
                                    </div>
                                    <div className='text-[#096197] font-semibold'>{history.document.auteur}</div>
                                </div>
                            ) : null
                        ))}
                    </Slider>
                )}
            </div>
        </div>
    );
}

export default History;
