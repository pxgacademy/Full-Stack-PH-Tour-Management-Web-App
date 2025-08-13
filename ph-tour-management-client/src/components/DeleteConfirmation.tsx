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
import type { iChildren } from "@/global-interfaces";
import type { iResponse } from "@/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface iProps extends iChildren {
  onConfirm: () => Promise<iResponse<null>>;
  name: string;
}

export default function DeleteConfirmation({
  children,
  onConfirm,
  name,
}: iProps) {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleConfirm = async () => {
    const loaderId = toast.loading(`Deleting ${name}`);

    setDeleting(true);
    try {
      const result = await onConfirm();
      if (result.success) {
        toast.success(result.message, { id: loaderId });
      } else toast.error(result.message, { id: loaderId });
    } catch {
      toast.error(`Failed to delete ${name}`, { id: loaderId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
            onClick={handleConfirm}
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
