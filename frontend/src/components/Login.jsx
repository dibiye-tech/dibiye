import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import book from '../assets/images/book.png';
import boy from '../assets/images/boy.png';
import enam from '../assets/images/enam.png';
import { MdWavingHand } from "react-icons/md";
import google from '../assets/images/google.png';
import facebook from '../assets/images/facebook.png';
import { IoCloseOutline } from 'react-icons/io5';
import { useForm } from 'react-hook-form'; 
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    HStack,
    Input,
    IconButton,
    InputGroup,
    InputRightElement,
    useDisclosure,
    Stack,
    Text,
    useToast,
    FormErrorMessage,
    FormErrorIcon,
  } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { GET_AUTH, setTokens } from "../hooks/useFetchQuery";
import { useUser } from "../hooks/useUser";
import { useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";


const Login = ({orderPopup, setOrderPopup, handlerOrder}) => {


    const responsive = {
        0 : {items:1},
        568 : {items:1},
        1024 : {items:1},
    };
    const items = [
        <img src={book} alt="Livres" width={380} height={150} className='w-[420px] h-[650px]'/>,
        <img src={enam} alt="Livres" width={380} height={150} className='w-[420px] h-[650px]'/>,
        <img src={boy} alt="Livres" width={380} height={150} className='w-[420px] h-[650px]'/>
    ]

    const toast = useToast();
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { isOpen, onToggle } = useDisclosure();
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const onClickReveal = () => {
        onToggle();
        if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
        }
    };

    const mutation = useMutation((c) => GET_AUTH(c), {
        onSuccess: (data) => {
            let { access, refresh, ...newUser } = data;
            toast({
              title: "Connexion réussie!",
              position: "top",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setTokens(access, refresh);
    
            // Sauvegarde des données utilisateur dans le stockage local
            localStorage.setItem("user", JSON.stringify(newUser));
            
            setUser({
              ...newUser,
            });
            window.location.reload();
            setOrderPopup(false);
          },
        onError: (error) => {
          if (error.detail) {
            toast({
              title: error.detail,
              position: "top",
              status: "error",
              duration: 6000,
              isClosable: true,
            });
            return;
          }
          if (error.error) {
            toast({
              title: error.error,
              position: "top",
              status: "error",
              duration: 6000,
              isClosable: true,
            });
            return;
          }
          toast({
            title: "Nom d'utilisateur ou mot de passe incorrect",
            position: "top",
            status: "error",
            duration: 6000,
            isClosable: true,
          });
        },
      });

    const { isLoading } = mutation;

    function onSubmit(credentials) {
        toast({
        title: "Connexion...",
        position: "top-right",
        status: "info",
        duration: 1000,
        isClosable: true,
        });
        resetField("password");
        mutation.mutate(credentials);
    }
    
  return (
    <>
    {
        orderPopup && (
            <div className='popup'>
                <div className='h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm'>
            <div className='max-w-[950px] mx-auto px-5 my-[5%] md:my-[3%] md:px-auto pt-5'>
            <div className='pb-14 lg:pb-10 pl-[90%] lg:pl-[100%]'>
                <IoCloseOutline  className="absolute text-white text-5xl cursor-pointer" onClick={() => setOrderPopup(false)}/>
            </div>
                <div className='flex justify-center items-center overflow-hidden gap-10  bg-slate-200 pt-5 border border-1 border-white rounded-[30px] pr-0 md:pr-2'>
                    <div className='flex flex-col gap-4 py-5 px-5 w-auto md:w-1/2 md:pl-10'>
                        <div className='flex items-center gap-5'>
                            <p>Ravi de votre retour</p>
                            <MdWavingHand className='text-yellow-400'width={50} height={50}/>
                        </div>
                        <div>
                            <p className='text-[#808080]'>Aujourd’hui est un nouveau jour, c’est votre
                            jour. Connectez-vous pour continuez vos travaux</p>
                        </div>
                        <div>
                        <Stack
                            height={{ base: "100%", sm: "fit-content" }}
                            boxSize={{ base: "100%" }}
                            display={{ base: "flex", sm: "block" }}
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                        <Box
                            py={{ base: "0", sm: "2" }}
                            px={{ base: "4", sm: "10" }}
                            bg={{ base: "transparent", sm: "bg.surface" }}
                        >
                            <Stack spacing="4">
                            <Stack spacing="4">
                                <FormControl isRequired isInvalid={errors.username}>
                                <FormLabel htmlFor="email">Nom d'utilisateur</FormLabel>
                                <Input
                                    id="email"
                                    placeholder="Enter your username"
                                    type="text"
                                    name="username"
                                    borderColor={errors.username ? "red.500" : "#9E8625"}
                                    {...register("username", { required: true })}
                                />{" "}
                                {errors.username?.type === "required" && (
                                    <FormErrorMessage>
                                    <FormErrorIcon />
                                    Nom d'utilisateur obligatoire
                                    </FormErrorMessage>
                                )}
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.password}>
                                <FormLabel htmlFor="password">Mot de passe</FormLabel>
                                <InputGroup>
                                    <InputRightElement>
                                    <IconButton
                                        variant="text"
                                        aria-label={
                                        isOpen ? "Mask password" : "Reveal password"
                                        }
                                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                                        onClick={onClickReveal}
                                    />
                                    </InputRightElement>
                                    <Input
                                    id="password"
                                    ref={inputRef}
                                    name="password"
                                    type={isOpen ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    placeholder="********"
                                    {...register("password", { required: true })}
                                    />
                                </InputGroup>
                                {errors.password?.type === "required" && (
                                    <FormErrorMessage>
                                    <FormErrorIcon />
                                    Mot de passe obligatoire
                                    </FormErrorMessage>
                                )}
                                </FormControl>
                            </Stack>
                            <HStack justify="space-between">
                                <Checkbox defaultChecked>
                                <Text fontSize={{ base: "sm", sm: "md" }}>Se souvenir</Text>
                                </Checkbox>
                                <Button
                                fontSize={{ base: "sm", sm: "md" }}
                                variant="text"
                                size="sm"
                                color="#096197"
                                onClick={() => {
                                    navigate("/reset-password");
                                    setOrderPopup(false); // Fermer le popup ici aussi
                                }}
                                >
                                Mot de passe oublié
                                </Button>
                            </HStack>
                            <Stack spacing="4">
                                <Button
                                bg="#096197"
                                color="white"
                                isLoading={isLoading}
                                disabled={isLoading}
                                type="submit"
                                _disabled={{
                                    cursor: "not-allowed",
                                    opacity: "0.4",
                                }}
                                _hover={{ backgroundColor: "brand.yellow" }}
                                >
                                Connexion
                                </Button>
                            </Stack>
                            </Stack>
                        </Box>
                        </Stack>
                            <div className='pt-10 pb-5 text-center text-[#A39898]'>
                                <p>Ou Connectez-vous</p>
                            </div>
                            <div className='flex gap-5 md:flex-col'>
                                <div className='flex items-center justify-center md:gap-5 bg-[#B5D0E0] border border-[#B5D0E0] rounded-[15px] py-2 px-5 w-[100%]'> 
                                    <img src={google} alt="" width={35} height={35}/>
                                    <div>
                                        <p className='hidden md:block text-[14px] md:text-[16px] lg:text-[18px]'>Continuer avec Google</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center md:gap-5 bg-[#B5D0E0] border border-[#B5D0E0] rounded-[15px] py-2 px-5 w-[100%]'> 
                                    <img src={facebook} alt="" width={35} height={35}/>
                                    <div>
                                        <p className='hidden md:block'>Continuer avec Google</p>
                                    </div>
                                </div>
                            </div>
                            <div className='text-center pt-10 py-5'>
                                <p>Vous n'avez pas de compte? <a href="#" className='text-[#096197] hover:underline' onClick={handlerOrder}>Créer votre compte</a></p>
                            </div>
                        </div>
                    </div>
                    <div className='hidden md:block w-auto md:w-[400px] mr-3'>
                        <AliceCarousel 
                            mouseTracking
                            items={items}
                            responsive={responsive}
                            controlsStrategy='alternate'
                            autoPlay={true}
                            autoPlayInterval={3000}
                            infinite
                        />
                    </div>
                </div>
            </div>
            </div>
            </div>
        )
    }
    </>
  )
}

export default Login;