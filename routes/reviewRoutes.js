// import express from "express";
// import {
//     createReview,
//     getHouseReviews,
//     getReviewById,
//     updateReview,
//     deleteReview
// } from "../controllers/reviewController.js";

// import { protect } from "../middleware/auth.js";

// const router = express.Router();


// // Create review (only logged in users)
// router.post("/", protect, createReview);

// // Get all reviews for a specific house
// router.get("/house/:houseId", getHouseReviews);

// // Get single review by ID
// router.get("/:id", getReviewById);

// // Update review (only owner or admin)
// router.put("/:id", protect, updateReview);

// // Delete review (only owner or admin)
// router.delete("/:id", protect, deleteReview);

// export default router;
