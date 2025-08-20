import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="grid place-content-center min-h-screen text-center">
      <h3 className="text-2xl text-foreground mb-4">You are not authorized</h3>
      <Link to="/">
        <Button>Home</Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
