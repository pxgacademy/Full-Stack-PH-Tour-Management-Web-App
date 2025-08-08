"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSendOtpMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type FormInputs = z.infer<typeof FormSchema>;

//

export default function Verify() {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { state: email } = useLocation();
  const [sendOtp] = useSendOtpMutation();

  /* 
  TODO: uncomment it
  const navigate = useNavigate();
  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null;
  */

  const form = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleConfirmed = async () => {
    try {
      const result = await sendOtp({ email }).unwrap();
      if (result.success) {
        setIsConfirmed(true);
        toast.success("OTP has been sent");
      } else toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  function onSubmit(data: FormInputs) {
    console.log({ data });
  }

  return (
    <div className="grid place-content-center min-h-screen">
      {isConfirmed ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Verify Your Email Address</CardTitle>
            <CardDescription>
              Please enter the 6 digits code we sent to <br /> {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                id="otp_form_r"
                className="w-[258px] space-y-6"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="mt-3">
                        Please enter the one-time password sent to your phone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-end">
            <Button form="otp_form_r" type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-[258px]">
          <CardHeader>
            <CardTitle className="text-xl">Send OTP</CardTitle>
            <CardDescription>
              An OTP will be sent to your email: <br /> {email}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button
              form="otp_form_r"
              type="button"
              className="w-full"
              onClick={handleConfirmed}
            >
              Send
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
