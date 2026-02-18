// import Review from "../models/review";


// export const createReview = async (req, res) => {
//     try {
//         const { houseId, rating, comment } = req.body;

//         const review = await Review.create({
//             user: req.user._id,
//             house: houseId,
//             rating,
//             comment
//         });

//         res.status(201).json({
//             success: true,
//             data: review
//         });

//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// //Get Review for House

// export const getHouseReviews = async (req, res) => {
//     try {
//         const reviews = await Review.find({ house: req.params.houseId })
//             .populate("user", "name");

//         res.json({
//             success: true,
//             count: reviews.length,
//             data: reviews
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getReviewById = async (req, res) => {
//     try {
//         const review = await Review.findById(req.params.id)
//             .populate('user house');

//         if (!review) {
//             return res.status(404).json({ message: "Review not found" });
//         }

//         res.status(200).json(review);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

// export const updateReview = async (req, res) => {
//     try {
//         const review = await Review.findById(req.params.id);

//         if (!review) {
//             return res.status(404).json({ message: "Review not found" });
//         }

//         if (
//             review.user.toString() !== req.user._id.toString() &&
//             !req.user.isAdmin
//         ) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         const updatedReview = await Review.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         res.status(200).json(updatedReview);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };
// //Review by id

// export const deleteReview = async (req, res) => {
//     try {
//         const review = await Review.findById(req.params.id);

//         if (!review) {
//             return res.status(404).json({ message: "Review not found" });
//         }

//         if (
//             review.user.toString() !== req.user._id.toString() &&
//             !req.user.isAdmin
//         ) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         await review.deleteOne();

//         res.status(200).json({ message: "Review deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };
