const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    admin: Boolean,
    courses: [{
        type: ObjectId,
        ref: "course"
    }]
})

const courseSchema = new Schema({
    title: String,
    body: String,
    userId: {
        type: ObjectId,
        ref: "users"
    }
})

const UserModel = mongoose.model('users', userSchema);
const CourseModel = mongoose.model('course', courseSchema);

module.exports = {
    UserModel: UserModel,
    CourseModel: CourseModel
}