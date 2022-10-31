


INSERT INTO department (name_department)
VALUES  ( 'Manager'),
        ( 'PR'),
        ( 'Marketing'),
        ( 'IT'),
        ( 'Intern')
;

INSERT INTO company_roles(title, salary, department_id)
VALUES ('Sales Lead', 100000, 3),
        ('PR Manager', 85000, 2),
        ('Software Engineer', 120000, 4),
        ('Intern', 20000, 5)
;

INSERT INTO employees (name_first, name_last, role_id, manager_id)
VALUES ('Joe', 'Jen', 3, NULL ),
       ('Sarah', 'Smith', 3, 1 ),
       ('John', 'Doe', 2, NULL),
       ('Peter', 'Parker', 4, 3),
       ('Stewie', 'Griff', 4, 3)
;
-- SHOW * FROM TABLE employees;