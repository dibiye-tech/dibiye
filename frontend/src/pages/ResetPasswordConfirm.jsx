import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Stack,
  FormErrorMessage,
  FormErrorIcon,
} from "@chakra-ui/react";
import { useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RESET_PASSWORD } from "../hooks/useFetchQuery";
import { useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const inputRef = useRef(null);
  const secondInputRef = useRef(null);
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpen2, onToggle: onToggle2 } = useDisclosure();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const password = watch("password");

  const onClickReveal = (refer = "second") => {
    if (refer === "first") {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    } else if (refer === "second") {
      onToggle2();
      if (secondInputRef.current) {
        secondInputRef.current.focus({ preventScroll: true });
      }
    }
  };

  const mutation = useMutation((c) => RESET_PASSWORD(c), {
    onSuccess: () => {
      toast.success("Connectez vous avec votre nouveau mot de passe !", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const { isLoading } = mutation;

  function onSubmit(credentials) {
    reset();
    if (!uid || !token) {
      toast.error("Vous n'avez pas accès à cette page!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");

      console.log(credentials);

      return;
    }
    if (uid && token) {
      console.log(credentials);

      if (credentials.password !== credentials.confirmPassword) {
        toast.error("Les mots de passes ne correspondent pas!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const newCredentials = {
        new_password: credentials.password,
        uid: uid,
        token: token,
      };

      mutation.mutate(newCredentials);
    }
  }
  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "12" }}
      px={{ base: "0", sm: "8" }}
      h="100vh"
    ><ToastContainer />
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing="2"
          pt={{ base: "0", sm: "8" }}
          pb={{ base: "0", sm: "5" }}
          bg="white"
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
        >
          <Stack spacing="6">

            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "lg" }} color="brand.blue">
                Retrouver un mot de passe
              </Heading>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "2" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent", sm: "bg.surface" }}
          >
            <Stack spacing="4">
              <Stack spacing="4">
                <FormControl
                  isRequired
                  isInvalid={errors.password}
                  _invalid={{
                    borderColor: "red",
                  }}
                >
                  <FormLabel htmlFor="password">Nouveau mot de passe</FormLabel>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        variant="text"
                        aria-label={
                          isOpen ? "Mask password" : "Reveal password"
                        }
                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={() => onClickReveal("first")}
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
                      {...register("password", {
                        required: true,
                        minLength: 6,
                        maxLength: 16,
                      })}
                    />
                  </InputGroup>
                  {errors.password?.type === "required" && (
                    <FormErrorMessage>
                      <FormErrorIcon />
                      Mot de passe obligatoire
                    </FormErrorMessage>
                  )}
                  {errors.password?.type === "minLength" && (
                    <FormErrorMessage>
                      <FormErrorIcon />
                      Password must be at least 6 characters
                    </FormErrorMessage>
                  )}
                  {errors.password?.type === "maxLength" && (
                    <FormErrorMessage>
                      <FormErrorIcon />
                      Password must be at most 16 characters
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">
                    Confirmation
                  </FormLabel>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        variant="text"
                        aria-label={
                          isOpen2 ? "Mask password" : "Reveal password"
                        }
                        icon={isOpen2 ? <HiEyeOff /> : <HiEye />}
                        onClick={() => onClickReveal("second")}
                      />
                    </InputRightElement>
                    <Input
                      id="confirmPassword"
                      ref={secondInputRef}
                      name="confirmPassword"
                      type={isOpen2 ? "text" : "password"}
                      autoComplete="confirmPassword"
                      required
                      placeholder="********"
                      {...register("confirmPassword", {
                        required: true,
                        validate: (value) =>
                          value === password || "Les mots de passe ne correspondent pas",
                      })}
                    />
                  </InputGroup>
                  {errors.confirmPassword?.type === "required" && (
                    <FormErrorMessage>
                      <FormErrorIcon />
                      Mot de passe requis
                    </FormErrorMessage>
                  )}
                  {errors.confirmPassword?.type === "validate" && (
                    <FormErrorMessage>
                      <FormErrorIcon />
                      {errors.confirmPassword.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>

              <Stack spacing="4">
                <Button
                  bg="#096197"
                  color="white"
                  isLoading={isLoading}
                  isDisabled={isLoading || !isValid}
                  type="submit"
                  _hover={{ backgroundColor: "#096197" }}
                >
                  Retrouver
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};
export default ResetPassword;
