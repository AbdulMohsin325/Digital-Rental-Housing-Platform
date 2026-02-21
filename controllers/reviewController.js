import Review from "../models/review.js";
import House from "../models/House.js";

export const createReview = async (req, res) => {
  try {
    const { houseId, rating, comment } = req.body;

    const house = await House.findOne({ homeId: houseId });

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found"
      });
    }

    const review = await Review.create({
      user: req.user._id.toString(),
      house: houseId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this house"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getHouseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ house: req.params.houseId });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: "Review deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Only owner or admin can update
    if (
      review.user !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};