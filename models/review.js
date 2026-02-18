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
        required: true
    }


    
    
}, {timestamps: true})

const Review = mongoose.model('Review', reviewSchema);

export default Review;
