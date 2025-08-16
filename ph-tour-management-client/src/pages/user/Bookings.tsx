import Loading from "@/components/Loader/Loading";
import { Button } from "@/components/ui/button";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { useGetSingleTourQuery } from "@/redux/features/tour/tour.api";

import type { iTourTypeResponse } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Booking() {
  const [guestCount, setGuestCount] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const { slug } = useParams();
  const [createBooking] = useCreateBookingMutation();
  const {
    data: tour,
    isLoading,
    isError,
  } = useGetSingleTourQuery({
    slug: slug as string,
  });

  useEffect(() => {
    if (!isLoading) {
      setTotalAmount(guestCount * tour!.costFrom);
    }
  }, [guestCount, totalAmount, isLoading, tour]);

  const incrementGuest = () => {
    setGuestCount((prv) => prv + 1);
  };

  const decrementGuest = () => {
    setGuestCount((prv) => prv - 1);
  };

  const handleBooking = async () => {
    let bookingData;

    if (tour && tour._id) bookingData = { tour: tour._id, guest: guestCount };

    if (!bookingData) return;

    try {
      const res = await createBooking(bookingData).unwrap();
      const pUrl = res?.meta?.options?.paymentURL;
      if (res.success && pUrl) window.open(pUrl);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <Loading />;

  const tourType = tour?.tourType as iTourTypeResponse;

  const guestButtonClass =
    "w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 cursor-pointer";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 container mx-auto">
      {!isLoading && !tour && (
        <div>
          <p>No Data Found</p>
        </div>
      )}

      {!isLoading && !isError && tour && (
        <>
          {/* Left Section - Tour Summary */}
          <div className="flex-1 space-y-6">
            <div>
              <img
                src={tour?.images[0]}
                alt={tour?.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{tour?.title}</h1>
              <p className="text-gray-600 mb-4">{tour?.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Location:</strong> {tour?.location}
                </div>
                <div>
                  <strong>Duration:</strong> {tour?.startDate} to{" "}
                  {tour?.endDate}
                </div>
                <div>
                  <strong>Tour Type:</strong> {tourType.name}
                </div>
                <div>
                  <strong>Max Guests:</strong> {tour?.maxGuest}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">What's Included</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {tour?.included.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Tour Plan</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {tour?.tourPlane.map((plan, index) => (
                  <li key={index}>{plan}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Section - Booking Details */}
          <div className="w-full md:w-96">
            <div className="border border-muted p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementGuest}
                      disabled={guestCount <= 1}
                      className={guestButtonClass}
                    >
                      <Minus size={16} />
                    </button>

                    <input
                      type="text"
                      value={guestCount}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setGuestCount(
                          value > tour.maxGuest ? tour.maxGuest : value
                        );
                      }}
                      className="text-lg font-medium w-8 text-center focus:border-none focus:outline-none"
                    />
                    <button
                      onClick={incrementGuest}
                      disabled={guestCount >= tour!.maxGuest}
                      className={guestButtonClass}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Price per person:</span>
                    <span>${tour?.costFrom}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Guests:</span>
                    <span>{guestCount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full" size="lg">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
