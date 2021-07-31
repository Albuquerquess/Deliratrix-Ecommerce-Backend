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
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWD, 
        },
      })

      const info = await transporter.sendMail({
        from: 'servicos@albuquerquedev.com.br', // sender address
        to: debtorMail, // list of receivers
        subject: "Hello ✔", // Subject line
        html:  `<div class="wrapper">
        <header>
          <h1>Olá, ${debtorName}. - deliratrix.com.br</h1>
          <h3>Email automático </h3>
        </header>
    
       <main>
         <span>Dados do comprador</span>
         <ul>
           <li>Nome: Gustavo de Albuquerque Ramalho</li>
           <li>Número: ${debtorPhone}</li>
           <li>Email: ${debtorMail}</li>
         </ul>
         <span>Link com os conteúdos</span>
         <ul>
           ${finalContentsUrl.map(finalContentUrl => `<li>Titulo 03: <a href="${finalContentUrl.url}">Acessar conteúdo</a> ID: ${finalContentUrl.create_id}</li>`)}
         </ul>
       </main>
      </div>`, // html body
      });

      return info



}

export default sendMail