import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivateUser } from "../hooks/useFetchQuery";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

const ActivateEmail = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [pageLoading, setPageLoading] = useState(true);

  const credentials = { uid, token };

  const mutation = useMutation((c) => ActivateUser(c), {
    onSuccess: (data) => {
      toast({
        title: "Compte activé !!",
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);

      console.log(data);
    },
  });

   useEffect(() => {
     if (!uid || !token) {
       setPageLoading(false);
       navigate("/");
       toast({
         title: "Vous n'avez pas accès à cette page.",
         position: "top",
         status: "error",
         duration: 5000,
         isClosable: true,
       });

       return;
     }
     if (uid && token) {
       setPageLoading(false);
       mutation.mutate(credentials);
     }
   }, []);
  const { isLoading, isError, isSuccess } = mutation;
   if (pageLoading || isLoading) {
     return (
       <Box
         h="100vh"
         display="flex"
         alignItems="center"
         justifyContent="center"
         bgGradient="linear-gradient(
           22deg,
           rgba(158,134,37,1) 24%,
           rgba(245,226,197,1) 73%
       )"
         bgSize="cover"
         bgPosition="right top"
         bgRepeat="no-repeat"
       >
         <Box className="app-loader"></Box>
       </Box>
     );
   }

  return (
    <Stack
      bgGradient="linear-gradient(
      22deg,
      rgba(158,134,37,1) 24%,
      rgba(245,226,197,1) 73%
    )"
      bgSize="cover"
      width="100vw"
      color="brand.white"
      h="100vh"
      align="center"
      justify="center"
    >
      <Stack bg="white" maxW="lg" p={7} borderRadius="3xl" spacing={4}>

        {isSuccess && (
          <Heading size="lg" textAlign="center" color="brand.blue">
            Merci d'avoir activé votre mail
          </Heading>
        )}
      </Stack>
    </Stack>
  );
};
export default ActivateEmail;