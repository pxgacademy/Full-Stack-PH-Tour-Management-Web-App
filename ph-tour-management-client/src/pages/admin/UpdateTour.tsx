// src/pages/admin/AddTour.tsx
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import TourForm from "@/components/modules/admin/tour/TourForm";
import {
  tourFormSchema,
  type TourFormValues,
} from "@/components/modules/admin/tour/tourValidation";
import MultipleImageUploader, {
  type MultipleImageUploaderRef,
} from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateTourMutation } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";

import Loading from "@/components/Loader/Loading";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useGetSingleTourQuery } from "@/redux/features/tour/tour.api";
import type { iDivisionResponse, iTourResponse, iTourTypeResponse } from "@/types";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";

interface Tour extends iTourResponse {
  division: iDivisionResponse;
  tourType: iTourTypeResponse;
}

const UpdateTour = () => {
  const slug = useParams().slug || "";
  const { data, isLoading, isError } = useGetSingleTourQuery({ slug });
  const tour = data as Tour;

  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [descriptionContent, setDescriptionContent] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [createTour] = useCreateTourMutation();

  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const uploaderRef = useRef<MultipleImageUploaderRef>(null);

  const getValues = (items: { value: string }[]) => items.map((item) => item.value);

  useEffect(() => {
    if (data?.images) setDefaultImages(data.images);
    if (data) setDescriptionContent(data.description);
  }, [data]);

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      location: "",
      departureLocation: "",
      arrivalLocation: "",
      costFrom: 0,
      startDate: new Date(),
      endDate: new Date(),
      included: [{ value: "" }],
      excluded: [{ value: "" }],
      amenities: [{ value: "" }],
      tourPlane: [{ value: "" }],
      maxGuest: 1,
      minAge: 8,
      division: "",
      tourType: "",
    },
    mode: "onBlur",
  });

  const setValue = form.setValue;

  useEffect(() => {
    if (tour) {
      setValue("title", tour.title);
      setValue("location", tour.location);
      setValue("departureLocation", tour?.departureLocation || "");
      setValue("arrivalLocation", tour?.arrivalLocation || "");
      setValue("costFrom", tour.costFrom);

      // Date ফিল্ড
      setValue("startDate", new Date(tour.startDate));
      setValue("endDate", new Date(tour.endDate));

      // Array of strings → array of objects
      setValue(
        "included",
        tour.included.map((value) => ({ value }))
      );
      setValue(
        "excluded",
        tour.excluded.map((value) => ({ value }))
      );
      setValue(
        "amenities",
        tour.amenities.map((value) => ({ value }))
      );
      setValue(
        "tourPlane",
        tour.tourPlane.map((value) => ({ value }))
      );

      setValue("maxGuest", tour.maxGuest);
      setValue("minAge", tour.minAge);
      setValue("division", tour.division._id);
      setValue("tourType", tour.tourType._id);
    }
  }, [tour, setValue]);

  const onSubmit = async (data: TourFormValues) => {
    if (!descriptionContent || descriptionContent === "<p></p>") {
      setDescriptionError(true);
      return;
    }

    if ([...images, ...defaultImages].length > 6) {
      toast.error("Selected more than 6 images, only 6 images are allowed");
      return;
    }

    const startDate = formatISO(data.startDate);
    const endDate = formatISO(data.endDate);
    const included = getValues(data.included);
    const excluded = getValues(data.excluded);
    const amenities = getValues(data.amenities);
    const tourPlane = getValues(data.tourPlane);

    const finalData = {
      ...data,
      description: descriptionContent,
      startDate,
      endDate,
      included,
      excluded,
      amenities,
      tourPlane,
      deletedImages: [...selectedImages],
    };

    setSubmitting(true);

    const formData = new FormData();

    formData.append("data", JSON.stringify(finalData));
    if (images.length > 0) images.forEach((image) => formData.append("files", image));

    try {
      const result = await createTour(formData).unwrap();
      if (result.success) {
        toast.success(result.message);
        uploaderRef.current?.clearAll();
        form.reset();
        setImages([]);
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create tour");
    } finally {
      setDescriptionError(false);
      setSubmitting(false);
    }
  };

  const handleSelectImage = (link: string) => {
    if (selectedImages.some((image) => image === link)) {
      const filteredImages = selectedImages.filter((image) => image !== link);
      setSelectedImages(filteredImages);
    } else {
      setSelectedImages((prev) => [link, ...prev]);
    }
  };

  const handleRemoveImageView = (value?: string) => {
    if (value === "all") {
      setSelectedImages((prev) => [...defaultImages, ...prev]);
      setDefaultImages([]);
    } else {
      const filteredImages = defaultImages.filter(
        (image) => !selectedImages.some((link) => link === image)
      );
      setDefaultImages([...filteredImages]);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Something went wrong</div>;

  return (
    <div>
      <h2 className="text-4xl font-semibold text-primary text-center">Update Tour Form</h2>
      <p className="text-center text-muted-foreground mt-1 mb-7">
        Enter all valid values to update the Tour; the tour will then be made public again.
      </p>
      <div className="w-full max-w-6xl mx-auto ">
        <TourForm
          form={form}
          onSubmit={onSubmit}
          descriptionContent={descriptionContent}
          setDescriptionContent={setDescriptionContent}
          descriptionError={descriptionError}
        />

        {defaultImages.length < 6 && (
          <div className="mt-4">
            <Label className="mb-1.5">Add New Images</Label>
            <MultipleImageUploader
              ref={uploaderRef}
              onChange={setImages}
              defaultFiles={defaultImages.length}
            />
          </div>
        )}

        {defaultImages.length > 0 && (
          <>
            <Label className="mb-1.5 mt-6">Update Old Images</Label>
            <div className="border border-input rounded-xl overflow-hidden p-3">
              <div className="pb-3 flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImageView()}
                  disabled={defaultImages.length === 0 || selectedImages.length === 0}
                >
                  <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                  Remove selected images
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImageView("all")}
                  disabled={defaultImages.length === 0}
                >
                  <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                  Remove all
                </Button>
              </div>
              <div className="rounded-md overflow-hidden grid grid-cols-3 gap-2">
                {defaultImages.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectImage(image)}
                    className="w-full h-full cursor-pointer relative"
                  >
                    <img
                      src={image}
                      alt="img"
                      className={cn("w-full h-full object-cover", {
                        "opacity-40": selectedImages.some((link) => image === link),
                      })}
                    />
                    <span className="inline-flex items-center justify-center rounded-md p-1.5 absolute top-2 right-2 bg-background/60">
                      <Checkbox
                        id={image}
                        checked={selectedImages.some((link) => image === link)}
                        className="cursor-pointer"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={submitting}
            form="addTourForm"
            className="mt-6 w-full max-w-md"
          >
            <LoadingSpinner
              isLoading={submitting}
              defaultText="Submit"
              loadingText="Submitting..."
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTour;
