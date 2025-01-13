import React, { useState, useEffect } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Box, Button, Checkbox, FormControl, FormLabel, HStack, Input, Stack, FormErrorMessage, FormErrorIcon, useToast } from "@chakra-ui/react";
import { useUser } from '../hooks/useUser';
import { useForm } from 'react-hook-form'; 
import { UPDATE_PROFILE } from '../hooks/useFetchQuery'; 

const Profile1 = () => {

  const { user, setUser } = useUser();
  const toast = useToast();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (user) {
      setPhoto(user.photo || null);
    }
  }, [user]);

  if (!user) {
    return <p>Chargement des données utilisateur...</p>;
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (data.username) formData.append('username', data.username);
      if (data.first_name) formData.append('first_name', data.first_name);
      if (data.last_name) formData.append('last_name', data.last_name);
      if (data.email) formData.append('email', data.email);
      if (data.description) formData.append('description', data.description);
      
      // Ajouter la photo uniquement si elle est présente
      if (photo && photo instanceof File) {
        formData.append('photo', photo);
      }

      const updatedUser = await UPDATE_PROFILE(formData);

      setUser(updatedUser);
      toast({
        title: "Profil mis à jour!",
        position: "top",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
      window.location.reload();
    }catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error.response ? error.response.data : error.message);
        toast({
            title: "Échec de la mise à jour!",
            position: "top",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
  };

  return (
    <div>
      
      <div className='flex gap-10 flex-wrap mt-0 md:mt-10'>
          <div className='mt-0 md:mt-10 mx-5 md:mx-0 p-10 md:p-20 md:h-[700px] w-[800px] md:w-[400px] lg:w-[600px] text-slate-900 border rounded-xl shadow-2xl h-auto flex flex-col gap-5 items-center md:items-start'>
            <div>
              {user.photo ? 
                (<img src={user.photo} alt="Profile" width={150} className='rounded-full' />) :
                (<FaUserCircle className="text-6xl text-[#2278AC]" />)
              }
            </div>
            <p className='font-bold underline'>Nom d'utilisateur:</p> <span className='font-bold text-[#2278AC]'>{user.username}</span>
            <p className='font-bold underline'>Email:</p><span>{user.email}</span>
            <p className='font-bold underline'>Bio:</p><span>{user.description || "Aucune description définie"}</span>
          </div>
          <div className='rounded-xl shadow-2xl mx-5 md:mx-0 h-auto md:h-[700px] w-[800px] md:w-[400px] lg:w-[600px] mt-0 md:mt-10 border p-10'>
            <Box
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              py={{ base: "2", sm: "5" }}
              px={{ base: "4", sm: "10" }}
              bg={{ base: "transparent", sm: "bg.surface" }}
            >
              <Stack spacing="3">
                <Stack spacing="2">
                  <FormControl isInvalid={errors.username}>
                    <FormLabel htmlFor="username" fontWeight="bold">
                      Nom d'utilisateur
                    </FormLabel>
                    <Input
                      id="username"
                      placeholder="Franck Kamdem"
                      {...register('username')}
                    />
                    <FormErrorMessage>
                      {errors.username && errors.username.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="first_name" fontWeight="bold">
                      Nom
                    </FormLabel>
                    <Input
                      id="first_name"
                      {...register('first_name')}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="last_name" fontWeight="bold">
                      Prénom
                    </FormLabel>
                    <Input
                      id="last_name"
                      {...register('last_name')}
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.email}>
                    <FormLabel htmlFor="email" fontWeight="bold">
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrer votre mail"
                      {...register('email', {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Adresse email invalide',
                        }
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="photo" fontWeight="bold">
                      Photo
                    </FormLabel>
                    <Input
                      id="photo"
                      type="file"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="description" fontWeight="bold">
                      Description
                    </FormLabel>
                    <Input
                      id="description"
                      placeholder="Bonjour..."
                      {...register('description')}
                    />
                  </FormControl>
                </Stack>

                <HStack justify="space-between">
                  <Checkbox defaultChecked>Se souvenir</Checkbox>
                </HStack>

                <Stack spacing="4">
                  <Button
                    bg="#096195"
                    type="submit"
                    _hover={{ bg: "#096197" }}
                    _disabled={{ backgroundColor: "gray", cursor: "not-allowed", color: "gray.400", _hover: { backgroundColor: "gray" } }}
                    color="white"
                  >
                    Mettre à jour
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </div>
        </div>
      
    </div>
  )
}

export default Profile1
