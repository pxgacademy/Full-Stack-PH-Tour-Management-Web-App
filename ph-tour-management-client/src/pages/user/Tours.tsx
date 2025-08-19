import Loading from "@/components/Loader/Loading";
import TourFilters from "@/components/modules/tours/TourFilters";
import PaginationComponent from "@/components/PaginationComponent";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { useGetToursQuery } from "@/redux/features/tour/tour.api";
import { htmlToPlainText } from "@/utils/htmlToPlainText";
import { Link, useSearchParams } from "react-router";

export default function Tours() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const division = searchParams.get("division") || undefined;
  const tourType = searchParams.get("tourType") || undefined;
  const sort = searchParams.get("sort") || undefined;
  // const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;

  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1; // default 1

  console.log(page);

  const { data, isLoading } = useGetToursQuery(
    { search, division, tourType, sort, page, limit },
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading) return <Loading />;

  const tours = data?.data;
  const totalPages = data?.meta?.total_page;
  const currentPage = data?.meta?.present_page;

  return (
    <div className="container mx-auto px-5 py-8 grid grid-cols-12 gap-5">
      <TourFilters />

      <div className="col-span-12 lg:col-span-9 w-full">
        {tours?.map((item) => (
          <div
            key={item.slug}
            className="border border-muted rounded-lg shadow-md overflow-hidden mb-6 flex flex-col md:flex-row"
          >
            <div className="w-full md:w-2/5 max-h-52 md:max-h-max flex-shrink-0 overflow-hidden">
              <img
                src={item.images?.[0]}
                alt={item.title}
                className="object-cover w-full h-full "
              />
            </div>
            <div className="p-6 flex-1">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <ShareButton variant="ghost" url={`http://localhost:3000/tours/${item.slug}`} />
              </div>

              <p className="text-muted-foreground mb-3 line-clamp-3">
                {htmlToPlainText(item.description)}
              </p>

              {/* <div className="text-muted-foreground mb-3 line-clamp-2">
                {DOMPurify.sanitize(item.description, {
                  ALLOWED_TAGS: [],
                })}
              </div> */}

              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-primary">
                  From ৳{item.costFrom.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Max {item.maxGuest} guests</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium">From:</span> {item.departureLocation}
                </div>
                <div>
                  <span className="font-medium">To:</span> {item.arrivalLocation}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {item.tourPlane.length} days
                </div>
                <div>
                  <span className="font-medium">Min Age:</span> {item.minAge}+
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted/50 text-primary text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {item.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                    +{item.amenities.length - 3} more
                  </span>
                )}
              </div>

              <Button asChild className="w-full">
                <Link to={`/tours/${item.slug}`}>View Details</Link>
              </Button>
            </div>
          </div>
        ))}

        <div>
          <PaginationComponent totalPages={totalPages!} currentPage={currentPage!} />
        </div>
      </div>
    </div>
  );
}
