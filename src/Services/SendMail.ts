import nodemailer from 'nodemailer';
//types
import { debtorProps, finalContentsUrlProps, contentProps } from '../@types/sendMail'


async function sendMail(debtor: debtorProps, finalContentsUrl: finalContentsUrlProps[], contents: contentProps[]) {
  const debtorMail = debtor[0].email
  const debtorPhone = debtor[0].phone
  const debtorName = debtor[0].name


    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWD, 
        },
      })

      const info = await transporter.sendMail({
        from: 'servicos@albuquerquedev.com.br', // sender address
        to: `${debtorMail} albuquerque.develop@gmail.com`, // list of receivers
        subject: "Deliratrix - Envio de conteúdos", // Subject line
        html:  `<div class="wrapper">
        <header>
          <h1>Olá, ${debtorName}. - deliratrix.com.br</h1>
          <h3>Email automático </h3>
        </header>
    
       <main>
         <span><strong>Dados do comprador</strong></span>
         <ul>
           <li>Nome: ${debtorName}</li>
           <li>Número: ${debtorPhone}</li>
           <li>Email: ${debtorMail}</li>
         </ul>
         <span><strong>Link com os conteúdos</strong></span>
         <ul>
           ${finalContentsUrl.map(finalContentUrl => `<a href="${finalContentUrl.url}">Acessar conteúdo</a> ID: ${finalContentUrl.create_id}</li>`)}
         </ul>
       </main>
      </div>`, // html body
      });

      return info



}

export default sendMail