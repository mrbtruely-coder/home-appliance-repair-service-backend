const nodemailer = require('nodemailer');

exports.sendBookingConfirmation = async (bookingData) => {
  const { bookingId, name, phone, email, area, service, subcategory, price, address, issue, date, timeSlot } = bookingData;
  const cleanPhone = String(phone || '').replace(/\D/g, '');

  const smtpHost = process.env.SMTP_HOST || 'mail.goexpertsapps.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER || 'bookings@doorstephub.com';
  const smtpPass = process.env.SMTP_PASS || 'jwT6NlDRBYh5';
  const doorstepTeamEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.NOTIFICATION_EMAIL || 'doorstephub@gmail.com';
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #06183B 0%, #0A2558 55%, #163B7C 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
          <span style="display: inline-block; background: rgba(255,107,0,0.25); color: #FFD6B8; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(255,107,0,0.4);">Doorstep Hub Hyderabad</span>
          <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Booking Confirmed: Doorstep Repair Dispatch</h1>
        </div>
        <div style="padding: 32px 28px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #FFF4EC; color: #E55A00; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 999px; border: 1px solid #FFCCA3; margin-bottom: 20px;">
            ✓ Dispatch Confirmed · Technician Arriving Within 90 Mins
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            Dear <strong>${name}</strong>,<br>
            Thank you for choosing <strong>Doorstep Hub</strong>. Your service booking has been successfully registered. Our certified technician is being dispatched to your location in <strong>${area}, Hyderabad</strong>.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <h3 style="margin: 0 0 14px 0; font-size: 15px; color: #0A2558; font-weight: 800; border-bottom: 2px solid #FF6B00; padding-bottom: 6px; display: inline-block;">
              BOOKING &amp; SERVICE DETAILS
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Service Ticket ID:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #FF6B00; font-size: 15px;">#${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Customer Name:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #0A2558; font-size: 14px; border-top: 1px solid #f1f5f9;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Customer Mobile:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #0A2558; font-size: 14px; border-top: 1px solid #f1f5f9;">
                  <a href="tel:${cleanPhone}" style="color: #0A2558; text-decoration: none;">+91 ${cleanPhone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Customer Email:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #2563EB; font-size: 14px; border-top: 1px solid #f1f5f9;">
                  <a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email || 'Not provided'}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Appliance Service:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #0A2558; font-size: 14px; border-top: 1px solid #f1f5f9;">${service}</td>
              </tr>
              ${subcategory ? `
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Sub-Category / Issue:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #334155; font-size: 14px; border-top: 1px solid #f1f5f9;">${subcategory}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Service Locality:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0A2558; font-size: 14px; border-top: 1px solid #f1f5f9;">${area}, Hyderabad</td>
              </tr>
              ${address ? `
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Detailed Address / Landmark:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 500; color: #475569; font-size: 13px; border-top: 1px solid #f1f5f9;">${address}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Diagnostic Fee:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #059669; font-size: 14px; border-top: 1px solid #f1f5f9;">${price || 'From ₹299'} (Pay Only After Service)</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Doorstep Visit:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #16a34a; font-size: 14px; border-top: 1px solid #f1f5f9;">FREE (₹0 Booking Registration)</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Service Warranty:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0A2558; font-size: 14px; border-top: 1px solid #f1f5f9;">Up to 90 Days Service Warranty with Genuine Parts</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Expected Arrival:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #d97706; font-size: 14px; border-top: 1px solid #f1f5f9;">Within 90 Minutes</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Booking Time:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 500; color: #64748b; font-size: 13px; border-top: 1px solid #f1f5f9;">${dateStr}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 24px 0; padding: 18px; background: #FFF4EC; border-radius: 12px; border-left: 4px solid #FF6B00; font-size: 13px; color: #475569;">
            <strong style="color: #0A2558;">What Happens Next?</strong><br>
            1. Our local dispatch center assigns the nearest certified technician.<br>
            2. Technician will call your mobile (<strong>+91 ${cleanPhone}</strong>) before arrival.<br>
            3. Free inspection and transparent estimate before starting repairs.
          </div>

          <a href="tel:9515661677" style="display: block; text-align: center; background: linear-gradient(135deg, #FF6B00 0%, #E55A00 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; padding: 14px 20px; border-radius: 10px; font-size: 14px; margin: 16px 0;">
            📞 Official Support Helpline: +91 9515661677
          </a>
        </div>
      </div>
    </div>
  `;

  const teamHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; line-height: 1.6; max-width: 600px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: #0A2558; color: #ffffff; padding: 20px 24px; border-radius: 8px; margin-bottom: 20px;">
        <span style="background: #FF6B00; color: #ffffff; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">New Dispatch Request</span>
        <h2 style="margin: 8px 0 4px; font-size: 20px; font-weight: 800;">New Customer Booking Dispatched</h2>
        <p style="margin: 0; font-size: 13px; color: #FFD6B8;">Doorstep Hub • Hyderabad Home Appliance Dispatch System</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; color: #64748b; width: 150px; border-bottom: 1px solid #f1f5f9;">Booking Ref:</td>
          <td style="padding: 10px 0; font-weight: 800; color: #FF6B00; border-bottom: 1px solid #f1f5f9; font-size: 15px;">#${bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Customer Name:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #0A2558; border-bottom: 1px solid #f1f5f9;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Customer Mobile:</td>
          <td style="padding: 10px 0; font-weight: 800; color: #0A2558; border-bottom: 1px solid #f1f5f9;">
            <a href="tel:${cleanPhone}" style="color: #0A2558; text-decoration: underline; font-size: 15px;">+91 ${cleanPhone}</a> (Click to Call)
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Customer Email:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #2563EB; border-bottom: 1px solid #f1f5f9;">
            <a href="mailto:${email}" style="color: #2563EB; text-decoration: underline;">${email || 'Not provided'}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Service Category:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #0A2558; border-bottom: 1px solid #f1f5f9;">${service}</td>
        </tr>
        ${subcategory ? `
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Sub-Category / Issue:</td>
          <td style="padding: 10px 0; font-weight: 600; color: #334155; border-bottom: 1px solid #f1f5f9;">${subcategory}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Pricing Tier:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #059669; border-bottom: 1px solid #f1f5f9;">${price || 'From ₹299'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Service Locality:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #0A2558; border-bottom: 1px solid #f1f5f9;">${area}, Hyderabad</td>
        </tr>
        ${address ? `
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Detailed Address / GPS:</td>
          <td style="padding: 10px 0; font-weight: 600; color: #334155; border-bottom: 1px solid #f1f5f9;">${address}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Booking Time:</td>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">${dateStr}</td>
        </tr>
      </table>

      <div style="background: #FFF4EC; border: 1px solid #FFCCA3; border-radius: 8px; padding: 14px 18px; margin-top: 22px; font-size: 13px; color: #9A3412;">
        ⚡ <strong>Action for Team:</strong> Call customer <a href="tel:${cleanPhone}" style="color: #C2410C; font-weight: 800;">+91 ${cleanPhone}</a> and assign local technician to arrive within 90 minutes.
      </div>
    </div>
  `;

  // 1. Send confirmation email to customer (if email provided)
  if (email && email.includes('@')) {
    try {
      await transporter.sendMail({
        from: `"Doorstep Hub" <${smtpUser}>`,
        to: email.trim(),
        replyTo: doorstepTeamEmail,
        subject: `✓ Booking Confirmed: ${service} [#${bookingId}] - Doorstep Hub`,
        html: customerHtml,
      });
      console.log(`Confirmation email sent to customer: ${email}`);
    } catch (err) {
      console.error('Failed to send customer confirmation email:', err.message);
    }
  }

  // 2. Send booking alert to Doorstep team at doorstephub@gmail.com
  try {
    await transporter.sendMail({
      from: `"Doorstep Hub Bookings" <${smtpUser}>`,
      to: doorstepTeamEmail,
      replyTo: (email && email.includes('@')) ? email.trim() : smtpUser,
      subject: `[NEW BOOKING] #${bookingId} - ${service} in ${area} (${name} - ${cleanPhone})`,
      html: teamHtml,
    });
    console.log(`Booking notification sent to doorstep team: ${doorstepTeamEmail}`);
  } catch (err) {
    console.error('Failed to send doorstep team notification email:', err.message);
  }
};
