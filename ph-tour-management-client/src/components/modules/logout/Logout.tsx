import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Logout() {
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    setLoggingOut(true);
    const loaderId = toast.loading("Logging out");
    try {
      await logout(null);
      dispatch(authApi.util.resetApiState());
      toast.success("Logged out successfully", { id: loaderId });
    } catch {
      toast.error("Failed to logout", { id: loaderId });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          <LogOut className="mr-2" /> Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are applying to logout.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-destructive"
            disabled={loggingOut}
          >
            Log me out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
