import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { RESET_USER_PASSWORD } from "../hooks/useFetchQuery";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordResetEmail = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const mutation = useMutation((d) => RESET_USER_PASSWORD(d), {
    onSuccess: (data) => {
      console.log(data);
      toast.success("Vérifier votre mail et suivez les étapes !", {
                      position: "top-right",
                      autoClose: 3000,
                    });

      navigate("/");
    },
    onError: (error) => {
      toast.error("Echec! Réessayez.", {
                      position: "top-right",
                      autoClose: 3000,
                    });

      console.log(error);
    },
  });
  const { isLoading } = mutation;
  const onSubmit = (d) => {
    mutation.mutate(d);
    reset();
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50" // Background color for better visibility
    >
      <ToastContainer />
      <Container
        maxW="lg"
        py={{ base: "12", md: "12" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack
          spacing="2"
          py={{ base: "0", sm: "6" }}
          bg="white"
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
          textAlign="center"
        >
          <Stack spacing="6">
            <Heading size={{ base: "xs", md: "md" }} color="#096197">
              Entrez votre mail pour changer de mot de passe
            </Heading>
          </Stack>
          <Box
            py={{ base: "0", sm: "0" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent", sm: "bg.surface" }}
          >
            <Stack spacing="4" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="4">
                <FormControl isInvalid={errors.email} isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    {...register("email", {
                      required: "Required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Adresse email invalide",
                      },
                    })}
                    id="email"
                    required
                    placeholder="Entrez votre mail"
                    type="email"
                  />
                  {errors.email?.type === "required" && (
                    <FormErrorMessage>
                      <FormErrorIcon /> Ce champ est obligatoire!
                    </FormErrorMessage>
                  )}
                  {errors.email?.type === "pattern" && (
                    <FormErrorMessage>
                      <FormErrorIcon /> Entrez une adresse email valide
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>

              <Stack spacing="4">
                <Button
                  bg="#096197"
                  color="white"
                  _disabled={{
                    cursor: "not-allowed",
                    opacity: "0.4",
                  }}
                  isDisabled={!isValid}
                  isLoading={isLoading}
                  type="submit"
                  _hover={{ backgroundColor: "#094a75" }}
                >
                  Modifier
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default PasswordResetEmail;
