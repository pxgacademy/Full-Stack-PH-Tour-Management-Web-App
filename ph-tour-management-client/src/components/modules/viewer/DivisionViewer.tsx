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
import { useGetSingleDivisionQuery } from "@/redux/features/division/division.api";
import { format } from "date-fns";
import { Eye } from "lucide-react";

export default function DivisionViewer({ id }: { id: string }) {
  const { data: division, isLoading, isError } = useGetSingleDivisionQuery({ id });

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
        <div className="w-full h-40 rounded-md overflow-hidden">
          <img
            src={division?.thumbnail}
            alt={division?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <DialogHeader>
          <DialogTitle>{division!.name}</DialogTitle>
          <DialogDescription>Created At: {format(division!.createdAt, "PP")}</DialogDescription>
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
