import Booking from "../models/booking.js";
import House from "../models/House.js";

//Booking is done by user only
export const createBooking = async (req, res) => {
  try {
    const { houseId, startDate, endDate } = req.body;
    const house = await House.findOne({ homeId: houseId });
    const user = req.user.userId;

    console.log(user);

    // const house = await House.findOne({homeId: homeId});

    // Check if house exists
    if (!house) {
      return res.json({ status: 0, message: "House not found" });
    }

    if (house.owner.toString() === user.toString()) {
      return res.json({ status: 0, message: "You can't book your own house" });
    }

    // Check overlapping booking
    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBooking = await Booking.findOne({
      house: houseId,
      status: { $nin: ["cancelled", "rejected"] },
      $or: [
        {
          startDate: { $lt: end },
          endDate: { $gt: start }
        }
      ]
    });

    if (overlappingBooking) {
      return res.json({
        status: 0,
        message: "House is already booked for selected dates"
      });
    }

    const days = (end - start) / (1000 * 60 * 60 * 24);

    const totalPrice = days * house.price;

    // Create booking
    const booking = await Booking.create({
      user: user,
      house: houseId,
      startDate,
      endDate,
      totalPrice
    });

    res.json({
      status: 1,
      data: booking
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })

    res.json({
      status: 1,
      //             count: bookings.length,
      data: bookings
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};



export const getBookingList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find houses owned by the logged-in user
    const houses = await House.find({ owner: req.user.userId }).select('homeId');
    const houseIds = houses.map(house => house.homeId);

    // Find total count of bookings
    const total = await Booking.countDocuments({ house: { $in: houseIds } });

    // Find bookings for these houses with pagination
    const bookings = await Booking.find({ house: { $in: houseIds } })
      .skip(skip)
      .limit(limit)
      .populate("house")
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.json({ status: 0, message: "No bookings found" });
    }

    res.json({
      status: 1,
      count: bookings.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: bookings
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Admin get All booking

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("house", "title price");

    res.json({
      status: 1,
      data: bookings
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

//Cancel the Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({ status: 0, message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.json({ status: 0, message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      status: 1,
      message: "Booking cancelled"
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};


export const approveBooking = async (req, res) => {
  try {
    const bookingId = req.body.bookingId || req.params.bookingId;

    if (!bookingId) {
      return res.json({ status: 0, message: "bookingId is required" });
    }

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.json({ status: 0, message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.json({ status: 0, message: "Booking is not pending" });
    }

    const resp = await Booking.findOneAndUpdate(
      { bookingId: bookingId },   
      { status: "approved" },
      { new: true }
    );

    res.json({
      status: 1,
      message: "Booking approved",
      data: resp
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({ status: 0, message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.json({ status: 0, message: "Not authorized" });
    }

    booking.status = "rejected";
    await booking.save();

    res.json({
      status: 1,
      message: "Booking rejected"
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get Booked Dates for House
export const getBookedDates = async (req, res) => {
  try {
    const { houseId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      house: houseId,
      status: { $nin: ["cancelled", "rejected", "pending"] },
      endDate: { $gte: today }
    }).select("startDate endDate -_id");

    res.json({
      status: 1,
      data: bookings
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};


