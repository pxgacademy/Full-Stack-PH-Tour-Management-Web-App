//

import DeleteConfirmation from "@/components/DeleteConfirmation";
import Loading from "@/components/Loader/Loading";
import AddDivisionForm from "@/components/modules/admin/division/AddDivisionForm";
import UpdateDivisionForm from "@/components/modules/admin/division/updateDivisionForm";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteDivisionMutation,
  useGetDivisionsQuery,
} from "@/redux/features/division/division.api";
import { formatDate } from "@/utils/formatDate";
import { Trash2 } from "lucide-react";

export default function AddDivision() {
  const { data, isLoading } = useGetDivisionsQuery(null);

  const [deleteDivision] = useDeleteDivisionMutation();

  const handleDelete = async (id: string) =>
    await deleteDivision({ id }).unwrap();

  if (isLoading) return <Loading />;

  console.log(data);

  return (
    <div className="w-full max-w-4xl mx-auto p-5">
      <div className="flex justify-between gap-2.5 flex-wrap mb-5">
        <h1 className="text-xl font-semibold">Divisions</h1>
        <AddDivisionForm />
      </div>
      <Table className="border border-muted">
        <TableHeader>
          <TableRow>
            <TableHead>Thumb</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Edit</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ _id, name, thumbnail, createdAt, description }) => (
            <TableRow key={_id}>
              <TableCell>
                <img
                  src={thumbnail}
                  alt={name}
                  className="w-14 h-8 object-cover rounded-sm"
                />
              </TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{formatDate(createdAt)}</TableCell>

              <TableCell className="text-center">
                <UpdateDivisionForm
                  name={name}
                  description={description}
                  thumbnail={thumbnail}
                  id={_id}
                />
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
