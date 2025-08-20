import DeleteConfirmation from "@/components/DeleteConfirmation";
import Loading from "@/components/Loader/Loading";
import AddTourTypeModal from "@/components/modules/admin/tourType/AddTourTypeModal";
import UpdateTourTypeModal from "@/components/modules/admin/tourType/UpdateTourTypeModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDeleteTourTypeMutation, useTourTypesQuery } from "@/redux/features/tour/tour.api";
import { formatDate } from "@/utils/formatDate";
import { Trash2 } from "lucide-react";

export default function AddTourType() {
  const { data, isLoading } = useTourTypesQuery(null);
  const [deleteTourType] = useDeleteTourTypeMutation();

  const handleDelete = async (id: string) => await deleteTourType({ id }).unwrap();

  if (isLoading) return <Loading />;

  return (
    <div className="w-full max-w-4xl mx-auto p-5">
      <div className="flex justify-between gap-2.5 flex-wrap mb-5">
        <h1 className="text-xl font-semibold">Tour Types</h1>
        <AddTourTypeModal />
      </div>
      <div className="border border-muted pt-4 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-2 md:pl-6">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map(({ _id, name, createdAt }, i) => (
              <TableRow key={_id}>
                <TableCell className="pl md:pl-6">{i + 1}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{formatDate(createdAt)}</TableCell>

                <TableCell className="text-center">
                  <UpdateTourTypeModal id={_id} name={name} />
                </TableCell>

                <TableCell className="text-center">
                  <DeleteConfirmation name={name} onConfirm={() => handleDelete(_id)}>
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
    </div>
  );
}
