/*

import Loading from "@/components/Loader/Loading";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import {
  useCreateTourMutation,
  useTourTypesQuery,
} from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const tourFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    departureLocation: z.string().min(1, "Departure location is required"),
    arrivalLocation: z.string().min(1, "Arrival location is required"),

    costFrom: z.coerce
      .number()
      .min(0, "Cost must be a positive number")
      .max(999999, "Cost too high"),

    startDate: z.coerce.date({
      error: () => ({ message: "Start date is required" }),
    }),
    endDate: z.coerce.date({
      error: () => ({ message: "End date is required" }),
    }),

    included: z
      .array(
        z.object({
          value: z.string().min(1, "Include item is required"),
        })
      )
      .min(1, "At least one included item required"),

    excluded: z
      .array(
        z.object({
          value: z.string().min(1, "Exclude item is required"),
        })
      )
      .min(1, "At least one excluded item required"),

    amenities: z
      .array(
        z.object({
          value: z.string().min(1, "Amenity is required"),
        })
      )
      .min(1, "At least one amenity required"),

    tourPlane: z
      .array(
        z.object({
          value: z.string().min(1, "Tour plan is required"),
        })
      )
      .min(1, "At least one tour plan required"),

    maxGuest: z.coerce
      .number()
      .min(1, "At least 1 guest required")
      .max(999, "Too many guests"),

    minAge: z.coerce
      .number()
      .min(1, "Minimum age must be at least 1")
      .max(100, "Invalid age"),

    division: z.string().min(1, "Division is required"),
    tourType: z.string().min(1, "Tour type is required"),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }
  });

type TourFormValues = z.infer<typeof tourFormSchema>;

const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

const AddTour = () => {
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

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      description: "",
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
  });

  const {
    fields: includedFields,
    append: includedAppend,
    remove: includedRemove,
  } = useFieldArray({
    control: form.control,
    name: "included",
  });

  const {
    fields: excludedFields,
    append: excludedAppend,
    remove: excludedRemove,
  } = useFieldArray({
    control: form.control,
    name: "excluded",
  });

  const {
    fields: amenitiesFields,
    append: amenitiesAppend,
    remove: amenitiesRemove,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: tourPlaneFields,
    append: tourPlaneAppend,
    remove: tourPlaneRemove,
  } = useFieldArray({
    control: form.control,
    name: "tourPlane",
  });

  const onSubmit = async (data: TourFormValues) => {
    if (images.length <= 0) return setErrMsg(true);
    setSubmitting(true);

    const formData = new FormData();

    formData.append("data", JSON.stringify(data));
    images.map((image) => formData.append("files", image));

    try {
      const result = await createTour(formData).unwrap();
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create tour");
    } finally {
      setSubmitting(false);
    }
  };

  if (divisionLoading || tourTypeLoading) return <Loading />;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          id="addTourForm"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter title here..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter description here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter location here..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter departure location here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arrivalLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter arrival location here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="costFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cons Per Person</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="Enter const here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={field.onChange}
                      onDayClick={() => setIsStartDateOpen(false)}
                      disabled={(date) => date < yesterday}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={field.onChange}
                      onDayClick={() => setIsEndDateOpen(false)}
                      disabled={(date) => date < yesterday}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Included</FormLabel>

            {includedFields.map((item, index) => (
              <FormField
                key={item.id}
                control={form.control}
                name={`included.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <span className="inline-flex items-center relative">
                        <Input {...field} />
                        <button
                          type="button"
                          onClick={() => includedRemove(index)}
                          className="absolute right-0 pr-1.5 text-sm text-muted-foreground hover:text-red-700 h-full"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="xs"
                type="button"
                onClick={() => includedAppend({ value: "" })}
              >
                <Plus /> Add More
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Excluded</FormLabel>

            {excludedFields.map((item, index) => (
              <FormField
                key={item.id}
                control={form.control}
                name={`excluded.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <span className="inline-flex items-center relative">
                        <Input {...field} />
                        <button
                          type="button"
                          onClick={() => excludedRemove(index)}
                          className="absolute right-0 pr-1.5 text-sm text-muted-foreground hover:text-red-700 h-full"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="xs"
                type="button"
                onClick={() => excludedAppend({ value: "" })}
              >
                <Plus /> Add More
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Amenities</FormLabel>

            {amenitiesFields.map((item, index) => (
              <FormField
                key={item.id}
                control={form.control}
                name={`amenities.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <span className="inline-flex items-center relative">
                        <Input {...field} />
                        <button
                          type="button"
                          onClick={() => amenitiesRemove(index)}
                          className="absolute right-0 pr-1.5 text-sm text-muted-foreground hover:text-red-700 h-full"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="xs"
                type="button"
                onClick={() => amenitiesAppend({ value: "" })}
              >
                <Plus /> Add More
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Tour Planes</FormLabel>

            {tourPlaneFields.map((item, index) => (
              <FormField
                key={item.id}
                control={form.control}
                name={`tourPlane.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <span className="inline-flex items-center relative">
                        <Input {...field} />
                        <button
                          type="button"
                          onClick={() => tourPlaneRemove(index)}
                          className="absolute right-0 pr-1.5 text-sm text-muted-foreground hover:text-red-700 h-full"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="xs"
                type="button"
                onClick={() => tourPlaneAppend({ value: "" })}
              >
                <Plus /> Add More
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="maxGuest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Guest</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a division" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {divisions?.map(({ _id, name }) => (
                      <SelectItem value={_id} key={_id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tourType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Type</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tour type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tourTypes?.map(({ _id, name }) => (
                      <SelectItem value={_id} key={_id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="mt-4">
        <Label className="mb-1.5">Select an Image</Label>
        <MultipleImageUploader onChange={setImages} />
        {errMsg && images.length <= 0 && (
          <span className="text-destructive text-sm">
            Minimum 1 image is required
          </span>
        )}
      </div>


      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={submitting} form="addTourForm">
          <LoadingSpinner
            isLoading={submitting}
            defaultText="Submit"
            loadingText="Submitting..."
          />
        </Button>
      </div>
    </div>
  );
};

export default AddTour;

*/
