const Sequelize = require('sequelize');

const sequelize = new Sequelize("kxfqkzvu", "kxfqkzvu", "aM8dz1naEejbnCuI5GFbi5cilCKIU8x_", {
    host: "mahmud.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define our Models - "Student"
const Student = sequelize.define("Student", {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

const Course = sequelize.define("Course", {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
})

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch(() => reject("unable to sync the database"));
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then(data => { resolve(data) })
            .catch(() => reject("no results returned"));
    })
}

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => reject("no results returned"));
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: { studentNum: num }
        })
            .then(data => { resolve(data[0]) })
            .catch(() => reject("no results returned"));
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: { course: course }
        })
            .then(data => { resolve(data) })
            .catch(() => reject("no results returned"));
    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where: { courseId: id }
        })
            .then(data => {
                console.log(data[0]);
                resolve(data[0]);
            })
            .catch(() => reject("no results returned"));
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.TA = (studentData.TA) ? true : false;
        for (let key in studentData) {
            if (studentData[key] === "")
                studentData[key] = null;
        };

        Student.create(studentData)
            .then(() => resolve())
            .catch(() => reject("unable to create student"));
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.TA = (studentData.TA) ? true : false;
        for (const key in studentData) {
            if (studentData[key] === "")
                studentData[key] = null;
        };
        Student.update(
            studentData,
            {
                where: { studentNum: studentData.studentNum }
            }).then(() => resolve())
            .catch(() => reject("unable to update student"));
    });
};

module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {
        Student.destroy(
            { where: { studentNum: studentNum } }
        )
            .then(() => { resolve() })
            .catch(() => { reject("delete was rejected") });
    })
}

module.exports.addCourse = function (courseData) {
    return new Promise(function (resolve, reject) {
        for (const key in courseData) {
            console.log(key);
            console.log(courseData[key]);
            if (courseData[key] === "")
                courseData[key] = null;
        };
        Course.create(courseData)
            .then(() => resolve())
            .catch(() => reject("unable to create course"));
    })
};

module.exports.updateCourse = function (courseData) {
    return new Promise(function (resolve, reject) {
        for (let key in courseData) {
            if (courseData[key] === "")
                courseData[key] = null;
        };
        Course.update(courseData,
            {
                where: { courseId: courseData.courseId }
            }).then(() => resolve())
            .catch(() => reject("unable to update course"))
    })
}

module.exports.deleteCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.destroy(
            { where: { courseId: id } }
        ).then(() => resolve("deleted"))
            .catch(() => reject("unable to delete"));
    })
}



