import Loading from "@/components/Loader/Loading";
import { Button } from "@/components/ui/button";
import { useGetSingleTourQuery } from "@/redux/features/tour/tour.api";
import type { iDivisionResponse, iTourTypeResponse } from "@/types";
import { format } from "date-fns";
import { Link, useParams } from "react-router";

export default function TourDetails() {
  const { slug } = useParams();

  const {
    data: tour,
    isLoading,
    isError,
  } = useGetSingleTourQuery({
    slug: slug as string,
  });

  if (isLoading) return <Loading />;

  if (isError) return <div className="text-center mt-5">Tour not found...</div>;

  const division = tour?.division as iDivisionResponse;
  const tourType = tour?.tourType as iTourTypeResponse;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center  mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{tour?.title}</h1>
          <div className="flex gap-4 text-gray-600 mb-4">
            <span>📍 {tour?.location}</span>
            <span>💰 From ${tour?.costFrom}</span>
            <span>👥 Max {tour?.maxGuest} guests</span>
          </div>
        </div>
        <div>
          <Button asChild>
            <Link to={`/bookings/${tour?.slug}`}>Book Now</Link>
          </Button>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tour?.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${tour?.title} ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Tour Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Tour Details</h2>
          <div className="space-y-2">
            <p>
              <strong>Dates:</strong> {format(new Date(tour?.startDate ? tour?.startDate : new Date()), "PP")} -{" "}
              {format(new Date(tour?.endDate ? tour?.endDate : new Date()), "PP")}
            </p>
            <p>
              <strong>Departure:</strong> {tour?.departureLocation}
            </p>
            <p>
              <strong>Arrival:</strong> {tour?.arrivalLocation}
            </p>
            <p>
              <strong>Division:</strong> {division?.name}
            </p>
            <p>
              <strong>Tour Type:</strong> {tourType?.name}
            </p>
            <p>
              <strong>Min Age:</strong> {tour?.minAge} years
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground">{tour?.description}</p>
        </div>
      </div>

      {/* Amenities & Inclusions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b pt-4 pb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <ul className="space-y-1">
            {tour?.amenities?.map((amenity, index) => (
              <li key={index} className="flex items-center border border-muted/60 rounded p-1">
                <span className="text-green-500 mr-2">✓</span>
                {amenity}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Included</h3>
          <ul className="space-y-1">
            {tour?.included?.map((item, index) => (
              <li key={index} className="flex items-center border border-muted/60 rounded p-1">
                <span className="text-green-500 mr-2">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Excluded</h3>
          <ul className="space-y-1">
            {tour?.excluded?.map((item, index) => (
              <li key={index} className="flex items-center border border-muted/60 rounded p-1">
                <span className="text-red-500 mr-2">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tour Plan */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Tour Plan</h3>
        <ol className="space-y-3">
          {tour?.tourPlane?.map((plan, index) => (
            <li key={index} className="flex items-center border rounded-xl md:rounded-full p-1.5">
              <span className="grow w-full max-w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">
                {index + 1}
              </span>
              {plan}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
