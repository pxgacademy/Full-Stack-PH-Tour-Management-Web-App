import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateTourTypeMutation } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(5, { message: "Tour Type Name must be at least 2 characters!" }).max(50),
});

type FormValue = z.infer<typeof formSchema>;

export default function AddTourTypeModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [addTourType] = useCreateTourTypeMutation();

  const onSubmit = async (data: FormValue) => {
    setIsSubmitting(true);
    try {
      const result = await addTourType(data).unwrap();
      if (result.success) {
        toast.success("Tour Type created successfully");
        form.reset();
        setOpen(false);
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create tour type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Tour Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Create a Tour Type</DialogTitle>
              <DialogDescription>
                Add your tour type here. <br /> Click Create Tour Type when you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Type Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                <LoadingSpinner
                  isLoading={isSubmitting}
                  defaultText="Create Tour Type"
                  loadingText="Creating..."
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
