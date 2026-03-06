import House from "../models/House.js";

export const createHouse = async (req, res) => {
    try {


        const owner = req.user.userId

        const { title, description, price, type, bedrooms, bathrooms, isFurnished, address, images, thumbnail, sqft } = req.body;

        const house = await House.create({
            title,
            description,
            type,
            bedrooms,
            bathrooms,
            isFurnished,
            address,
            price,
            images,
            thumbnail,
            owner,
            approvalStatus: 'Pending'
        });

        res.json({
            status: 1,
            data: house
        });

    } catch (error) {
        res.json({
            status: 0, message: error.message
        });
    }
};

//Get All Houses

export const getAllHouses = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let sort = null;
        if (!req.query.sort) {
            sort = { createdAt: -1 }
        }

        let matchQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };

        if (!req.user || !req.user.isAdmin) {
            matchQuery = {
                ...matchQuery,
                approvalStatus: 'Approved',
                availability: true,
                isActive: true,
            };
        }

        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: sort },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "userId",
                                as: "owner"
                            }
                        },
                        {
                            $unwind: '$owner'
                        },
                        {
                            $project: {
                                _id: 0,
                                owner: '$owner.name',
                                title: 1,
                                price: 1,
                                type: 1,
                                bedrooms: 1,
                                bathrooms: 1,
                                isFurnished: 1,
                                city: '$address.city',
                                thumbnail: 1,
                                approvalStatus: 1,
                                availability: 1,
                                isActive: 1,
                                homeId: 1,
                                sqft: 1
                            }
                        }
                    ],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No houses found" });
        }

        res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

// Protected list API:
// - Admin: all houses
// - Normal user: only houses owned by logged-in user
export const getHousesByRole = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const textQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };

        const isAdmin = Boolean(req.user?.isAdmin);
        const userIdValue = req.user?.userId;
        const mongoIdValue = req.user?._id?.toString();

        const matchQuery = isAdmin
            ? textQuery
            : {
                $and: [
                    textQuery,
                    { owner: { $in: [userIdValue, mongoIdValue].filter(Boolean) } }
                ]
            };

        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 0,
                                city: '$address.city',
                                title: 1,
                                price: 1,
                                thumbnail: 1,
                                availability: 1,
                                approvalStatus: 1,
                                createdAt: 1,
                                homeId: 1,
                                bedrooms: 1,
                                bathrooms: 1,
                                isFurnished: 1,
                                sqft: 1
                            }
                        }
                    ],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No houses found" });
        }

        return res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });
    } catch (error) {
        return res.json({ status: 0, message: error.message });
    }
};

//Get only Approved Houses (Public)
export const getApprovedHouses = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchQuery = {
            approvalStatus: 'Approved',
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };

        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No approved houses found" });
        }

        res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

//Get single house by id
export const getHouseById = async (req, res) => {
    try {
        const house = await House.findOne({ homeId: req.params.id })

        if (!house) {
            return res.json({ status: 0, message: "House not found" });
        }

        res.json({ status: 1, data: house });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};




// Update House (Admin only)
export const updateHouse = async (req, res) => {
    try {
        const house = await House.findOne({ homeId: req.params.id });

        if (!house) {
            return res.json({ status: 0, message: "House not found" });
        }

        const updatedHouse = await House.findOneAndUpdate(
            { homeId: req.params.id },
            req.body,
            { new: true }
        );

        res.json({ status: 1, data: updatedHouse });
    } catch (error) {
        res.json({ status: 0, message: "Server error" });
    }
};


// Delete House (Admin only)
export const deleteHouse = async (req, res) => {
    try {
        const house = await House.findOne({ homeId: req.params.id });

        if (!house) {
            return res.json({ status: 0, message: "House not found" });
        }

        await house.deleteOne();

        res.json({ status: 1, message: "House deleted successfully" });
    } catch (error) {
        res.json({ status: 0, message: "Server error" });
    }
};

// Update House Status (Admin only)
export const updateHouseStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.json({ status: 0, message: "Invalid status provided. Must be 'Approved' or 'Rejected'." });
        }

        const houseToUpdate = await House.findOne({ homeId: req.params.id });

        if (!houseToUpdate) {
            return res.json({ status: 0, message: "House not found" });
        }

        if (houseToUpdate.approvalStatus !== 'Pending') {
            return res.json({ status: 0, message: `House is already ${houseToUpdate.approvalStatus}` });
        }

        const house = await House.findOneAndUpdate(
            { homeId: req.params.id },
            { approvalStatus: status },
            { new: true }
        );

        res.json({ status: 1, message: `House ${status.toLowerCase()} successfully`, data: house });
    } catch (error) {
        res.json({ status: 0, message: "Server error" });
    }
};

// Get pending houses (Admin only)
export const getPendingHouses = async (req, res) => {
    try {
        let search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchQuery = {
            approvalStatus: 'Pending',
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "address.city": { $regex: search, $options: "i" } },
                { "address.state": { $regex: search, $options: "i" } },
                { "address.street": { $regex: search, $options: "i" } }
            ]
        };

        const result = await House.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const houses = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        if (houses.length === 0) {
            return res.json({ status: 0, message: "No pending houses found" });
        }

        res.json({
            status: 1,
            count: houses.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: houses
        });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

// Update House Active Status
export const updateHouseActiveStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.json({ status: 0, message: "Invalid status provided. Must be a boolean value (true or false)." });
        }

        const houseToUpdate = await House.findOne({ homeId: req.params.id });

        if (!houseToUpdate) {
            return res.json({ status: 0, message: "House not found" });
        }

        // Update the active status
        const house = await House.findOneAndUpdate(
            { homeId: req.params.id },
            { isActive },
            { new: true }
        );

        res.json({ status: 1, message: `House marked as ${isActive ? 'Active' : 'Inactive'} successfully`, data: house });
    } catch (error) {
        res.json({ status: 0, message: "Server error" });
    }
};

