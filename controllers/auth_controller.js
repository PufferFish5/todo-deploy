import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables!");
}
//gentok
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '10d', 
    });
};
//userreg
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = await User.create({
            username,
            email,
            password
        });
        if (user) {
            const token = generateToken(user._id, user.role);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

//userlog
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password'); 
        if (user && (await user.matchPassword(password))) {
            
            const token = generateToken(user._id, user.role);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            });
            
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};