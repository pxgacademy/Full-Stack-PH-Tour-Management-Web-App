import PaymentCancel from "@/pages/payment/Cancel";
import PaymentFail from "@/pages/payment/Fail";
import PaymentSuccess from "@/pages/payment/Success";

export const paymentRoutes = [
  {
    Component: PaymentSuccess,
    path: "success",
  },
  {
    Component: PaymentFail,
    path: "fail",
  },
  {
    Component: PaymentCancel,
    path: "cancel",
  },
];
