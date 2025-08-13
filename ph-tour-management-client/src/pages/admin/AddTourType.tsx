import DeleteConfirmation from "@/components/DeleteConfirmation";
import Loading from "@/components/Loader/Loading";
import AddTourTypeFrom from "@/components/modules/admin/tourType/AddTourTypeFrom";
import UpdateTourTypeModal from "@/components/modules/admin/tourType/UpdateTourTypeModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useDeleteTourTypeMutation,
  useTourTypesQuery,
} from "@/redux/features/tour/tour.api";
import { formatDate } from "@/utils/formatDate";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function AddTourType() {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useTourTypesQuery(null);
  const [deleteTourType] = useDeleteTourTypeMutation();

  const handleDelete = async (id: string) =>
    await deleteTourType({ id }).unwrap();

  if (isLoading) return <Loading />;

  return (
    <div className="w-full max-w-4xl mx-auto p-5">
      <div className="flex justify-between gap-2.5 flex-wrap mb-5">
        <h1 className="text-xl font-semibold">Tour Types</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm">Add Tour Type</Button>
          </SheetTrigger>
          <AddTourTypeFrom setOpen={setOpen} />
        </Sheet>
      </div>
      <Table className="border border-muted">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Edit</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ _id, name, createdAt }) => (
            <TableRow key={_id}>
              <TableCell>{name}</TableCell>
              <TableCell>{formatDate(createdAt)}</TableCell>

              <TableCell className="text-center">
                <UpdateTourTypeModal id={_id} name={name} />
              </TableCell>

              <TableCell className="text-center">
                <DeleteConfirmation
                  name={name}
                  onConfirm={() => handleDelete(_id)}
                >
                  <Button variant="destructive" size="xs" className="text-sm">
                    <Trash2 />
                  </Button>
                </DeleteConfirmation>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
