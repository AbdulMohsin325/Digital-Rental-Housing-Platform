import express from "express";
import {
  createReview,
  getHouseReviews,
  deleteReview
} from "../controllers/reviewController.js";

import { protect } from "../middleware/auth.js";
import { updateReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:houseId", getHouseReviews);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);
export default router;
