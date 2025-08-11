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
import { useDeleteTourTypeMutation } from "@/redux/features/tour/tour.api";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface iProps {
  id: string;
  name: string;
}

export default function DeleteTourTypeModal({ id, name }: iProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteTourType] = useDeleteTourTypeMutation();

  const handleLogout = async () => {
    setDeleting(true);
    const loaderId = toast.loading("Deleting Tour Type");
    try {
      const result = await deleteTourType({ id }).unwrap();
      if (result.success) {
        toast.success("Deleted the tour type successfully", { id: loaderId });
      } else toast.error(result.message, { id: loaderId });
    } catch {
      toast.error("Failed to delete tour type", { id: loaderId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="xs" className="text-sm">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are deleting the{" "}
            <span className="font-bold text-destructive">{name}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-destructive hover:bg-destructive/90 text-white"
            disabled={deleting}
          >
            <Trash2 className="mr-2" /> Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
