import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export const sendTaskNotificationEmail = async (
  to: string,
  subject: string,
  taskTitle: string,
  action: string
): Promise<void> => {
  const mailOptions = {
    from: '"Task Engine" <no-reply@taskengine.com>',
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Task Update Notification</h2>
        <p>The task <strong>"${taskTitle}"</strong> has been <strong>${action}</strong>.</p>
        <p>Log in to your dashboard to see details.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};