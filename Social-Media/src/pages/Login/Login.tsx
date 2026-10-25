import {
  Alert,
  Button,
  FieldError,
  Input,
  Spinner,
  TextField,
} from "@heroui/react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchema,
  type LoginSchemaType,
} from "../../lib/Schemas/Auth.schema";
import { loginUser } from "../../services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { TokenContext } from "../../components/context/tokenContext";
export default function Login() {
  const [successMessage, setsuccessMessage] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const navigate = useNavigate();
  const { setToken } = useContext(TokenContext)!;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function submitData(values: LoginSchemaType) {
    console.log(values);
    seterrorMessage("");
    setsuccessMessage("");
    try {
      const response = await loginUser(values);
      console.log(response);
      console.log(response.data.data.token);
      localStorage.setItem("userToken", response.data.data.token);
      setToken(response.data.data.token);
      console.log(response.data.message);
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
        toast.error(error.response?.data?.message, {
          duration: 4000,
          position: "top-right",
        });
      }
    }
  }
  return (
    <>
      <main>
        <section>
          <h1 className="text-4xl font-black text-main">
            Log in to Route Posts
          </h1>
          <p className="py-6 font-lg">
            Log in and continue your social journey.
          </p>
          {successMessage && (
            <>
              {" "}
              <Alert status="success" className="bg-green-200">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{successMessage}</Alert.Title>
                </Alert.Content>
              </Alert>{" "}
            </>
          )}
          {errorMessage && (
            <>
              {" "}
              <Alert status="danger" className="bg-red-200">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{errorMessage}</Alert.Title>
                </Alert.Content>
              </Alert>{" "}
            </>
          )}
          <form className="space-y-5 pt-4" onSubmit={handleSubmit(submitData)}>
            <TextField
              aria-label="email"
              className="w-full"
              isInvalid={Boolean(errors.email)}
            >
              <Input
                {...register("email")}
                aria-label="Email"
                type="email"
                className="w-full rounded-md"
                placeholder="Email"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>
            <TextField
              aria-label="password"
              className="w-full"
              isInvalid={Boolean(errors.password)}
            >
              <Input
                {...register("password")}
                aria-label="password"
                type="password"
                className="w-full rounded-md"
                placeholder="password"
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>
            <Button type="submit" className="bg-main round-md w-full">
              {isSubmitting ? (
                <div className="flex gap-2">
                  <Spinner className="text-white" /> <p>Loading.....</p>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
