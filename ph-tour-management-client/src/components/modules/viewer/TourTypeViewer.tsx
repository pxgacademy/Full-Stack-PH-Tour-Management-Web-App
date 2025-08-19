import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetSingleTourTypesQuery } from "@/redux/features/tour/tour.api";
import { format } from "date-fns";
import { Eye } from "lucide-react";

export default function TourTypeViewer({ id }: { id: string }) {
  const { data: tourType, isLoading, isError } = useGetSingleTourTypesQuery({ id });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs" className="text-sm">
          <Eye /> See
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tourType!.name}</DialogTitle>
          <DialogDescription>Created At: {format(tourType!.createdAt, "PP")}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
