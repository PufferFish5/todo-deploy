import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User is required']
    },

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },

    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    priority: {
        type: Number,
        min: [1, 'Priority must be equal or higher than 1'],
        max: [5, 'Priority must be equal or lower than 5'],
        default: 1
    },
    dueDate: {
        type: Date
    }
}, {
    versionKey: false,
    timestamps: true
});
const Task = mongoose.model('Task', TaskSchema);

export default Task;