import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }

    
    
})

const Review = mongoose.model('Review', reviewSchema);

export default Review;
