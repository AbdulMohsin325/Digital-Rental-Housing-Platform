import house from "../models/houses.js";

export const createHouse = async (req, res) => {
    try {
        const house = await house.create({
            ...req.body,
            owner: req.user.id
        });

        res.status(201).json(house);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllHouses = async (req, res) => {
    const houses = await house.find().populate('owner', 'name email');
    res.json(houses);
};
