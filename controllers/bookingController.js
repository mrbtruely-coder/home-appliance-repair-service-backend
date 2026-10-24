const emailService = require('../services/emailService');

const VALID_AREAS = ['Ameerpet Main Road', 'Chanda Nagar', 'Alwal', 'Suchitra'];

exports.createBooking = async (req, res) => {
  try {
    const { name, phone, area, service, address, issue, date, timeSlot } = req.body;

    if (!name || !phone || !area || !service) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, service, and Hyderabad area are required.',
      });
    }

    const bookingId = 'DS-' + Date.now().toString().slice(-6);

    // Send confirmation email
    await emailService.sendBookingConfirmation({
      bookingId,
      name,
      phone,
      area,
      service,
      address,
      issue,
      date,
      timeSlot,
    });

    return res.status(200).json({
      success: true,
      bookingId,
      message: 'Booking received successfully. Technician will be dispatched in 90 minutes.',
      supportPhone: '9515661677',
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing booking.',
    });
  }
};
