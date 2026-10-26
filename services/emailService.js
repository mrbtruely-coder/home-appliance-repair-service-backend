const nodemailer = require('nodemailer');

exports.sendBookingConfirmation = async (bookingData) => {
  const { bookingId, name, phone, email, area, service, subcategory, price, address, issue, date, timeSlot } = bookingData;
  const cleanPhone = String(phone || '').replace(/\D/g, '');

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
            ✓ Dispatch Confirmed · Technician Arriving Within 90 Mins
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            Dear <strong>${name}</strong>,<br>
            Thank you for choosing <strong>Home Appliance Repair Services</strong>. Your service booking has been successfully registered. Our certified technician is being dispatched to your location in <strong>${area}, Hyderabad</strong>.
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
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Expected Arrival:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 800; color: #d97706; font-size: 14px; border-top: 1px solid #f1f5f9;">Within 90 Minutes</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">Booking Time:</td>
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

          <!-- THIN DIVIDER -->
          <div style="border-top: 1px solid #E2E8F0; margin: 24px 0 22px;"></div>

          <!-- EXPERIENCE FASTER BOOKINGS ON DOORSTEP HUB APP -->
          <div style="text-align: center; margin: 20px 0 24px;">
            <h3 style="font-size: 17px; font-weight: 800; color: #0F172A; margin: 0 0 8px; letter-spacing: -0.3px;">
              Experience Faster Bookings on Doorstep Hub App
            </h3>
            <p style="font-size: 13px; color: #64748B; margin: 0 auto 18px; max-width: 440px; line-height: 1.5;">
              Track your technician in real-time, get instant discounts, and manage appliance warranty.
            </p>

            <!-- APP STORE & GOOGLE PLAY BADGES (RESPONSIVE TABLE) -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
              <tr>
                <!-- GOOGLE PLAY BUTTON -->
                <td style="padding: 5px 6px;" class="store-badge-td">
                  <a href="${playStoreUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background: #000000; border-radius: 8px; padding: 7px 16px; border: 1px solid #000000; min-width: 150px;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 9px; width: 24px;">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <path d="M3.6 1.8c-.3.4-.5.9-.5 1.6v17.2c0 .7.2 1.2.5 1.6l.1.1 9.6-9.6v-.2L3.7 1.7l-.1.1z" fill="#00D2FF"/>
                            <path d="M16.5 15.7l-3.2-3.2v-.2l3.2-3.2.1.1 3.8 2.2c1.1.6 1.1 1.6 0 2.2l-3.9 2.1z" fill="#FFCE00"/>
                            <path d="M16.6 15.6L13.3 12.3 3.6 22c.4.4 1 .5 1.7.1l11.3-6.5z" fill="#FF3333"/>
                            <path d="M16.6 8.4L5.3 1.9C4.6 1.5 4 1.6 3.6 2l9.7 9.7 3.3-3.3z" fill="#00E676"/>
                          </svg>
                        </td>
                        <td style="vertical-align: middle; text-align: left; line-height: 1.15;">
                          <div style="font-size: 8px; color: #cbd5e1; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">GET IT ON</div>
                          <div style="font-size: 14px; color: #ffffff; font-weight: 800; letter-spacing: -0.2px; margin-top: 2px;">Google Play</div>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>

                <!-- APPLE APP STORE BUTTON -->
                <td style="padding: 5px 6px;" class="store-badge-td">
                  <a href="${appStoreUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background: #000000; border-radius: 8px; padding: 7px 16px; border: 1px solid #000000; min-width: 150px;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 9px; width: 22px;">
                          <svg width="20" height="22" viewBox="0 0 170 170" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.19-9.46-10.96-20.2-14.29-32.22-3.33-12.01-5-23.36-5-34.05 0-14.88 3.83-27.31 11.48-37.3 7.66-9.98 17.38-15.06 29.17-15.22 4.48 0 9.54 1.15 15.19 3.44 5.66 2.3 9.4 3.51 11.23 3.63 1.48 0 5.48-1.33 12.01-4 6.53-2.67 11.77-3.79 15.72-3.36 17.5 1.25 30.65 8.35 39.46 21.28-15.54 9.46-23.12 22.3-22.75 38.51.37 12.63 5.09 23.36 14.16 32.2 4.1 4.01 8.87 7.08 14.3 9.21-2.98 8.68-6.61 17.03-10.9 25.04zM119.22 31.02c0-7.39 2.67-14.42 8-21.08 5.34-6.66 11.83-10.74 19.48-12.24.47 1.83.71 3.5.71 5.01 0 7.4-2.83 14.45-8.48 21.16-5.66 6.72-12.22 10.7-19.71 11.95v-4.8z"/>
                          </svg>
                        </td>
                        <td style="vertical-align: middle; text-align: left; line-height: 1.15;">
                          <div style="font-size: 8px; color: #cbd5e1; font-weight: 700; letter-spacing: 0.3px;">Download on the</div>
                          <div style="font-size: 14px; color: #ffffff; font-weight: 800; letter-spacing: -0.2px; margin-top: 2px;">App Store</div>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>
            </table>
          </div>

          <!-- THIN DIVIDER -->
          <div style="border-top: 1px solid #E2E8F0; margin: 24px 0 20px;"></div>

          <!-- VERIFIED & TRUSTED BY Doorstep Hub PILL BADGE -->
          <div style="text-align: center; margin-bottom: 16px;">
            <div style="display: inline-block; background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 999px; padding: 6px 18px;">
              <span style="color: #0284C7; font-size: 13px; font-weight: 700;">🛡️ Verified &amp; Trusted by Doorstep Hub</span>
            </div>
          </div>

          <!-- COPYRIGHT & CONTACT INFO -->
          <div style="text-align: center; font-size: 12px; color: #64748B; line-height: 1.7; padding-bottom: 10px;">
            <div>© 2026 Home Appliance Repair Services. Serving Hyderabad, Secunderabad &amp; Cyberabad.</div>
            <div>
              Helpline: <a href="tel:+919515661677" style="color: #0284C7; font-weight: 700; text-decoration: none;">+91 9515661677</a> | Email: <a href="mailto:bookinginfo@homeappliancerepairsservices.com" style="color: #0284C7; text-decoration: none;">bookinginfo@homeappliancerepairsservices.com</a>
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
        <p style="margin: 0; font-size: 13px; color: #FFD6B8;">Home Appliance Repair Services • Hyderabad Dispatch System</p>
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
        subject: `✓ Booking Confirmed: ${service} [#${bookingId}] - Home Appliance Repair`,
        html: customerHtml,
      });
      console.log(`Confirmation email sent to customer: ${email}`);
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
      subject: `[NEW BOOKING] #${bookingId} - ${service} in ${area} (${name} - ${cleanPhone})`,
      html: teamHtml,
    });
    console.log(`Booking notification sent to team: ${doorstepTeamEmail}`);
  } catch (err) {
    console.error('Failed to send team notification email:', err.message);
  }
};
