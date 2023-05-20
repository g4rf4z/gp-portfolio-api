import config from 'config';
import nodemailer from 'nodemailer';

const nodemailerService = config.get<string>('nodemailerService');
const nodemailerEmail = config.get<string>('nodemailerEmail');
const nodemailerPassword = config.get<string>('nodemailerPassword');

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (data: EmailData) => {
  const transporter = nodemailer.createTransport({
    service: nodemailerService,
    auth: {
      user: nodemailerEmail,
      pass: nodemailerPassword,
    },
  });

  const emailOptions = {
    from: nodemailerEmail,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error(error);
  }
};
