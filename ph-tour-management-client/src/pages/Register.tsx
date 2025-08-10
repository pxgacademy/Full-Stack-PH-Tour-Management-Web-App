import Logo from "@/assets/icons/logo";
import TravelRegister from "@/assets/images/travel-register.jpg";
import { RegisterForm } from "@/components/modules/authentication/RegisterForm";
import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="grid place-content-center min-h-screen">Loading...</div>
    );

  if (user) navigate("/");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={TravelRegister}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
