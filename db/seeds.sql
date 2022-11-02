

-- DROP TABLE IF EXISTS department;
INSERT INTO department (name_department)
VALUES  ( 'Manager'),
        ( 'PR'),
        ( 'Marketing'),
        ( 'IT'),
        ( 'Intern'),
        ( 'Legal'),
        ( 'Finance'),
        ( 'CEO')
;

INSERT INTO company_roles(title, salary, department_id)
VALUES ('Sales Lead', 100000, 3),
        ('PR Manager', 85000, 2),
        ('Software Engineer', 120000, 4),
        ('Intern', 20000, 5),
        ('CEO Personnel', 500000, 8),
        ('Lead Payroll', 120000, 7),
        ('Payroll Records', 60000, 7),
        ('Lawyer', 300000, 6),
        ('Lawyer Assistant', 50000, 6),
        ('PR Grunt', 25000, 2),
        ('Marketing RD', 50000, 3)
;

INSERT INTO employees (name_first, name_last, role_id, manager_id)
VALUES ('Joe', 'Jen', 3, NULL ),
       ('Sarah', 'Smith', 3, 1 ),
       ('John', 'Doe', 2, NULL),
       ('Peter', 'Parker', 4, 3),
       ('Stewie', 'Griff', 4, 3),
       ('Jack', 'Black', 5, Null),
       ('Steven', 'Segal', 10, 6),
       ('Chris', 'Rock', 11, Null),
       ('Peter', 'Doe', 7, 6),
       ('Sarah', 'Connor', 6, Null),
       ('Jean', 'Gray', 1, Null),
       ('Misty', 'Leet', 8, 6)
;
-- SHOW * FROM TABLE employees;