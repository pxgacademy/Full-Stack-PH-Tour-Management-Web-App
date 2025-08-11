import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateTourTypeMutation } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Tour Type Name must be at least 2 characters!" })
    .max(50),
});

type FormValue = z.infer<typeof formSchema>;

const AddTourTypeFrom = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [addTourType] = useCreateTourTypeMutation();

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormValue) => {
    setSubmitting(true);
    try {
      const result = await addTourType(data).unwrap();
      if (result.success) {
        toast.success("Tour Type created successfully");
        form.reset();
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create tour type");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Create a Tour Type</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Type Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name here..." />
                    </FormControl>
                    <FormDescription>
                      This is your public tour type name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={submitting}>
                  <LoadingSpinner
                    isLoading={submitting}
                    defaultText="Submit"
                    loadingText="Submitting..."
                  />
                </Button>
              </div>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};
export default AddTourTypeFrom;
