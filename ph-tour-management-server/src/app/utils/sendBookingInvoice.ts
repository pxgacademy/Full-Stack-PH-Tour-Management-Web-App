import { generatePdf, InvoiceData } from "./invoice";
import { sendEmail } from "./sendEmail";

export const sendBookingInvoice = async (email: string, data: InvoiceData) => {
  const pdfBuffer = await generatePdf(data);

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
};
