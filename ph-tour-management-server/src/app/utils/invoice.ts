import PDFDocument from "pdfkit";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";
import logger from "./logger";

export interface InvoiceData {
  name: string;
  email: string;
  bookingId: string;
  tourTitle: string;
  bookingDate: string;
  paymentId: string;
  TrxId: string;
  amountPerGuest: number;
  totalGuests: number;
  amount: number;
  paymentMethod: string;
}

export const generatePdf = async (
  data: InvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (error) => reject(error));

      // PDF CONTENT

      // HEADER
      doc
        .fontSize(20)
        .text('"Invoice of Tour Booking"', { align: "center" })
        .moveDown();

      // BOOKING INFO
      doc.fontSize(12).text(`Customer Name: ${data.name}`);
      doc.text(`Email: ${data.email}`);
      doc.text(`Booking ID: ${data.bookingId}`);
      doc.text(`Tour Title: ${data.tourTitle}`);
      doc.text(`Booking Date: ${data.bookingDate}`).moveDown();

      // PAYMENT INFO
      doc.text(`Payment ID: ${data.paymentId}`);
      doc.text(`Amount Per Guest: ${data.amountPerGuest}`);
      doc.text(`Total Guests: ${data.totalGuests}`);
      doc.text(`Amount Paid: $${data.amount}`);
      doc.text(`TrxID: ${data.TrxId}`);
      doc.text(`Payment Method: ${data.paymentMethod}`).moveDown();

      // FOOTER
      doc
        .text("Thank you for booking with PH Tour!", { align: "center" })
        .moveDown()
        .text("We hope you have a great experience.", { align: "center" });

      // FINALIZE
      doc.end();
    });
  } catch (error) {
    logger.error("PDF creation error", {
      error: error instanceof Error ? error.message : error,
    });
    throw new AppError(sCode.BAD_REQUEST, "PDF creation error");
  }
};
