import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";
import { generatePdf, InvoiceData } from "./invoice";
import { sendEmail } from "./sendEmail";

export const sendBookingInvoice = async (
  email: string,
  data: InvoiceData
): Promise<Buffer> => {
  const pdfBuffer = await generatePdf(data);

  if (!pdfBuffer) {
    throw new AppError(
      sCode.EXPECTATION_FAILED,
      "Failed to generate PDF buffer"
    );
  }

  await sendEmail({
    to: email,
    subject: "Your booking invoice",
    templateName: "invoice",
    templateData: data,
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer ?? Buffer.from(""),
        contentType: "application/pdf",
      },
    ],
  });

  return pdfBuffer;
};
