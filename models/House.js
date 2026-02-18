import mongoose from 'mongoose';


const houseSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            // required: true,
            trim: true

        },
       description: {
           type: String,
           trim: true
       },
       price: {
           type: Number,
           trim: true,
           required: true
       },
       type: {
           type: String,
           trim: true
       },
       rooms: {
           type: Number,
           trim: true,
           required: true
       },
       bathrooms: {
           type: Number,
           trim: true,
           required: true
       },
       isFurnished: {
           type: Boolean,
           trim: true
       },
       images: {
           type: [String],
           trim: true
       },
        // name: {
        //     type: String,
        //     trim: true
        // },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        availability: {
            type: Boolean,
            default: true
        },
        owner: {
    type: String,
 
    required: true
},
homeId: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);


houseSchema.pre('save', async function (next) {

    const HouseModel = mongoose.model('House');

    const record = await HouseModel.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (record && record.homeId) {
        const match = record.homeId.match(/\d+/);
        if (match) {
            nextNumber = parseInt(match[0]) + 1;
        }
    }

    this.homeId = `HID${String(nextNumber).padStart(3, '0')}`;

    next();
});


const House = mongoose.model('House', houseSchema);

export default House;
