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
            'View Budget by department',
            'Update employee Manager',
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
                    // console.log('We viewed all Departments');
                    // call method
                    showDepartments();
                    break;
                case "View all roles":
                    // console.log("Viewed all roles");
                    // call method to display all roles
                    showRoles();
                    break;
                case "View all employees":
                    // console.log('Viewed all employees');
                    //call method that displays all employees
                    showEmployees();
                    break;
                case "Add a department":
                    // console.log('Added department');
                    // call method that adds a department to db
                    addDepartment();
                    break;
                case "Add a role":
                    // console.log('Added a role');
                    addRole();
                    break;
                case "Add an employee":
                    // console.log('Added employee');
                    // call method that adds an employee
                    addEmployeeInfo();
                    break;
                case "Update an employee role":
                    // console.log('Updated employee role');
                    // call method that updates an employee
                    updateEmployeeInfo();
                    break;
                case "View Budget by department":
                    // console.log('Checking budget');
                    departmentBudget();
                    break;
                case "Update employee Manager":
                    // console.log("Updating Manager");
                    updateManager();
                case "Exit":
                    console.log("You quit");
                    break;
            }
        });
}

promptTheUser();

function showDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        globalDepartments = results;
        promptTheUser();
    })
}

function showRoles() {
    db.query('SELECT company_roles.id AS ID, company_roles.title AS Title, department.name_department AS Department, company_roles.salary AS Salary FROM company_roles JOIN department ON company_roles.department_id = department.id ', function (err, results) {
        console.table(results);
        //call questions again
        promptTheUser();
    })
}

function showEmployees() {

    // link the foreign key's to the tables primary keys
    // employee id, first, last, role title, department, salary,(still need to add manager) manager
    db.query(`SELECT employees.id AS ID, employees.name_first AS First,
            employees.name_last AS Last, company_roles.title AS Title, 
            department.name_department AS Department, company_roles.salary AS Salary,
            CONCAT(leader.name_first, " ", leader.name_last) AS Manager 
            FROM employees JOIN company_roles 
            ON employees.role_id = company_roles.id 
            JOIN department 
            ON company_roles.department_id = department.id
            LEFT JOIN employees AS leader ON leader.id = employees.manager_id`, function (err, results) {
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

async function addRole() {

    //call db for department list
    var globalDepartments2 = await db.promise().query('SELECT id, name_department FROM department');
    // console.log(globalDepartments2[0]);

    //set deptChoices by mapping the keys: name, value with the query from db
    var deptChoices = globalDepartments2[0].map(({ id, name_department }) => ({
        name: `${name_department}`,
        value: id
    }))

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
                message: 'Choose department',
                choices: deptChoices
            }
        ])
        .then(answers => {

            // this gives the key so no need to convert it
            // console.log(answers.departmentName);

            //add role(w/ title and salary that references deparment id)
            dbAddRole(answers.roleTitle, answers.roleSalary, answers.departmentName)
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

async function addEmployeeInfo() {

    //db query for role list
    let promptRolesdb = await db.promise().query('SELECT id, title FROM company_roles');
    // console.log(promptRolesdb);

    //map the db results for roles
    let promptRoles = promptRolesdb[0].map(({ id, title }) => ({
        name: `${title}`,
        value: id
    }))

    //db query for employee list
    let promptEmployeesdb = await db.promise().query(`SELECT id, CONCAT(name_first, " ", name_Last) AS Name FROM employees`);
    // console.log(promptEmployeesdb);

    // map the db results for employees
    let promptEmployees = promptEmployeesdb[0].map(({ id, Name }) => ({
        name: `${Name}`,
        value: id
    }))

    // console.log(typeof promptEmployees);

    promptEmployees.push({ name: 'None', value: 'null' });

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
                choices: promptRoles
            },
            {
                type: 'list',
                name: 'empManager',
                message: 'Employee\s manager?',
                choices: promptEmployees
            }]
        )
        .then(answers => {

            if (answers.empManager === 'null') {
                answers.empManager = null;
            }
            // console.log(answers.empManager);
            //still need to add none and equal it to null
            dbAddEmployee(answers.empNameFirst, answers.empNameLast, answers.empRole, answers.empManager)
        })

}

function dbAddEmployee(newNameFirst, newNameLast, newRoleId, newManager) {

    db.query("INSERT INTO employees SET ?", {
        name_first: newNameFirst,
        name_last: newNameLast,
        role_id: newRoleId,
        manager_id: newManager
    }, (err, res) => {
        if (err) throw err;
        promptTheUser();
    })
    // promptTheUser();

}

async function updateEmployeeInfo() {


    // give list of employees
    //db query for employee list
    let promptEmployeesdb = await db.promise().query('SELECT id, name_first FROM employees');
    // console.log(promptEmployeesdb);

    // map the db results for employees
    let promptEmployees = promptEmployeesdb[0].map(({ id, name_first }) => ({
        name: `${name_first}`,
        value: id
    }))

    // get list of role
    //db query for role list
    let promptRolesdb = await db.promise().query('SELECT id, title FROM company_roles');
    // console.log(promptRolesdb);

    //map the db results for roles
    let promptRoles = promptRolesdb[0].map(({ id, title }) => ({
        name: `${title}`,
        value: id
    }))

    // console.log(promptRoles);

    // ask with inquirer
    inquirer
        .prompt([{
            type: 'list',
            name: 'employee',
            message: 'Which employee is getting changed?',
            choices: promptEmployees
        },
        {
            type: 'list',
            name: 'role',
            message: 'Choose the new role',
            choices: promptRoles
        }]).then(answers => {

            // now I have employee id(and first name but not needed anymore), and the new role
            //update employee with the promptEmployees with the new role_id
            // query the db with UPDATE
            // change role 
            db.promise().query(`UPDATE employees SET role_id=${parseInt(answers.role)} WHERE id=${parseInt(answers.employee)}`);
            promptTheUser();
        })

}

async function departmentBudget() {
    // ask which department then send them a list
    //db query for department list
    let promptDepartmentdb = await db.promise().query('SELECT id, name_department FROM department');
    // console.log(promptDepartmentdb);

    // map the db results for employees
    let promptDepartment = promptDepartmentdb[0].map(({ id, name_department }) => ({
        name: `${name_department}`,
        value: id
    }))
    // console.log(promptDepartment);

    inquirer
        .prompt([{
            type: 'list',
            name: 'department',
            message: 'Which department budget would you like to see?',
            choices: promptDepartment
        }]).then(answers => {
            let temp = parseInt(answers.department);

            db.query(`SELECT department.name_department AS Department,
                SUM(company_roles.salary) AS Salary FROM department 
                JOIN company_roles ON company_roles.department_id = department.id
                JOIN employees ON employees.role_id = company_roles.id
                WHERE department.id = ${temp}`, function (err, results) {
                console.table(results)
                promptTheUser();
            })
        })
}

async function updateManager() {

    let promptManagerdb = await db.promise().query(`SELECT id, CONCAT(name_first, " ", name_Last) AS Name FROM employees`);
    // console.log(promptDepartmentdb);

    // map the db results for employees
    let promptManager = promptManagerdb[0].map(({ id, Name }) => ({
        name: `${Name}`,
        value: id
    }))

    inquirer
        .prompt([{
            type: 'list',
            name: 'employee',
            message: 'Which employee is getting a new manager?',
            choices: promptManager
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is their new manager?',
            choices: promptManager
        }]).then(answers => {
            let tempManager = parseInt(answers.employeeManager);
            let tempEmployee = parseInt(answers.employee);

            db.query(`UPDATE employees SET employees.manager_id=${tempManager} WHERE employees.id=${tempEmployee}`, function (err, results) {

                promptTheUser();
            })
        })
}
