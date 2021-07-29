import nodemailer from 'nodemailer';
import { createFalse } from 'typescript';
import { debtorProps, finalContentsUrlProps, contentProps } from '../@types/sendMail'

async function sendMail(debtor: debtorProps, finalContentsUrl: finalContentsUrlProps[], contents: contentProps[]) {
  
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWD,
        },
      })

      const info = await transporter.sendMail({
        from: process.env.SMTP_USER, // sender address
        to: process.env.SMTP_USER, // list of receivers
        subject: "Hello ✔", // Subject line
        html: `<b>oi</b>`, // html body
      });

      console.log("Message sent: %s", info.messageId);

      return info



}

export default sendMail