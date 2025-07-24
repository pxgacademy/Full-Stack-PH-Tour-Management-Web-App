/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { env_config } from "../../../config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { iSSLCommerz } from "./sslCommerz.interface";

const SSL = env_config.SSL;

export const sslPaymentInit = async (payload: iSSLCommerz) => {
  const urlWithTrxID = (link: string, status = "success") =>
    `${link}?TrxID=${payload.TrxID}&amount=${payload.amount}&status=${status}`;

  const data = {
    store_id: SSL.STORE_ID,
    store_passwd: SSL.STORE_PASS,
    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.TrxID,
    success_url: urlWithTrxID(SSL.SUCCESS_SERVER_URL),
    fail_url: urlWithTrxID(SSL.FAIL_SERVER_URL, "fail"),
    cancel_url: urlWithTrxID(SSL.CANCEL_SERVER_URL, "cancel"),
    shipping_method: "N/A",
    product_name: "Tour",
    product_category: "Service",
    product_profile: "general",
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "Bangladesh",
    cus_phone: payload.phone,
    cus_fax: payload.phone,
    ship_name: "N/A", // Customer Name
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "N/A",
  };

  //
  try {
    const response = await axios({
      method: "POST",
      url: SSL.PAYMENT_API,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("Payment error accrued: ", error);
    throw new AppError(sCode.BAD_REQUEST, error?.message);
  }
};

// ipn_url: "http://localhost:3030/ipn",
