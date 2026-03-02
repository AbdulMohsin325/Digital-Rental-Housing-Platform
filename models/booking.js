// //booking for reservation of house

import mongoose from "mongoose";


// // property (reference to property)

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
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
},
{timestamps: true}
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
