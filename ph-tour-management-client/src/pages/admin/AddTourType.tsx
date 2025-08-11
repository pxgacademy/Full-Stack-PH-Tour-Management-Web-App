import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTourTypesQuery } from "@/redux/features/tour/tour.api";
import { formatDate } from "@/utils/formatDate";

export default function AddTourType() {
  const { data } = useTourTypesQuery(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-5">
      <Table className="border border-muted">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ _id, name, createdAt }) => (
            <TableRow key={_id}>
              <TableCell>{name}</TableCell>
              <TableCell>{formatDate(createdAt)}</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
