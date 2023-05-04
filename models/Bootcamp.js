import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import geocoder from '../utils/geocoder.js';

const BootcampSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not have more then 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        unique: true,
        trim: true,
        maxlength: [500, 'Description can not have more then 500 characters']
    },
    website: {
        type: String,
        match: [
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
            'Please use a valid URL'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone No can not have more then 20 characters']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please provide an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
});

BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});

BootcampSchema.pre('save', async function(next) {
    try {
        const loc = await geocoder.geocode(this.address);
        this.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].street,
            city: loc[0].city,
            state: loc[0].state,
            zipCode: loc[0].zipcode,
            country: loc[0].countryCode
        };
        this.address = null;
        next();
    } catch (err) {
        console.log(`Unable to fetch location data for ${this.address}`);
    }
});

BootcampSchema.pre('remove', async function(next) {
    await (this.model('Course').deleteMany({ bootcampId: this._id }));
    next();
});

BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
});
export default new model('Bootcamp', BootcampSchema, 'bootcamps');