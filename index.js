const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const consoleT = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'companyx_db'
    },
    console.log('Connected to companyx_db.')
)

let globalDepartments = [];
let globalRoles = [];
let globalEmployees = [];

// questions for the user
let questions = [
    {
        type: 'list',
        name: 'operation',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }
]



function promptTheUser() {

    inquirer
        .prompt(questions)
        .then(answers => {

            // I don't use switch case so this is me going out of my way and using it
            switch (answers.operation) {
                case "View all departments":
                    console.log('We viewed all Departments');
                    // call method
                    showDepartments();
                    break;
                case "View all roles":
                    console.log("Viewed all roles");
                    // call method to display all roles
                    showRoles();
                    break;
                case "View all employees":
                    console.log('Viewed all employees');
                    //call method that displays all employees
                    showEmployees();
                    break;
                case "Add a department":
                    console.log('Added department');
                    // call method that adds a department to db
                    addDepartment();
                    break;
                case "Add a role":
                    console.log('Added a role');
                    addRole();
                    // const promiseDepartmentList = new Promise((resolve, reject) => {
                    //     let departmentList = [];

                    //     db.query('SELECT * FROM department', function (err, results) {
                    //         for (let i = 0; i < results.length; i++) {
                    //             departmentList.push(results[i].name_department)
                    //         }
                    //     })
                    //     resolve(departmentList);
                    // })
                    // promiseDepartmentList.then((dataList) => {
                    //     addRole(dataList);
                    // })

                    // call the function and do async await there


                    break;
                case "Add an employee":
                    console.log('Added employee');

                    // call method that adds an employee
                    addEmployeeInfo();
                    break;
                case "Update an employee role":
                    console.log('Updated employee role');
                    // call method that updates an employee



                    break;
                case "Exit":
                    console.log("You quit");
                    return;
                    break;
            }
        });
}

promptTheUser();

function showDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        // this gets me arry of the results
        // let temp = [];
        // temp = results;
        // console.log(temp);
        //call questions again
        globalDepartments = results;
        console.log("GlobalDepartments" + globalDepartments);
        promptTheUser();
    })
}

function showRoles() {
    db.query('SELECT * FROM company_roles', function (err, results) {
        console.table(results);
        //call questions again
        promptTheUser();
    })
}

function showEmployees() {
    db.query('SELECT * FROM employees', function (err, results) {
        console.table(results);
        //call questions again
        promptTheUser();
    })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "departName",
                message: "Enter department name."
            }
        ])
        .then(answers => {
            db.query("INSERT INTO department SET ?", {
                name_department: answers.departName
            }, (err, res) => {
                if (err) throw err;
                promptTheUser();
            })
        })
}

function addGlobalDepartments() {
    db.query('SELECT id AS value, name_department AS name FROM department', function (err, results) {
        console.table(results);

        console.log("Results: " + results);

        globalDepartments = results[0];
    })
}

// const addGlobalDepartments = async () => {
//     const departmentQuery = `SELECT id AS value, name_department AS name FROM department;`;
//     const departments = await db.query(departmentQuery);
//     return departments[0];
// }

// function gettingDepartmentList() {
//     let departments = [];

//     db.query('SELECT * FROM department', function (err, results) {
//         for (let i = 0; i < results.length; i++) {
//             departments.push(results[i].name_department)
//         }
//         // addRole(departments);
//         return departments
//     })
// }

// this needs the list of Department names to get the id
async function addRole() {
    //call db for department list
    // set global var for depart, role, employee
    await addGlobalDepartments();

    inquirer
        .prompt([
            {
                name: "roleTitle",
                message: "Enter role Title."
            },
            {
                name: "roleSalary",
                message: "Enter salary for the role."
            },
            {
                type: 'list',
                name: 'departmentName',
                choices: globalDepartments
            }
        ])
        .then(answers => {

            console.log(answers.departName);


            // need the department id and findIndex didn't work so for looping it
            // let departId;
            // for (let i = 0; i < nameFirstPrompt.length; i++) {
            //     if (list[i] === answers.departmentName) {
            //         // need to add 1 since mysql tables start at 1 and arrays start at 0
            //         departId = i + 1;
            //     }
            // }
            // company_roles needs a num for salary
            // let numSalary = parseFloat(answers.roleSalary);
            // console.log(answers.roleTitle);

            // dbAddRole(answers.roleTitle, numSalary, departId)
        })
}

function dbAddRole(roleTitle, roleSalary, departmentId) {

    db.query("INSERT INTO company_roles SET ?", {
        title: roleTitle,
        salary: roleSalary,
        department_id: departmentId
    }, (err, res) => {
        if (err) throw err;
        promptTheUser();
    }
    )
}

async function gettingRoleList(newRoleList) {

    db.query('SELECT * FROM company_roles', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            newRoleList.push(results[i].title)
        }
        return;
    })
}

async function gettingEmployeeList(newEmployeeList) {
    newEmployeeList.push("None")

    db.query('SELECT * FROM employees', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            newEmployeeList.push(results[i].name_first)
        }
        return;
    })
}

async function addEmployeeInfo() {

    try {

        let newEmployeeList = [];
        await gettingEmployeeList(newEmployeeList);
        let newRoleList = [];
        await gettingRoleList(newRoleList);

        dbAddEmployee(newRoleList, newEmployeeList);
    } catch (err) {
        console.log(err);
    }
}

function dbAddEmployee(newRoleList, newEmployeeList) {

    inquirer
        .prompt([
            {
                name: 'empNameFirst',
                message: 'What is the new employee\s first name?'
            },
            {
                name: 'empNameLast',
                message: 'What is the new emplyee\s last name?'
            },
            {
                type: 'list',
                name: 'empRole',
                message: 'What is the employee\s role?',
                choices: newRoleList
            },
            {
                type: 'list',
                name: 'empManager',
                message: 'Employee\s manager?',
                choices: newEmployeeList
            }]
        )
        .then(answers => {

            let roleId;
            // for loop to get the index of the roleId from answers
            for (let i = 0; i < newRoleList.length; i++) {
                if (answers.empRole === newRoleList[i]) {
                    roleId = i + 1;
                }
            }

            let manager;
            if (answers.empManager === "None") {
                manager = null;
            }
            else {
                // loop the employee list but 
                //since None is the first thing listed we don't need to add 1
                // like I did in the add role
                // maybe instead of this we look up id with a dbquery that matches the manager name 
                // I can see conflict with repeat names
                console.log(answers.empManager);
                for (let j = 0; j < newEmployeeList.length; j++) {
                    if (answers.empManager === newEmployeeList[j]) {
                        manager = j;
                        break;
                    }
                }
            }
            db.query("INSERT INTO employees SET ?", {
                name_first: answers.empNameFirst,
                name_last: answers.empNameLast,
                role_id: roleId,
                manager_id: manager
            })
            promptTheUser();
        })
}

function updateEmployeeInfo() {

    // give list of employees
    // change role 
    // query the db with UPDATE

}