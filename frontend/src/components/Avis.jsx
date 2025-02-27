import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUserCircle, FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";  // Ajouter les icônes
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Avis = ({ comments }) => {

    const settings = {
        dots: true,
        arrows: false,
        infinite: false,
        className: "center",
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                    autoplay: true,
                    pauseOnHover: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    infinite: true,
                    arrows: false,
                    dots: true,
                    autoplay: true,
                    pauseOnHover: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    infinite: true,
                    arrows: false,
                    dots: true,
                    autoplay: true,
                    pauseOnHover: true,
                }
            }
        ]
    };

    return (
        <div>
            <div className='pb-20 pt-10 block xl:hidden'>
                <div className='text-center mb-8'>
                    <h1 className="text-md md:text-lg lg:text-xl font-bold text-[#2278AC]">Avis des utilisateurs</h1>
                    <p className="text-lg text-gray-500 mt-2">Découvrez les expériences de nos lecteurs !</p>
                </div>
                <div className=''>
                    {comments.length > 0 ? (
                        <Slider {...settings}>
                            {comments.map(comment => (
                                <div className='text-black flex gap-20 items-start p-4 bg-white rounded-lg shadow-md px-6 py-6 w-full mb-3 border-b border-gray-300 hover:shadow-lg transition-shadow duration-200' key={comment.id}>
                                    <div className="flex flex-col md:flex-row gap-4  md:gap-20">
                                        {/* Avatar and Username section */}
                                        <div className='flex flex-row items-center space-x-4'>
                                            {comment.user && comment.user.photo ? 
                                                <img src={comment.user.photo} alt={comment.user.username} className='w-6 h-6 rounded-full object-cover' /> :
                                                <FaUserCircle className="w-6 h-6 text-[#2278AC]" />
                                            }
                                            <div>
                                                <h2 className='text-lg font-semibold text-[#2278AC]'>{comment.user ? comment.user.username : 'No name'}</h2>
                                                <p className='text-sm text-gray-500'>
                                                    {comment.created_at 
                                                        ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr }) 
                                                        : 'Date not available'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Comment Text */}
                                        <div className='flex flex-col space-y-2'>
                                            <p className='text-gray-800 text-base italic font-bold'>" {comment.content} "</p>
                                        </div>
                                    </div>
                                    {/* Actions section (optional like, dislike, reply) */}
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <p className='py-10 text-center text-lg font-semibold text-gray-600'>Aucun commentaire disponible pour le moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Avis;
