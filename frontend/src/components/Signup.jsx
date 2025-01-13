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
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useMutation } from "react-query";
import {  CREATE_NEW_USER } from "../hooks/useFetchQuery";
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
    FormHelperText,
    FormErrorMessage,
    FormErrorIcon,
  } from "@chakra-ui/react";

const Signup = ({order, setOrder, handlerOrderPopup}) => {

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

    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { isOpen, onToggle } = useDisclosure();

    const toast = useToast();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm({ mode: "onChange" });
    const password = watch("password");

  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

    const mutation = useMutation((c) => CREATE_NEW_USER(c), {
        onSuccess: () => {
        toast({
            title: "Enregistrement réussi!",
            description:
            "Consultez votre boite mail pour confirmer votre compte",
            position: "top",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        setOrderPopup(false);
        window.location.reload();
        },
        onError: (error) => {
        if (error.response.status === 400) {
            if (error.response.data.email) {
            toast({
                title: "Echec!!",
                description: error.response.data.email[0],
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            }
            if (error.response.data.username) {
            toast({
                title: "Echec!!",
                description: error.response.data.username[0],
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            }
            if (error.response.data.password) {
            toast({
                title: "Echec!!",
                description: error.response.data.password[0],
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            }
        }
        },
    });

    const { isLoading, error } = mutation;

    if (error) {
        error.code == "ERR_NETWORK" &&
        toast({
            title: error.message,
            description: "Vérifier votre connexion internet",
            position: "top",
            status: "error",
            duration: 9000,
            isClosable: true,
        });
    }

    const onSubmit = (data) => {
        if (data.password !== data.confirmPassword) {
        toast({
            title: "Les mots de passes ne correspondent pas",
            description: "Please check your password",
            position: "top",
            status: "error",
            duration: 9000,
            isClosable: true,
        });
        return;
        }
        toast({
        title: "Enregistrement...",
        position: "top-right",
        status: "info",
        duration: 9000,
        isClosable: true,
        });

        reset();
        // eslint-disable-next-line no-unused-vars
        const { confirmPassword, ...credentials } = data;
        mutation.mutate(credentials);
    };


  return (
    <>
    {
        order && (
            <div className='popup'>
            <div className='h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm scroll-m-1'>
            <div className='max-w-[950px] mx-auto px-5 my-[5%] md:my-[3%] md:px-auto'>
            <div className='pb-14 lg:pb-10 pl-[90%] lg:pl-[100%]'>
                <IoCloseOutline  className="absolute text-white text-5xl cursor-pointer" onClick={() => setOrder(false)}/>
            </div>
                <div className='flex justify-center items-center overflow-hidden gap-10 bg-slate-200 pt-5 border border-1 border-white rounded-[30px] pr-0 md:pr-2'>
                    <div className='flex flex-col gap-4 py-5 px-5 w-auto md:w-1/2 md:pl-10'>
                        <div>
                        <Box
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                            py={{ base: "2", sm: "5" }}
                            px={{ base: "4", sm: "10" }}
                            bg={{ base: "transparent", sm: "bg.surface" }}
                            >
                            <Stack spacing="3">
                                <Stack spacing="2">
                                <FormControl isInvalid={errors.username} isRequired>
                                    <FormLabel htmlFor="username" fontWeight="bold">
                                    Nom d'utilisateur
                                    </FormLabel>
                                    <Input
                                    id="username"
                                    type="text"
                                    placeholder="Franck Kamdem"
                                    {...register("username", {
                                        required: true,
                                    })}
                                    />
                                    {errors.username?.type === "required" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Ce champ est obligatoire!
                                    </FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl isInvalid={errors.email} isRequired>
                                    <FormLabel htmlFor="email" fontWeight="bold">
                                    Email
                                    </FormLabel>
                                    <Input
                                    id="email"
                                    type="email"
                                    placeholder="Entrer votre mail"
                                    {...register("email", {
                                        required: true,
                                        pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: "invalid email address",
                                        },
                                    })}
                                    />
                                    {errors.email?.type === "required" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Ce champ est obligatoire!
                                    </FormErrorMessage>
                                    )}
                                    {errors.email?.type === "pattern" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Entrer une adresse mail valide
                                    </FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl isInvalid={errors.password} isRequired>
                                    <FormLabel htmlFor="password" fontWeight="bold">
                                    Mot de passe
                                    </FormLabel>
                                    <InputGroup>
                                    <InputRightElement>
                                        <IconButton
                                        variant="text"
                                        aria-label={isOpen ? "Mask password" : "Reveal password"}
                                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                                        onClick={onClickReveal}
                                        />
                                    </InputRightElement>
                                    <Input
                                        id="password"
                                        ref={inputRef}
                                        name="password"
                                        placeholder="********"
                                        type={isOpen ? "text" : "password"}
                                        autoComplete="current-password"
                                        {...register("password", {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 15,
                                        })}
                                    />
                                    </InputGroup>{" "}
                                    {!errors.password && (
                                    <FormHelperText color="brand.blue">
                                        Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule et un chiffre
                                    </FormHelperText>
                                    )}
                                    {errors.password?.type === "required" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Mot de passe obligatoire!
                                    </FormErrorMessage>
                                    )}
                                    {errors.password?.type === "minLength" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Mot de passe à plus de 6 chiffres
                                    </FormErrorMessage>
                                    )}
                                    {errors.password?.type === "maxLength" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Mot de passe ne doit pas dépasser 15 caractères
                                    </FormErrorMessage>
                                    )}
                                </FormControl>
                                <FormControl isInvalid={errors.confirmPassword} isRequired>
                                    <FormLabel htmlFor="passwordConfirm" fontWeight="bold">
                                    Confirmation de Mot de passe
                                    </FormLabel>
                                    <InputGroup>
                                    <InputRightElement>
                                        <IconButton
                                        variant="text"
                                        aria-label={isOpen ? "Mask password" : "Reveal password"}
                                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                                        onClick={onClickReveal}
                                        />
                                    </InputRightElement>
                                    <Input
                                        id="passwordConfirm"
                                        ref={inputRef}
                                        name="passwordConfirm"
                                        placeholder="********"
                                        type={isOpen ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        {...register("confirmPassword", {
                                        required: true,
                                        validate: (value) =>
                                            value === password || "The passwords do not match",
                                        })}
                                    />
                                    </InputGroup>
                                    {errors.confirmPassword?.type === "required" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> Mot de passe obligatoire!
                                    </FormErrorMessage>
                                    )}
                                    {errors.confirmPassword?.type === "validate" && (
                                    <FormErrorMessage>
                                        <FormErrorIcon /> {errors.confirmPassword.message}
                                    </FormErrorMessage>
                                    )}
                                </FormControl>
                                </Stack>

                                <HStack justify="space-between">
                                <Checkbox defaultChecked>Se souvenir</Checkbox>
                                </HStack>
                                <Stack spacing="4">
                                <Button
                                    bg="#096197"
                                    type="submit"
                                    isLoading={isLoading}
                                    isDisabled={!isValid || isLoading}
                                    _hover={{
                                    bg: "#096197",
                                    }}
                                    _disabled={{
                                    backgroundColor: "gray",
                                    cursor: "not-allowed",
                                    color: "gray.400",
                                    _hover: {
                                        backgroundColor: "gray",
                                    },
                                    }}
                                    color="white"
                                >
                                    Enregistrement
                                </Button>
                                </Stack>
                            </Stack>
                            </Box>
                            <div className='pt-10 pb-5 text-center text-[#A39898]'>
                                <p>Ou Connectez-vous</p>
                            </div>
                            <div className='flex gap-5 md:flex-col'>
                                <div className='flex items-center justify-center md:gap-5 bg-[#B5D0E0] border border-[#B5D0E0] rounded-[15px] py-2 px-5 w-[100%]'> 
                                    <img src={google} alt="" width={40} height={40}/>
                                    <div>
                                        <p className='hidden md:block'>Continuer avec Google</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center md:gap-5 bg-[#B5D0E0] border border-[#B5D0E0] rounded-[15px] py-2 px-5 w-[100%]'> 
                                    <img src={facebook} alt="" width={40} height={40}/>
                                    <div>
                                        <p className='hidden md:block'>Continuer avec Google</p>
                                    </div>
                                </div>
                            </div>
                            <div className='text-center pt-10 py-5'>
                                <p>Vous avez déjà un compte? <a href="#" className='text-[#096197] hover:underline' onClick={handlerOrderPopup}>Connectez-vous</a></p>
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

export default Signup;