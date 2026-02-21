import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    house: {
        type: string,
        required: true
    },
    user: {
        type: string,
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
reviewSchema.index({ user: 1, house: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
