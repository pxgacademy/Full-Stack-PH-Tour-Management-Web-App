//

import DeleteConfirmation from "@/components/DeleteConfirmation";
import Loading from "@/components/Loader/Loading";
import PaginationComponent from "@/components/PaginationComponent";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteTourMutation, useGetToursQuery } from "@/redux/features/tour/tour.api";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import DivisionViewer from "../../components/modules/viewer/DivisionViewer";
import TourTypeViewer from "../../components/modules/viewer/TourTypeViewer";

const limits = [5, 10, 20, 30, 40, 50, 100];

export default function AllTours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTour] = useDeleteTourMutation();
  const page = searchParams.get("page") || undefined;
  const limit = Number(searchParams.get("limit") || 10);

  const { data: tours, isLoading } = useGetToursQuery({ page, limit });

  const handleDelete = async (id: string) => await deleteTour({ id }).unwrap();

  const handleLimit = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", value);
    setSearchParams(params);
  };

  if (isLoading) return <Loading />;

  const totalPages = tours?.meta?.total_page;
  const currentPage = Number(tours?.meta?.present_page || 1);

  const serial = currentPage * limit - limit;

  return (
    <div className="">
      <h1 className="">This is AllTours component</h1>

      <div className="border border-muted pt-4 rounded-xl mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-2 md:pl-6">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-center">Guest</TableHead>
              <TableHead className="text-center">Min Age</TableHead>
              <TableHead className="text-center">Division</TableHead>
              <TableHead className="text-center">Tour Type</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours?.data.map((tour, i) => (
              <TableRow key={tour._id}>
                <TableCell className="pl md:pl-6">{i + 1 + serial}</TableCell>
                <TableCell>{tour.title}</TableCell>
                <TableCell> ৳ {tour.costFrom}</TableCell>
                <TableCell>{format(tour.startDate, "PP")}</TableCell>
                <TableCell>{format(tour.endDate, "PP")}</TableCell>
                <TableCell className="text-center">{tour.maxGuest}</TableCell>
                <TableCell className="text-center">{tour.minAge}</TableCell>

                <TableCell className="text-center">
                  <DivisionViewer id={tour.division as string} />
                </TableCell>
                <TableCell className="text-center">
                  <TourTypeViewer id={tour.tourType as string} />
                </TableCell>

                <TableCell className="text-center">
                  <Link to={`/admin/update-tour/${tour.slug}`}>
                    <Button variant="outline" size="xs" className="text-sm">
                      <Edit />
                    </Button>
                  </Link>
                </TableCell>

                <TableCell className="text-center">
                  <DeleteConfirmation name={tour.title} onConfirm={() => handleDelete(tour._id)}>
                    <Button variant="destructive" size="xs" className="text-sm">
                      <Trash2 />
                    </Button>
                  </DeleteConfirmation>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-end gap-4 border-t py-3">
          {totalPages! > 1 && (
            <div>
              <PaginationComponent totalPages={totalPages!} currentPage={currentPage!} />
            </div>
          )}
          <div className="flex gap-x-2.5 pr-4 md:pr-8">
            <label htmlFor="limit-click-all-tour">Limit</label>
            <select
              defaultValue={limit || 10}
              onChange={(e) => handleLimit(e.target.value)}
              className="focus:outline-none w-16 px-2 "
              id="limit-click-all-tour"
            >
              {limits.map((limit) => (
                <option value={limit} className="bg-background text-foreground">
                  {limit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
