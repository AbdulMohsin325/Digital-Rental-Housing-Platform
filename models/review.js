import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    house: {
        type: String,
        required: true
    },
    user: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min:0,
        max:5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }


    
    
}, {timestamps: true})
// Prevent duplicate reviews (one review per user per house)
reviewSchema.index({ user: 1, house: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
