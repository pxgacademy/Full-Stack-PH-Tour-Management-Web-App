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

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddTour = () => {
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [descriptionContent, setDescriptionContent] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<boolean>(false);
  const [createTour] = useCreateTourMutation();

  const uploaderRef = useRef<MultipleImageUploaderRef>(null);

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

  const getValues = (items: { value: string }[]) => items.map((item) => item.value);

  const onSubmit = async (data: TourFormValues) => {
    if (!descriptionContent || descriptionContent === "<p></p>") {
      setDescriptionError(true);
      return;
    }

    if (images.length <= 0) {
      setErrMsg(true);
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
    };

    setSubmitting(true);

    const formData = new FormData();

    formData.append("data", JSON.stringify(finalData));
    images.forEach((image) => formData.append("files", image));

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
      setErrMsg(false);
      setDescriptionError(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-semibold text-primary text-center">Add Tour Form</h2>
      <p className="text-center text-muted-foreground mt-1 mb-7">
        Enter all valid values to create a Tour; the tour will then be made public.
      </p>
      <div className="w-full max-w-4xl mx-auto border p-5 rounded-2xl">
        <TourForm
          form={form}
          onSubmit={onSubmit}
          descriptionContent={descriptionContent}
          setDescriptionContent={setDescriptionContent}
          descriptionError={descriptionError}
        />

        <div className="mt-4">
          <Label className="mb-1.5">Select Images</Label>
          <MultipleImageUploader ref={uploaderRef} onChange={setImages} />
          {errMsg && images.length <= 0 && (
            <span className="text-destructive text-sm">Minimum 1 image is required</span>
          )}
        </div>

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

export default AddTour;
