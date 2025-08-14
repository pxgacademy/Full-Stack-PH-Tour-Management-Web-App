import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import SheetWrapper from "@/components/SheetWrapper";
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateDivisionMutation } from "@/redux/features/division/division.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Division name must be at least 2 characters!" })
    .max(50),
  description: z
    .string()
    .min(5, { message: "Description must be at least 2 characters!" })
    .max(300, { message: "Description must be in between 300 characters!" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddDivisionForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<boolean>(false);
  const [createDivision] = useCreateDivisionMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!image) return setErrMsg(true);
    setSubmitting(true);

    const formData = new FormData();

    formData.append("data", JSON.stringify(data));
    formData.append("file", image);

    try {
      const result = await createDivision(formData).unwrap();
      if (result.success) {
        toast.success(result.message);
        form.reset();
        setOpen(false);
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create tour type");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetWrapper
      buttonText="Create Division"
      title="Create a Division"
      setOpen={setOpen}
      open={open}
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="addDivisionForm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name here..." />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a small description here..."
                      className="min-h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="mt-4">
          <Label className="mb-1.5">Select an Image</Label>
          <SingleImageUploader onChange={setImage} />
          {errMsg && !image && (
            <span className="text-destructive text-sm">Image is required</span>
          )}
        </div>

        {/* submit button */}
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={submitting} form="addDivisionForm">
            <LoadingSpinner
              isLoading={submitting}
              defaultText="Submit"
              loadingText="Submitting..."
            />
          </Button>
        </div>
      </div>
    </SheetWrapper>
  );
};
export default AddDivisionForm;
