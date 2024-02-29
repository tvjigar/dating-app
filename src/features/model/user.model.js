import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
import { PasswordValidator } from '../../core/validation/index.js';
import { LOGIN_TYPE } from '../../shared/enum.js';
import GenderModel from './gender.model.js';
import InterestDetailModel from './interest-detail.model.js';
import InterestModel from './interest.model.js';


/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator(value) {
                    return validator.isEmail(value);
                },
                message() {
                    return 'Invalid email';
                },
            },
        },
        phone_number : {
            type: String,
            required: true,
            validate: {
                validator(value) {
                    return validator.isMobilePhone(value);
                },
                message() {
                    return 'Invalid phone number';
                },
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate: {
                validator(value) {
                    const validation = PasswordValidator.validate(value);
                    return validation.error === null;
                },
                message(props) {
                    const validation = PasswordValidator.validate(props.value);
                    return validation.error;
                },
            }
        },
        name : {
            type: String,
            required: false,
            default: "",
        },
        profile_photo : {
            type: Array,
            required: false,
            default: "",
        },
        birth_date : {
            type: Date,
            required: false,
            default: "",
        },
        desc : {
            type: String,
            required: false,
            default: "",
        },
        gender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gender",
            required: true,
        },
        interested_in_see: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Gender' 
            }],
            required:false,
            default: [],
        },
        age_range_candidates: {
            type: String,
            required:false,
            default: "",
        },
        height : {
            type: Number,
            required: false,
            default: 0,
        },
        current_occupation : {
            type: Array,
            required: false,
            default: [],
        },
        interests : {
            type: [
                {
                    interest_id : {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Interest",
                        required: true,
                    },
                    interest_details_id : {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "InterestDetail",
                        required: true,
                    },
                }
            ],
            required: false,
            default: [],
        },
        relation_looking_for : {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RelationLooking' 
            }],
            required: false,
            default: [],
        },
        google_token : {
            type: String,
            required: false,
            default: "",
        },
        apple_token : {
            type: String,
            required: false,
            default: "",
        },
        login_type: {
            type: String,
            enum: LOGIN_TYPE,
            default: LOGIN_TYPE.EMAIL,
        },
        device_type: {
            type: String,
            required: false,
            default: "",
        },
    },
    {
        timestamps: true,
        statics: {
            async isEmailTaken(email, userId = undefined) {
                return !!(
                    await this.findOne({ email, _id: { $ne: userId } }).exec()
                );
            },
            // async isPhoneNoTaken(phone_number, userId = undefined) {
            //     return !!(
            //         await this.findOne({ phone_number, _id: { $ne: userId } }).exec()
            //     );
            // },
        },
        methods: {
            async isPasswordMatch(password) {
                return await bcrypt.compare(password, this.password);
            },

            toPlainObject() {
                return {
                    id: this.id,
                    email: this.email,
                    phone_number: this.phone_number,
                    name: this.name,
                    birth_date: this.birth_date,
                    desc: this.desc,
                    gender: this.gender_id,
                    interested_in_see: this.interested_in_see,
                    age_of_potential_candidates: this.age_of_potential_candidates,
                    age: this.age,
                    height: this.height,
                    current_occupation: this.current_occupation,
                    interests: this.interests,
                    relation_looking_for: this.relation_looking_for,
                    google_token: this.google_token,
                    apple_token: this.apple_token,
                    login_type: this.login_type,
                };
            },
        },
    }
);

// Use the GenderModel for population
userSchema.post('find', function(docs) {
    return GenderModel.populate(docs, { path: 'gender_id' });
});

// Use the GenderModel for population
userSchema.post('find', function(docs) {
    return InterestModel.populate(docs, { path: 'interests.interest_id' });
});

// Use the GenderModel for population
userSchema.post('find', function(docs) {
    return InterestDetailModel.populate(docs, { path: 'interests.interest_details_id' });
});

/**
 * User Schema Configurations
 */
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

/**
 * User Model
 */
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
