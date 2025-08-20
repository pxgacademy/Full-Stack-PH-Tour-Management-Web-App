import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import {
  useCreateTourMutation,
  useTourTypesQuery,
} from "@/redux/features/tour/tour.api";
import { useState } from "react";

export function TourOptions() {
  const { data: divisions, isLoading: divisionLoading } =
    useGetDivisionsQuery(null);
  const { data: tourTypes, isLoading: tourTypeLoading } =
    useTourTypesQuery(null);

  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<boolean>(false);
  const [createTour] = useCreateTourMutation();

  return {
    isLoading: divisionLoading || tourTypeLoading || false,
    divisions,
    tourTypes,
    createTour,
    images,
    setImages,
    isStartDateOpen,
    setIsStartDateOpen,
    isEndDateOpen,
    setIsEndDateOpen,
    submitting,
    setSubmitting,
    errMsg,
    setErrMsg,
  };
}
