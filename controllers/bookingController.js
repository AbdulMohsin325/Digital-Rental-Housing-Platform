// // import Booking from "../models/Booking.js";
// // import House from "../models/House.js";

// // export const createBooking = async (req, res) => {
// //     try {
// //         const { houseId, checkIn, checkOut } = req.body;

// //         const house = await House.findById(houseId);

// //         // Check if house exists
// //         if (!house) {
// //             return res.status(404).json({ message: "House not found" });
// //         }

// //         const totalPrice = house.pricePerNight; // simple for now

// //         // Create booking
// //         const booking = await Booking.create({
// //             user: req.user._id,
// //             house: houseId,
// //             checkIn,
// //             checkOut,
// //             totalPrice
// //         });

// //         res.status(201).json({
// //             success: true,
// //             data: booking
// //         });

// //     } catch (error) {
// //         res.status(400).json({ message: error.message });
// //     }
// // };

// // //Get My Bookings
// // export const getMyBookings = async (req, res) => {
// //     try {
// //         const bookings = await Booking.find({ user: req.user._id })
// //             .populate("house");

// //         res.json({
// //             success: true,
// //             count: bookings.length,
// //             data: bookings
// //         });

// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// import Booking from '../models/Booking.js';
// import House from '../models/House.js';

// /*
//   @desc    Create Booking
//   @route   POST /api/bookings
//   @access  Private (User)
// */
// export const createBooking = async (req, res) => {
//   try {
//     const { houseId, startDate, endDate } = req.body;

//     // Validate input
//     if (!houseId || !startDate || !endDate) {
//       return res.status(400).json({
//         message: "House, start date and end date are required"
//       });
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (end <= start) {
//       return res.status(400).json({
//         message: "End date must be after start date"
//       });
//     }

//     // Check if house exists
//     const house = await House.findById(houseId);
//     if (!house) {
//       return res.status(404).json({ message: "House not found" });
//     }

//     // Check booking date conflict
//     const existingBooking = await Booking.findOne({
//       house: houseId,
//       $or: [
//         {
//           startDate: { $lt: end },
//           endDate: { $gt: start }
//         }
//       ]
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "This house is already booked for the selected dates"
//       });
//     }

//     // Calculate number of days
//     const days = Math.ceil(
//       (end - start) / (1000 * 60 * 60 * 24)
//     );

//     // Calculate total price
//     const totalPrice = days * house.price;

//     // Create booking
//     const booking = await Booking.create({
//       house: houseId,
//       user: req.user._id,
//       startDate: start,
//       endDate: end,
//       totalPrice
//     });

//     res.status(201).json(booking);

//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };


// /*
//   @desc    Get My Bookings
//   @route   GET /api/bookings/my
//   @access  Private
// */
// export const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({
//       user: req.user._id
//     }).populate('house');

//     res.status(200).json(bookings);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Get All Bookings
//   @route   GET /api/bookings
//   @access  Admin
// */
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('user', 'name email')
//       .populate('house', 'title price address');

//     res.status(200).json(bookings);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Get Single Booking
//   @route   GET /api/bookings/:id
//   @access  Private
// */
// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('user', 'name email')
//       .populate('house');

//     if (!booking) {
//       return res.status(404).json({
//         message: "Booking not found"
//       });
//     }

//     // Owner or Admin
//     if (
//       booking.user._id.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.status(403).json({
//         message: "Not authorized"
//       });
//     }

//     res.status(200).json(booking);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Update Booking
//   @route   PUT /api/bookings/:id
//   @access  Private
// */
// export const updateBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         message: "Booking not found"
//       });
//     }

//     // Owner or Admin
//     if (
//       booking.user.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.status(403).json({
//         message: "Not authorized"
//       });
//     }

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.status(200).json(updatedBooking);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// /*
//   @desc    Delete Booking
//   @route   DELETE /api/bookings/:id
//   @access  Private
// */
// export const deleteBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         message: "Booking not found"
//       });
//     }

//     // Owner or Admin
//     if (
//       booking.user.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.status(403).json({
//         message: "Not authorized"
//       });
//     }

//     await booking.deleteOne();

//     res.status(200).json({
//       message: "Booking deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
