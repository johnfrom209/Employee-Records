-- create db of company
DROP DATABASE IF EXISTS companyx_db;
CREATE DATABASE companyx_db;


USE companyx_db;

-- create table of department
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_department VARCHAR(30) NOT NULL
);

-- create table of roles
DROP TABLE IF EXISTS company_roles;
CREATE TABLE company_roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

-- create table employees
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_first VARCHAR(30) NOT NULL,
    name_last VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES company_roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- SHOW COLUMNS FROM employees FROM companyx_db;
-- SHOW COLUMNS FROM company_roles FROM companyx_db;
-- SHOW COLUMNS FROM department FROM companyx_db;






