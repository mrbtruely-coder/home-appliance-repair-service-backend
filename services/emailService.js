const nodemailer = require('nodemailer');

exports.sendBookingConfirmation = async (bookingData) => {
  const { bookingId, name, phone, area, service, address, issue, date, timeSlot } = bookingData;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser) {
    console.log(`[DEV MODE] Booking Email logged for ID ${bookingId}:`, {
      name,
      phone,
      area,
      service,
      helpline: '9515661677',
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f8fafd; padding: 24px; color: #0A2558;">
      <div style="background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; max-width: 580px; margin: 0 auto;">
        <h2 style="color: #0A2558; margin-top: 0;">Doorstep Service Booking Confirmation</h2>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Customer:</strong> ${name} (${phone})</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Location:</strong> ${area}, Hyderabad</p>
        <p><strong>Address:</strong> ${address || 'Provided via phone'}</p>
        <p><strong>Preferred Slot:</strong> ${date || 'Today'} (${timeSlot || 'Immediate 90 min'})</p>
        <p><strong>Reported Issue:</strong> ${issue || 'Standard inspection'}</p>
        <div style="margin-top: 20px; padding: 12px; background: #EFF6FF; border-radius: 8px; font-weight: bold;">
          Support Helpline: 9515661677
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Doorstep Service Hyderabad" <${smtpUser}>`,
    to: process.env.NOTIFICATION_EMAIL || smtpUser,
    subject: `New Repair Booking: ${service} in ${area} [${bookingId}]`,
    html: htmlContent,
  });
};
