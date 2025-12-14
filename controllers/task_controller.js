import Task from '../models/task.js';
import User from '../models/user.js';

export const getUserInfo = async () => {
    return await User.findOne();
};

//create
export const createTask = async (data, userId) => {
    const taskDataWithUser = { ...data, userId }; 
    return await Task.create(taskDataWithUser);
};

//read
export const getAllTasks = async (userId) => {
    return await Task.find({ userId }).sort({ createdAt: -1 }); 
};
export const getTasksByStatus = async (status, userId) => {
    return await Task.find({ status, userId });
};
export const getTaskById = async (id, userId) => {
    return await Task.findOne({ _id: id, userId });
};

//upd
export const updateTask = async (id, updateData, userId) => {
    return await Task.findOneAndUpdate(
        { _id: id, userId }, 
        updateData, 
        { 
            new: true, 
            runValidators: true 
        }
    );
};

export const updateStatus = async (id, userId) => {
    return await Task.findOneAndUpdate(
        { _id: id, userId }, 
        { status: 'completed' }, 
        { new: true }
    );
};

//del
export const deleteTask = async (id, userId) => {
    return await Task.findOneAndDelete({ _id: id, userId }); 
};
//summary
export const getTasksSummary = async (userId) => {
    try {
        const summary = await Task.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: {
                    _id: "$status", 
                    count: { $sum: 1 } 
                }
            },
            { $group: {
                    _id: null, 
                    pending: { $sum: { 
                                $cond: [ { $eq: ["$_id", "pending"] }, "$count", 0 ]
                            } 
                    },
                    completed: { $sum: { 
                            $cond: [ { $eq: ["$_id", "completed"] }, "$count", 0 ]
                            } 
                    }
                }
            },
            { $project: {
                    _id: 0,
                    pending: 1,
                    completed: 1
                }
            }
        ]);
        return summary[0] || { pending: 0, completed: 0 };
    } catch (e) {
        throw e;
    }
};