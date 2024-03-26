import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (params: {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  template: string;
  vars: { [key: string]: string };
}) => {
  const templates = await import(`./templates/${params.template}.ts`);

  let txtMessage = templates.txtTemplate;
  let htmlMessage = templates.htmlTemplate;

  for (const [key, value] of Object.entries(params.vars)) {
    txtMessage = txtMessage.replaceAll(key, value);
    htmlMessage = htmlMessage.replaceAll(key, value);
  }

  return await transporter.sendMail({
    from: `"DriveXperience" <${process.env.SMTP_USER}>`,
    to: `"${params.recipientName}" <${params.recipientEmail}>`,
    subject: params.subject,
    text: txtMessage,
    html: htmlMessage,
  });
};
