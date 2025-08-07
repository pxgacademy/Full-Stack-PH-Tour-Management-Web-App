import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Verify() {
  const navigate = useNavigate();
  const { state: email } = useLocation();

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null;

  return (
    <div className="">
      <h1 className="">This is Verify component</h1>
    </div>
  );
}
