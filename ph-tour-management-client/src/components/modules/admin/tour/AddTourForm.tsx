import Loading from "@/components/Loader/Loading";
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
import { useTourTypesQuery } from "@/redux/features/tour/tour.api";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useState } from "react";
import {
  useFieldArray,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import type { TourFormValues } from "./tourValidation";

const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

interface AddTourFormProps {
  form: UseFormReturn<TourFormValues>;
  onSubmit: SubmitHandler<TourFormValues>;
}

// Add Tour Form

const AddTourForm = ({ form, onSubmit }: AddTourFormProps) => {
  const { data: divisions, isLoading: divisionLoading } =
    useGetDivisionsQuery(null);
  const { data: tourTypes, isLoading: tourTypeLoading } =
    useTourTypesQuery(null);

  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

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

  if (divisionLoading || tourTypeLoading) return <Loading />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
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
                  className="min-h-40 max-h-96"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                      selected={field.value}
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
                      selected={field.value}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="maxGuest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Guest</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
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
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                <FormLabel>Cost Per Person</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Enter cost here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <div className="space-y-2 border p-2 rounded-lg">
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
                          <Input {...field} placeholder="Enter included item" />
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
                  variant="ghost"
                  size="xs"
                  type="button"
                  onClick={() => includedAppend({ value: "" })}
                >
                  <Plus /> Add More
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-2 border p-2 rounded-lg">
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
                          <Input {...field} placeholder="Enter excluded item" />
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
                  variant="ghost"
                  size="xs"
                  type="button"
                  onClick={() => excludedAppend({ value: "" })}
                >
                  <Plus /> Add More
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-2 border p-2 rounded-lg">
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
                          <Input {...field} placeholder="Enter amenity" />
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
                  variant="ghost"
                  size="xs"
                  type="button"
                  onClick={() => amenitiesAppend({ value: "" })}
                >
                  <Plus /> Add More
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-2 border p-2 rounded-lg">
              <FormLabel>Tour Plan</FormLabel>

              {tourPlaneFields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`tourPlane.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <span className="inline-flex items-center relative">
                          <Input
                            {...field}
                            placeholder="Enter tour plan item"
                          />
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
                  variant="ghost"
                  size="xs"
                  type="button"
                  onClick={() => tourPlaneAppend({ value: "" })}
                >
                  <Plus /> Add More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddTourForm;
