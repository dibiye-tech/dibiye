import React from 'react';
import { useState , useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { enablePageScroll } from "scroll-lock";
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa6';
import livre from '../assets/images/livre.jfif';
import livre1 from '../assets/images/livre1.png';
import { useUser } from '../hooks/useUser';
import { logout } from '../hooks/useFetchQuery';
import { FaUserCircle } from "react-icons/fa";



const Navbar = ({handlerOrderPopup, handlerOrder}) => {
    const [dropdownLinks, setDropdownLinks] = useState([]);
        const [nav, setNav] = useState(false);
    
        const Links = [
            {
                id: 1,
                title: "Accueil",
                path: "/"
            },
            {
                id: 2,
                title: "A propos",
                path: "/about"
            }
        ];
    
        const { user, setUser } = useUser(); // Utilisation du hook useUser
        const isLoggedIn = !!user; // Vérifie si l'utilisateur est connecté
    
        const handleLogout = () => {
            logout();
            localStorage.removeItem("user");
            const savedUser = JSON.parse(localStorage.getItem("user"));
            if (savedUser && savedUser.id) {
              localStorage.removeItem(`favorites_user_${savedUser.id}`);
            }
            setUser(null); // Réinitialise l'utilisateur
          };
          
    
        const handleClick = () => {
            if (!nav) return;
        
            enablePageScroll();
            setNav(false);
          };
    
          const DropdownLinks = [ 
            {
                id: 1,
                title: "Enseignements",
                subtitle1: "Primaire",
                subtitle2: "Secondaire",
                subtitle3: "Superieur",
                link: "/bibliotheque/enseignements#primaire",
            },{
                id: 2,
                title: "Loisirs",
                subtitle1: "Loisir1",
                subtitle2: "Loisir2",
                subtitle3: "Loisir3",
                link: "/bibliotheque/loisirs",
            }
        ];
        useEffect(() => {
            const fetchDropdownData = async () => {
              try {
                // Récupérer les catégories
                const categoryResponse = await fetch('http://127.0.0.1:8000/concours/concourscategories/?limit=3');
                const categoryData = await categoryResponse.json();
        
                // Récupérer les sous-catégories
                const subcategoryResponse = await fetch('http://127.0.0.1:8000/concours/concourssubcategories/');
                const subcategoryData = await subcategoryResponse.json();
        
                // Mapper les sous-catégories à leurs catégories
                const formattedLinks = categoryData.results.map((category) => {
                  const relatedSubcategories = subcategoryData.results.filter((subcategory) =>
                    subcategory.categories.some((cat) => cat.id === category.id)
                  );
        
                  return {
                    id: category.id,
                    title: category.name,
                    subcategories: relatedSubcategories.map(sub => ({
                      id: sub.id,
                      name: sub.name,
                      link: `/subcategory/${sub.id}`
                    })),
                    link: `#`,
                  };
                });
        
                setDropdownLinks(formattedLinks);
              } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
              }
            };
        
            fetchDropdownData();
          }, []);
        
    
      return (
        <div className='text-sm md:text-md lg:text-lg xl:text-xl lg:bg-white pb-10'>
            <div className='fixed w-[100%] px-[10%] z-10 md:z-20 flex items-center justify-between py-2 bg-white border-b-2 border-[#2278AC]'>
                <div>
                    <a href="/" className='cursor-pointer'>
                        <img src={logo} alt="Logo" width={130} height={80}/>
                    </a>
                </div>
                <div>
                        <div>
                            <div onClick={() => setNav(!nav)} className='lg:hidden'>
                                        {
                                            nav ?
                                            <MdClose className='text-[#2278AC] w-[26px] h-[29.58px] lg:hidden'/>
                                            : 
                                            <FiMenu className='text-[#2278AC] w-[26px] h-[29.58px] lg:hidden'/>
                                        }
                            </div>
                        </div>
                    <div className={`backdrop-blur-md lg:bg-white py-20 lg:py-0 w-[98vw] h-[70vh] lg:w-auto lg:h-auto absolute top-[60px] right-[40%] lg:top-0 lg:right-0 lg:relative flex flex-col lg:flex-row items-center gap-10 xl:gap-24 2xl:gap-32 lg:justify-between  ${nav ? 'left-0 top-[70px] transition-all duration-700' : 'left-[-1000px] transition-all duration-700'} lg:left-0`}>
                        <div>
                            <ul className='flex flex-col lg:flex-row items-center justify-center'>
                                {
                                    Links.map((data) => (
                                        <li key={data.id} className='block text-center pb-5 lg:pb-0 lg:inline-block'>
                                            <Link to={data.path} className='ml-4 xl:ml-6 hover:text-[#DE290C]  hover:font-bold' onClick={handleClick}>{data.title}</Link>
                                        </li>
                                    ))
                                }
                                
                                <li className='group relative cursor-pointer ml-5 z-20'>
                                    
                                  <Link to="/bibliotheque"
                                    className="flex justify-center items-center gap-[2px] py-2"
                                    >Bibliothèque
                                    <span>
                                    <FaCaretDown className="transition-all duration-500 group-hover:rotate-180"/>
                                    </span>
                                    </Link>
                                    <div className="absolute z-10 hidden group-hover:block ml-[-100px] md:ml-[-200px] rounded-md bg-white p-5 text-black shadow-xl w-auto"> 
                                        <div className='flex flex-col items-center justify-center md:flex-row gap-5 md:gap-20 overflow-y-scroll md:overflow-hidden'>
                                            <div className='w-[150px] h-auto'>
                                                <img src={livre} alt=""  className='border rounded-lg'/>
                                            </div>
                                            <div >
                                                <ul className='flex flex-col md:flex-row gap-5 md:gap-20'>
                                                    {
                                                        DropdownLinks.map((data) => (
                                                            <div key={data.id} className='flex flex-col items-start justify-between gap-5'>
                                                                <div>
                                                                    <p className='text-[#2278AC]'>{data.title}</p>
                                                                </div>
                                                                <div>
                                                                    <li className='flex flex-col items-start gap-2'>
                                                                        <a href={data.link} className='hover:text-[#DE290C]'>{data.subtitle1}</a>
                                                                        <a href={data.link} className='hover:text-[#DE290C]'>{data.subtitle2}</a>
                                                                        <a href={data.link} className='hover:text-[#DE290C]'>{data.subtitle3}</a>
                                                                    </li>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                               
                                <li className='group relative cursor-pointer ml-7'>
                                <Link to="/homeconcours"
                                    className="flex justify-center items-center gap-[2px] py-2 whitespace-nowrap"
                                >Concours
                                    <span>
                                    <FaCaretDown className="transition-all duration-500 group-hover:rotate-180" />
                                    </span>
                                    </Link>
                                <div className="absolute z-10 hidden group-hover:block ml-[-150px] md:ml-[-400px] lg:ml-[-600px] rounded-md bg-white p-5 text-black shadow-xl"> 
                                    <div className='flex flex-col md:flex-row gap-5 md:gap-20'>
                                    {/* Image */}
                                    {/* Image */}
                                <div className='w-[200px] h-auto'>
                                <img 
                                    src='/images/livre1.png' 
                                    alt="Concours Image" 
                                    className='border rounded-lg w-full md:w-[300px] h-[150px] md:h-full object-center' 
                                />
                                </div>
    
                                    {/* Sous-catégories et catégories */}
                                    <div>
                                        <ul className='flex flex-col md:flex-row gap-5 md:gap-20'>
                                        {
                                            dropdownLinks.map((data) => (
                                            <div key={data.id} className='flex flex-col items-start justify-between gap-5 md:w-[100px] lg:w-[150px] xl:w-[200px]'>
                                                <div>
                                                    <p className='text-[#2278AC]'>{data.title}</p>
                                                </div>
                                                <div>
                                                    <li className='flex flex-col items-start gap-2'>
                                                        {
                                                        data.subcategories.map(sub => (
                                                            <Link to={sub.link} key={sub.id} className='hover:text-[#DE290C]'>
                                                            {sub.name}
                                                            </Link>
                                                        ))
                                                        }
                                                    </li>
                                                </div>
                                            </div>
                                            ))
                                        }
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                                </li>
                            </ul>
                        </div>
                        <div className='flex items-center'>
                        {isLoggedIn ? (
                                    <div className='flex items-center gap-2 xl:gap-4 group relative'>
                                        {
                                            user.photo ? 
                                            (<a href="/profile"><img src={user.photo} alt="" width={25} className='rounded-full'/></a>) :
                                            (<a href="/profile"><FaUserCircle className='text-[#2278AC]'/></a>)
                                        }
                                        <p className=''><a href="/profile" className='lg:hidden xl:block mr-3 text-[#2278AC]'>{user.username}</a></p>
                                        <span className='text-[#DE290C]'>|</span>
                                        <button 
                                            onClick={handleLogout} 
                                            className='bg-[#2278AC] group-hover:block text-white py-1 px-4 border border-1 border-[#2278AC] rounded-xl hover:bg-[#096197] cursor-pointer'
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handlerOrderPopup} 
                                        className='bg-[#2278AC] text-white py-1 px-4 border border-1 border-[#2278AC] rounded-xl hover:bg-[#096197] cursor-pointer'
                                    >
                                        Connexion
                                    </button>
                                )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar;