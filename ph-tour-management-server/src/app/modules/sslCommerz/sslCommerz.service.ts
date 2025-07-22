import { env_config } from "../../../config";
import { iSSLCommerz } from "./sslCommerz.interface";

const SSL = env_config.SSL;

export const sslPaymentInit = (payload: iSSLCommerz) => {
  const data = {
    store_id: SSL.SSL_STORE_ID,
    store_passwd: SSL.SSL_STORE_PASS,
    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.TrxID,
    success_url: SSL.SSL_SUCCESS_SERVER_URL,
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
};
