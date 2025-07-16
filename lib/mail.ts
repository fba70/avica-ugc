import { Resend } from "resend"
import { EmailTemplate } from "@/components/blocks/email-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (
  email: string,
  userName: string,
  message: string
) => {
  await resend.emails.send({
    from: `${email}`,
    to: "in4@in4comgroup.com",
    subject: "AVICA SPARKBIT message",
    react: EmailTemplate({ userName, email, message }),
  })
}
