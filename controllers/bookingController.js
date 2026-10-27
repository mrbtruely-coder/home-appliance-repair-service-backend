const emailService = require('../services/emailService');

const VALID_AREAS = ['Ameerpet Main Road', 'Chanda Nagar', 'Alwal', 'Suchitra'];

exports.createBooking = async (req, res) => {
  try {
    const {
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
      bookingDate,
    } = req.body;

    if (!name || !phone || !area || !service) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, service, and Hyderabad area are required.',
      });
    }

    const bookingId = req.body.bookingId || req.body.bookingRef || 'DS-' + Date.now().toString().slice(-6);
    const finalDate = date || bookingDate || 'Today';
    const finalSlot = slot || timeSlot || time || 'Standard Arrival';
    const finalTime = time || timeSlot || slot || 'Within 90 Minutes';

    // Send confirmation emails (to customer + doorstep team)
    await emailService.sendBookingConfirmation({
      bookingId,
      name,
      phone,
      email,
      area,
      otherLocation: otherLocation || (isOtherLocation ? area : ''),
      isOtherLocation: Boolean(isOtherLocation || otherLocation),
      service,
      subcategory,
      price,
      address,
      issue,
      date: finalDate,
      timeSlot: finalSlot,
      slot: finalSlot,
      time: finalTime,
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
