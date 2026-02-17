import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            
        },
       description: {
           type: String,
           trim: true
       },
       price: {
           type: Number,
           trim: true
       },
       type: {
           type: String,
           trim: true
       },
       rooms: {
           type: Number,
           trim: true
       },
       bathrooms: {
           type: Number,
           trim: true
       },
       isFurnished: {
           type: Boolean,
           trim: true
       },
       images: {
           type: [String],
           trim: true
       },
        name: {
            type: String,
            trim: true
        },
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
            trim: true
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
    
    let record =  await House.findOne().sort({ homeId: -1 }).limit(1);
    let nextId= record.homeId.slice(-3);
    nextId = parseInt(nextId) + 1;  
    this.homeId = `HID${String(nextId).slice(-3)}`;
    next();
});





const House = mongoose.model('House', houseSchema);

export default House;
