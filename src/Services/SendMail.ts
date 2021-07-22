import nodemailer from 'nodemailer';
import { debtorProps, finalContentsUrlProps, contentProps } from '../@types/sendMail'

async function sendMail(debtor: debtorProps, finalContentsUrl: finalContentsUrlProps[], contents: contentProps[]) {

    const transporter = nodemailer.createTransport({
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'AKIA43CFTNDU3CLIPCVR',
          pass: 'BLyYjqlT1yDCkld9us7kqlzV0/4/mIOwmdajntt73Maa', 
        },
      })

      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "albuquerque.develop@gmail.com, gustavoramalho04@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>${JSON.stringify(debtor, null, 2)}</b>`, // html body
      });

      console.log("Message sent: %s", info.messageId);

      return info



}

export default sendMail