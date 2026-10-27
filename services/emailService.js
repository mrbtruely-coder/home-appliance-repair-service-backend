const nodemailer = require('nodemailer');

exports.sendBookingConfirmation = async (bookingData) => {
  const {
    bookingId,
    name,
    phone,
    email,
    area,
    otherLocation,
    isOtherLocation,
    service,
    subcategory,
    price,
    address,
    issue,
    date,
    timeSlot,
    slot,
    time,
  } = bookingData;

  const scheduledDate = date || 'Today';
  const scheduledSlot = slot || timeSlot || time || 'Standard Arrival';
  const scheduledTime = time || timeSlot || slot || 'Within 90 Minutes';

  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const otherLocationName = otherLocation || (isOtherLocation ? area : '');
  const isOther = Boolean(otherLocationName && otherLocationName !== 'Other Location');

  const smtpHost = process.env.SMTP_HOST || 'homeappliancerepairsservices.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER || 'bookinginfo@homeappliancerepairsservices.com';
  const smtpPass = process.env.SMTP_PASS || 'F9WA+c3eh=(Vl=af';
  const doorstepTeamEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.NOTIFICATION_EMAIL || 'bookinginfo@homeappliancerepairsservices.com';
  const playStoreUrl = process.env.PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.doorstephub.customer&pcampaignid=web_share';
  const appStoreUrl = process.env.APP_STORE_URL || 'https://apps.apple.com/in/app/doorstep-hub-all-your-needs/id6475340236';
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

  const responsiveStyles = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
      @media only screen and (max-width: 580px) {
        .email-outer-pad { padding: 10px 8px !important; }
        .email-card { border-radius: 10px !important; }
        .email-inner-pad { padding: 20px 14px !important; }
        .email-header-pad { padding: 24px 14px !important; }
        .store-badge-td { display: block !important; width: 100% !important; max-width: 100% !important; padding: 5px 0 !important; }
        .trust-badge-col { display: block !important; width: 100% !important; border-left: none !important; border-right: none !important; border-bottom: 1px solid #f1f5f9 !important; padding: 10px 0 !important; }
        .footer-action-td { display: block !important; width: 100% !important; text-align: left !important; margin-top: 10px !important; }
        .heading-title { font-size: 19px !important; }
        .store-btn { padding: 12px 14px !important; }
      }
    </style>
  `;

  const customerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      ${responsiveStyles}
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <div class="email-outer-pad" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #0f172a;">
        <div class="email-card" style="max-width: 600px; width: 100%; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <div class="email-header-pad" style="background: linear-gradient(135deg, #06183B 0%, #0A2558 55%, #163B7C 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 16px;">
            <img src="https://homeappliancerepairsservices.com/logo.png" alt="Home Appliance Repair Services" style="max-height: 65px; width: auto; background-color: #ffffff; padding: 8px 16px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
          </div>
          <span style="display: inline-block; background: rgba(255,107,0,0.25); color: #FFD6B8; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(255,107,0,0.4);">Home Appliance Repair Services Hyderabad</span>
          <h1 style="margin: 12px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Booking Confirmed: Doorstep Technician Dispatch</h1>
        </div>
        <div class="email-inner-pad" style="padding: 32px 28px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #FFF4EC; color: #E55A00; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 999px; border: 1px solid #FFCCA3; margin-bottom: 20px;">
            ✓ Scheduled for ${scheduledDate} &bull; Slot: ${scheduledSlot}
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
            Dear <strong>${name}</strong>,<br>
            Thank you for choosing <strong>Home Appliance Repair Services</strong>. Your service booking has been successfully confirmed. Our certified technician is scheduled to visit your doorstep in <strong>${isOther ? `${otherLocationName} (Hyderabad/Secunderabad)` : `${area}, Hyderabad`}</strong>.
          </p>

          <!-- DYNAMIC SCHEDULE HIGHLIGHT CARD -->
          <div style="background: linear-gradient(135deg, #FFF4EC 0%, #FFF8F3 100%); border: 1.5px solid #FF6B00; border-radius: 12px; padding: 18px 20px; margin: 0 0 24px; box-shadow: 0 4px 12px rgba(255,107,0,0.06);">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #C2410C; margin-bottom: 6px;">
              📅 CONFIRMED APPOINTMENT SCHEDULE &amp; TIME SLOT
            </div>
            <div style="font-size: 16.5px; font-weight: 900; color: #0A2558;">
              📅 Date: <span>${scheduledDate}</span> &bull; ⏰ Slot: <span style="color: #FF6B00;">${scheduledSlot}</span>
            </div>
            <div style="font-size: 13px; color: #475569; margin-top: 5px;">
              Technician Arrival Window: <strong style="color: #059669;">⚡ Within ${scheduledTime}</strong>
            </div>
          </div>

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
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Appointment Date:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #0A2558; font-size: 14.5px; border-top: 1px solid #f1f5f9;">📅 ${scheduledDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Service Time Slot:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #FF6B00; font-size: 14.5px; border-top: 1px solid #f1f5f9;">⏰ ${scheduledSlot}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Expected Arrival:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #059669; font-size: 14px; border-top: 1px solid #f1f5f9;">⚡ Within ${scheduledTime}</td>
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
                <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #0A2558; font-size: 14px; border-top: 1px solid #f1f5f9;">
                  ${isOther ? `${otherLocationName}` : `${area}, Hyderabad`}
                </td>
              </tr>
              ${isOther ? `
              <tr style="background: #FFF4EC;">
                <td style="padding: 10px 8px; color: #C2410C; font-size: 13.5px; border-top: 1px solid #FFCCA3; font-weight: 800;">
                  Customer Location (Other):
                </td>
                <td style="padding: 10px 8px; text-align: right; font-weight: 900; color: #C2410C; font-size: 14.5px; border-top: 1px solid #FFCCA3;">
                  📍 ${otherLocationName}
                </td>
              </tr>
              ` : ''}
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
              ${issue ? `
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Customer Issue Note:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 500; color: #334155; font-size: 13px; border-top: 1px solid #f1f5f9;">${issue}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Booking Submitted:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 500; color: #64748b; font-size: 13px; border-top: 1px solid #f1f5f9;">${dateStr}</td>
              </tr>
            </table>
          </div>

          <!-- NEED QUICK ASSISTANCE OR NEED TO RESCHEDULE (GREEN BOX) -->
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 16px 20px; margin: 24px 0 14px;">
            <div style="font-size: 14px; font-weight: 700; color: #166534; margin-bottom: 5px;">
              Need quick assistance or need to reschedule?
            </div>
            <div style="font-size: 13px; color: #15803D; line-height: 1.6;">
              Call or WhatsApp Support: <a href="tel:+919515661677" style="color: #0284C7; font-weight: 700; text-decoration: none;">+91 9515661677</a> &bull; Email: <a href="mailto:bookinginfo@homeappliancerepairsservices.com" style="color: #0284C7; font-weight: 700; text-decoration: none;">bookinginfo@homeappliancerepairsservices.com</a>
            </div>
          </div>

          <!-- SERVICE PROMISE BOX -->
          <div style="background: #F1F5F9; border-radius: 8px; padding: 13px 18px; margin: 0 0 24px; font-size: 13px; color: #475569; line-height: 1.55;">
            🛡️ <strong style="color: #1E293B;">Service Promise:</strong> Verified technicians, genuine spare parts, transparent pricing, and 90-day doorstep warranty.
          </div>

        <!-- Industry Standard Responsive App Download Section -->
        <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 14px; text-align: center;">
          <p style="margin: 0 0 6px; font-size: 14.5px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">
            Experience Faster Bookings on Doorstep Hub App
          </p>
          <p style="margin: 0 0 14px; font-size: 12.5px; color: #64748b; line-height: 1.4; max-width: 440px; margin-left: auto; margin-right: auto;">
            Track your technician in real-time, get instant discounts, and manage appliance warranty.
          </p>
          
          <div style="text-align: center; margin: 0 auto;">
            <div style="display: inline-block; vertical-align: middle; margin: 5px 6px;">
              <a href="${playStoreUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" height="42" style="display: block; height: 42px; width: auto; max-width: 140px; border: 0;" />
              </a>
            </div>
            <div style="display: inline-block; vertical-align: middle; margin: 5px 6px;">
              <a href="${appStoreUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" height="42" style="display: block; height: 42px; width: auto; max-width: 140px; border: 0;" />
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding: 18px 20px; text-align: center; color: #64748b; font-size: 12px; background: #ffffff;">
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; background: #e0f2fe; color: #0284c7; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 20px; border: 1px solid #bae6fd;">
              🛡️ Verified &amp; Trusted by Doorstep Hub
            </span>
          </div>
          &copy; ${new Date().getFullYear()} Home Appliance Repair Services. Serving Hyderabad, Secunderabad, Vijayawada &amp; Vizag.<br/>
          Helpline: <a href="tel:9515661677" style="color: #008ba6; text-decoration: none; font-weight: bold;">+91 9515661677</a> | Email: <a href="mailto:${smtpUser}" style="color: #008ba6; text-decoration: none;">${smtpUser}</a>
        </div>
      </div>

        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  const teamHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; line-height: 1.6; max-width: 600px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: #0A2558; color: #ffffff; padding: 20px 24px; border-radius: 8px; margin-bottom: 20px;">
        <div style="margin-bottom: 12px;">
          <img src="https://homeappliancerepairsservices.com/logo.png" alt="Home Appliance Repair Services" style="max-height: 48px; width: auto; background-color: #ffffff; padding: 6px 12px; border-radius: 8px; display: inline-block;" />
        </div>
        <span style="background: #FF6B00; color: #ffffff; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">New Dispatch Request</span>
        <h2 style="margin: 8px 0 4px; font-size: 20px; font-weight: 800;">New Customer Booking Dispatched</h2>
        <p style="margin: 0; font-size: 13.5px; color: #FFD6B8;">📅 Scheduled: <strong>${scheduledDate}</strong> &bull; ⏰ Slot: <strong>${scheduledSlot}</strong></p>
      </div>

      <!-- DYNAMIC DATE, TIME & SLOT CALLOUT FOR DISPATCH TEAM -->
      <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; color: #92400E; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
          ⚡ DISPATCH SCHEDULE &amp; TIME SLOT:
        </div>
        <div style="font-size: 16px; font-weight: 900; color: #78350F;">
          📅 Date: ${scheduledDate} &nbsp;|&nbsp; ⏰ Slot: ${scheduledSlot}
        </div>
        <div style="font-size: 12.5px; color: #92400E; margin-top: 3px;">
          Expected Arrival Window: <strong style="color: #B45309;">Within ${scheduledTime}</strong>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; color: #64748b; width: 150px; border-bottom: 1px solid #f1f5f9;">Booking Ref:</td>
          <td style="padding: 10px 0; font-weight: 800; color: #FF6B00; border-bottom: 1px solid #f1f5f9; font-size: 15px;">#${bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Scheduled Date:</td>
          <td style="padding: 10px 0; font-weight: 800; color: #0A2558; border-bottom: 1px solid #f1f5f9; font-size: 14.5px;">📅 ${scheduledDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Booked Time Slot:</td>
          <td style="padding: 10px 0; font-weight: 800; color: #FF6B00; border-bottom: 1px solid #f1f5f9; font-size: 14.5px;">⏰ ${scheduledSlot}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Arrival Window:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #059669; border-bottom: 1px solid #f1f5f9;">⚡ Within ${scheduledTime}</td>
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
          <td style="padding: 10px 0; font-weight: 700; color: #0A2558; border-bottom: 1px solid #f1f5f9;">
            ${isOther ? `${otherLocationName}` : `${area}, Hyderabad`}
          </td>
        </tr>
        ${isOther ? `
        <tr style="background: #FEF3C7;">
          <td style="padding: 12px 10px; color: #92400E; font-weight: 800; border-bottom: 1px solid #FCD34D; font-size: 13.5px;">
            ⚠️ OTHER LOCATION ENTERED:
          </td>
          <td style="padding: 12px 10px; font-weight: 900; color: #B45309; font-size: 15px; border-bottom: 1px solid #FCD34D;">
            📍 ${otherLocationName} (Customer Specified Other Location)
          </td>
        </tr>
        ` : ''}
        ${address ? `
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Detailed Address / GPS:</td>
          <td style="padding: 10px 0; font-weight: 600; color: #334155; border-bottom: 1px solid #f1f5f9;">${address}</td>
        </tr>
        ` : ''}
        ${issue ? `
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Customer Issue Note:</td>
          <td style="padding: 10px 0; font-weight: 600; color: #334155; border-bottom: 1px solid #f1f5f9;">${issue}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Booking Submitted:</td>
          <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">${dateStr}</td>
        </tr>
      </table>

      <div style="background: #FFF4EC; border: 1px solid #FFCCA3; border-radius: 8px; padding: 14px 18px; margin-top: 22px; font-size: 13px; color: #9A3412;">
        ⚡ <strong>Action for Team:</strong> Call customer <a href="tel:${cleanPhone}" style="color: #C2410C; font-weight: 800;">+91 ${cleanPhone}</a> and assign local technician for arrival on <strong>${scheduledDate}</strong> during slot <strong>${scheduledSlot}</strong> at <strong>${isOther ? otherLocationName : area}</strong>.
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
        <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px;">Doorstep Hub Mobile Apps:</div>
        <a href="${playStoreUrl}" target="_blank" style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 700; padding: 7px 14px; border-radius: 6px; margin: 3px 4px;">▶ Google Play</a>
        <a href="${appStoreUrl}" target="_blank" style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 700; padding: 7px 14px; border-radius: 6px; margin: 3px 4px;"> App Store</a>
      </div>
    </div>
  `;

  // 1. Send confirmation email to customer (if email provided)
  if (email && email.includes('@')) {
    try {
      await transporter.sendMail({
        from: `"Home Appliance Repair Services" <${smtpUser}>`,
        to: email.trim(),
        replyTo: doorstepTeamEmail,
        subject: `✓ Booking Confirmed: ${service} on ${scheduledDate} (${scheduledSlot}) [#${bookingId}] - Home Appliance Repair`,
        html: customerHtml,
      });
      console.log(`Confirmation email sent to customer: ${email} for slot ${scheduledSlot} on ${scheduledDate}`);
    } catch (err) {
      console.error('Failed to send customer confirmation email:', err.message);
    }
  }

  // 2. Send booking alert to team
  try {
    await transporter.sendMail({
      from: `"Booking Dispatch Alert" <${smtpUser}>`,
      to: doorstepTeamEmail,
      replyTo: (email && email.includes('@')) ? email.trim() : smtpUser,
      subject: `[NEW BOOKING] #${bookingId} - ${service} on ${scheduledDate} (${scheduledSlot}) in ${isOther ? `${otherLocationName} [OTHER LOCATION]` : area} (${name} - ${cleanPhone})`,
      html: teamHtml,
    });
    console.log(`Booking notification sent to team: ${doorstepTeamEmail} for slot ${scheduledSlot} on ${scheduledDate}`);
  } catch (err) {
    console.error('Failed to send team notification email:', err.message);
  }
};
