import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as taskController from './controllers/task_controller.js';
import Task from './models/task.js';
import User from './models/user.js';

dotenv.config();
const uri = process.env.DB_URI;
let examTasks = [
    { 
        userId: "693d5f7e0cf3b316fef9a42b",
        title: "Oleg etogo daze ne yvidit,",
        description: "i zachem ya togda eto pishy?",
        status: 'completed',
        priority: 5, 
        dueDate: new Date('2025-12-15') 
    },
    { 
        userId: "693d5f7e0cf3b316fef9a42b",
        title: "ya hotya bi ne delayu blok shemi kak on", 
        description: "",
        status: 'pending', 
        priority: 4, 
        dueDate: new Date('2025-12-08')
    },
    {
        userId: "693d5f7e0cf3b316fef9a42b",
        title: "fotochka insertion",
        description: "Vstavit' kruto.jpg v footer proekta",
        dueDate: new Date('2025-12-20')
    }
];

const examUsers = {
        username: "vernulsya_v_praim",
        email: "generalmayonez1@gmail.com",
        password: "qwerty1",
        role: 'admin'
    }


async function runMongoDBSetup() {
    const client = new MongoClient(uri);
    try {
        await mongoose.connect(uri);
        console.log("✅ 1. Успішне підключення до MongoDB Server.");
        console.log(`✅ 2. База даних обрана.`);
        await clearDatabase()
        //const user = await insertUser();
        //const tasks = await insertTasks();

        const tsk = await findAllTasks();
        if (tsk.length > 0) {
            console.log(tsk);
        } else {
            console.log("Задач не знайдено");
        }

    } catch (error) {
        console.error("❌ Виникла помилка підключення/операції:", error.message);
    } finally {
        console.log("--- З'єднання закрито. Роботу завершено. ---");
    }
}
async function insertUser() {
    try {
        const result = await User.insertMany(examUsers);
        console.log(`User inserted. ID: ${result._id}`);
        return result;
    } catch (e) {
        throw e;
    }
}

async function insertTasks() {
    try {
        const result = await Task.insertMany(examTasks);
        console.log(`Inserted ${result.length} new tasks`);
        return result;
    } catch (e) {
        throw e;
    }
}

async function clearDatabase() {
    const connection = mongoose.connection;
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("Data wiped");
}

async function findAllTasks() {
    try {
        const taskArr = await Task.find({});
        console.log("Tasks founded")
        return taskArr;
    } catch(e) {
        throw e;
    }
}

async function findImportantTasks() {
    try {
        const studentsCollection = db.collection('students');
        const frontendStudents = await studentsCollection.find({ specialty: "Frontend" }).toArray();
        
        console.log("Фронтендери знайдені");
        if (frontendStudents.length > 0) {
            console.log(frontendStudents);
        } else {
            console.log("Фронтендерів не знайдено");
        }
        return frontendStudents;
    } catch(e) {
        console.error("Помилка при пошуку", e.message);
        throw e;
    }
}

async function updateUser() {
    const groupsCollection = db.collection("groups");
    const filter = { name: "WEB-21" }; 
    const updateDoc = {
        $set: {curator: "Dr. Black"}
    }
    try {
        const result = await groupsCollection.updateOne(filter, updateDoc);
        
        console.log("Оновлення даних про куратора");
        if (result.modifiedCount === 1) {
            console.log(`Куратора групи 'WEB-21' змінено на 'Dr. Black'.`);
        } else {
            console.log(`Групу не знайдено`);
        }
        
        return result.modifiedCount;
    } catch (e) {
        console.error("Куратор не оновився", e.message);
        throw e;
    }
}

async function updateStudentsAge(db) {
    const studentsCollection = db.collection("students");
    const filter = {}; 
    const updateDoc = {
        $set: {age: 20}
    };
    try {
        const result = await studentsCollection.updateMany(filter, updateDoc); 
        console.log("Оновлення даних про студентів");
        if (result.modifiedCount > 0) {
            console.log(`Вік оновлено для ${result.modifiedCount} студентів.`);
        } else {
            console.log("Вік не оновлено");
        }
        
        return result.modifiedCount;
    } catch (e) {
        console.error("Як цю помилку обізвати?", e.message);
        throw e;
    }
}

async function deleteOneStudent(db) {
    const studentsCollection = db.collection("students");
    const filter = { name: "Ірина" }; 
    try {
        const result = await studentsCollection.deleteOne(filter);
        console.log("Видалення одного студента");
        if (result.deletedCount === 1) {
            console.log(`Студента з ім'ям 'Ірина' успішно видалено.`);
        } else {
            console.log(`Студента з ім'ям 'Ірина' не знайдено.`);
        }
        
        return result.deletedCount;
    } catch (e) {
        console.error("Помилка при видаленні", e.message);
        throw e;
    }
}
runMongoDBSetup();