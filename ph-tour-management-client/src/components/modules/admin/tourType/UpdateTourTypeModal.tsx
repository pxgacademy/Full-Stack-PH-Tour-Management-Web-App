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
import { useUpdateTourTypeMutation } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface iProps {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Tour Type Name must be at least 2 characters!" })
    .max(50),
});

type FormValue = z.infer<typeof formSchema>;

export default function UpdateTourTypeModal({ id, name }: iProps) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateTourType] = useUpdateTourTypeMutation();

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
    },
  });

  const onSubmit = async (data: FormValue) => {
    setUpdating(true);
    try {
      const result = await updateTourType({ id, ...data }).unwrap();
      if (result.success) {
        toast.success("Tour Type updated successfully");
        form.reset();
        setOpen(false);
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update tour type");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs" className="text-sm">
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Update Tour Type</DialogTitle>
              <DialogDescription>
                Make changes to your tour type here. Click Save changes when
                you&apos;re done.
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
              <Button type="submit" size="sm" disabled={updating}>
                <LoadingSpinner
                  isLoading={updating}
                  defaultText="Save changes"
                  loadingText="Saving..."
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
