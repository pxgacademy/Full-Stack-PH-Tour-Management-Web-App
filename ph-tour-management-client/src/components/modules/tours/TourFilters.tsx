import PaginationComponent from "@/components/PaginationComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useTourTypesQuery } from "@/redux/features/tour/tour.api";
import { Search } from "lucide-react";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

/*
search = "",
    sort = "-createdAt",
    fields,
    page = "1",
    limit = "12",
    ...filters
*/

export interface iProps {
  totalPages: number;
  currentPage: number;
}

export default function TourFilters({ totalPages, currentPage }: iProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [sortType, setSortType] = useState<string>("ascending");
  const [sortItem, setSortItem] = useState<string>("");

  const selectedDivision = searchParams.get("division") || undefined;
  const selectedTourType = searchParams.get("tourType") || undefined;

  const { data: divisionData, isLoading: divisionIsLoading } = useGetDivisionsQuery(null);
  const { data: tourTypeData, isLoading: tourTypeIsLoading } = useTourTypesQuery(null);
  // useTourTypesQuery({ limit: 1000, fields: "_id,name" });

  const divisionOption = divisionData?.map((item: { _id: string; name: string }) => ({
    label: item.name,
    value: item._id,
  }));

  const tourTypeOptions = tourTypeData?.map((item: { _id: string; name: string }) => ({
    label: item.name,
    value: item._id,
  }));

  useEffect(() => {
    if (sortItem) handleSortItemChange(sortItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, sortItem]);

  // HANDLE DIVISION CHANGE
  const handleSearchChange = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
      setSearchParams(params);
    } else {
      params.delete("search");
      setSearchParams(params);
    }
  };

  // HANDLE DIVISION CHANGE
  const handleDivisionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("division", value);
    setSearchParams(params);
  };

  // HANDLE TOUR TYPE CHANGE
  const handleTourTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tourType", value);
    setSearchParams(params);
  };

  // HANDLE SORTING CHANGE
  const handleSortItemChange = (value: string) => {
    const sortValue = sortType === "ascending" ? value : `-${value}`;
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    setSearchParams(params);
  };

  // CLEAR ALL FILTERS
  const handleClearFilter = () => {
    setSearch("");
    setSortItem("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("division");
    params.delete("tourType");
    params.delete("sort");
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="col-span-12 lg:col-span-3 w-full relative">
      <div className="min-h-80 flex flex-col gap-y-4 border border-muted rounded-md p-5 mb-5 sticky top-0">
        <div className="flex justify-between items-center">
          <h1>Filters</h1>
          <Button size="sm" variant="outline" onClick={handleClearFilter}>
            Clear Filter
          </Button>
        </div>

        <div>
          <Label className="mb-2">Type to search</Label>
          <div className="flex relative">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              onBlur={handleSearchChange}
              placeholder="type here..."
            />
            <button
              type="button"
              className="absolute right-0 h-full inline-flex items-center  pr-2 cursor-pointer"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        <div>
          <Label className="mb-2">Division to visit</Label>
          <Select
            onValueChange={handleDivisionChange}
            value={selectedDivision ? selectedDivision : ""}
            disabled={divisionIsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Divisions</SelectLabel>
                {divisionOption?.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Tour Type to visit</Label>
          <Select
            onValueChange={handleTourTypeChange}
            value={selectedTourType ? selectedTourType : ""}
            disabled={tourTypeIsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Tour-Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tour Types</SelectLabel>
                {tourTypeOptions?.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 mb-5">
          <Label className="mb-2">Select to sort</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select onValueChange={setSortItem} value={sortItem}>
              <SelectTrigger className="w-full col-span-2">
                <SelectValue placeholder="Select a sort item" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sorting Items</SelectLabel>
                  <SelectItem value="costFrom">Tour Cost</SelectItem>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="endDate">End Date</SelectItem>
                  <SelectItem value="maxGuest">Maximum Guests</SelectItem>
                  <SelectItem value="minAge">Minimum Age</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={setSortType} value={sortType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sorting Types</SelectLabel>
                  <SelectItem value="ascending">Ascending</SelectItem>
                  <SelectItem value="descending">Descending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <PaginationComponent totalPages={totalPages!} currentPage={currentPage!} />
      </div>
    </div>
  );
}

/*



*/
