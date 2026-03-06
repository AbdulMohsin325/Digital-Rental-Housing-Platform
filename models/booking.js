
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    house: {
        type: String,
        required: true
      
    },
    user: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected','cancelled'],
        default: 'pending'
    },
    bookingId: {
        type: String,
    }
},
{timestamps: true}
);


bookingSchema.pre('save', async function (next) {
    const BookingModel = mongoose.model('Booking');
    const record = await BookingModel.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;
    if (record && record.bookingId) {
        const match = record.bookingId.match(/\d+/);
        if (match) {
            nextNumber = parseInt(match[0]) + 1;
        }
    }
    this.bookingId = `BID${String(nextNumber).padStart(3, '0')}`;
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
