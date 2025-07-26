/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { env_config } from "../../config";
import { AppError } from "../../errors/AppError";
import logger from "./logger";

interface SendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

const SMTP = env_config.NODEMAILER;

const transporter = nodemailer.createTransport({
  host: SMTP.SMTP_HOST,
  port: SMTP.SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP.SMTP_USER,
    pass: SMTP.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  attachments,
  templateName,
  templateData,
}: SendEmail): Promise<void> => {
  try {
    const templatePath = path.resolve(
      __dirname,
      `templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: SMTP.SMTP_FROM,
      to,
      subject,
      html,
      attachments,
    });
    logger.info("Email sent successfully", { messageId: info.messageId });
  } catch (error) {
    logger.error("Email sending error", {
      error: error instanceof Error ? error.message : error,
    });

    throw new AppError(401, "Email sending failed");
  }
};
