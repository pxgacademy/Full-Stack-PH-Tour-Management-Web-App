/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
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
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(320);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const email = state?.email;
  const dest = state?.dest;

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email || !isConfirmed) return;

    const timerId = setInterval(() => {
      if (timer > 0) setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [email, isConfirmed, timer]);

  const form = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sending OTP");
    try {
      const result = await sendOtp({ email }).unwrap();
      if (result.success) {
        setTimer(10);
        setIsConfirmed(true);
        toast.success("OTP has been sent", { id: toastId });
      } else toast.error(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || error.message, { id: toastId });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function onSubmit(data: FormInputs) {
    setIsSubmitting(true);
    const toastId = toast.loading("Verifying OTP");
    try {
      const result = await verifyOtp({ otp: data.otp, email }).unwrap();

      if (result.success) {
        toast.success(result.message, { id: toastId });
        navigate("/login", { replace: true, state: { dest } });
      } else toast.error(result.message);
    } catch (error) {
      toast.success("Failed to verify OTP, try again", { id: toastId });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!email) return null;

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

            <div className="mt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                onClick={handleSendOtp}
                disabled={timer > 0 || isSubmitting}
                className="p-0 disabled:text-muted-foreground"
              >
                Resend OTP
              </Button>
              <span>{timer}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              form="otp_form_r"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              <LoadingSpinner
                isLoading={isSubmitting}
                defaultText="Submit"
                loadingText="Submitting..."
              />
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
              onClick={handleSendOtp}
              disabled={isSubmitting}
            >
              <LoadingSpinner
                isLoading={isSubmitting}
                defaultText="Send"
                loadingText="Sending..."
              />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
