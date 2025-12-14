import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true
    },

email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please use a valid email address'] 
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    versionKey: false,
    timestamps: true
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
    }
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); 
};

const User = mongoose.model('User', UserSchema);

export default User;