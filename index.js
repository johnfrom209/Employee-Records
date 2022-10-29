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
                    // call method that adds a role

                    break;
                case "Add an employee":
                    console.log('Added employee');
                    // call method that adds an employee

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
        //call questions again
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
            })
            promptTheUser();
        })
}

function addRole() {

    inquirer
        .prompt([
            {
                name: "roleTitle",
                message: "Enter role Title."
            },
            {
                name: "roleSalary",
                message: "Enter salary for the role."
            }
        ])
        .then(answers => {
            db.query("INSERT INTO company_roles SET ?", {
                title: answers.roleTitle,
                salary: answers.roleSalary,
            })
            promptTheUser();
        })
}