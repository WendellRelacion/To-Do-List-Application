CREATE TABLE userInfo (
    id INT AUTO_INCREMENT,  
    username VARCHAR(255) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT,
    task_name VARCHAR(255) NOT NULL, 
    category ENUM('high', 'medium', 'low', 'overdue') NOT NULL, -- only have four different categories for simplicity
    doneness BOOLEAN NOT NULL DEFAULT FALSE,
    deadline DATETIME NOT NULL,  
    description TEXT, 
    user_id INT,  
    FOREIGN KEY (user_id) REFERENCES userInfo(id),
    PRIMARY KEY(id)
);
-- password should be the same as password
INSERT INTO userInfo (username, password) VALUES 
    ('55555 ', '$2b$10$BQBIuxHkzXnQk6vlmvDjrOEViT2snI8.DaYBWXwps.V6bAgxTPCTe'),  
    ('4444', '$2b$10$qi3eIJDU8fChLnCba9MYROnvGCszmyZFEdKN5EQp.l.enc.qa0ZTq'); 

INSERT INTO tasks (task_name, category, doneness, deadline, description, user_id) VALUES 
    ('Finish Report', 'high', FALSE, '2024-12-15 17:00:00', 'Complete the project report', 1),
    ('Read Documentation', 'medium', TRUE, '2024-12-10 10:00:00', 'Read through the API documentation', 1),
    ('Update Resume', 'low', FALSE, '2024-12-20 09:00:00', 'Update resume with latest work experience', 1),
    ('Eat lots of food', 'overdue', FALSE, '2023-12-20 09:00:00', 'bulk season bra', 1);

INSERT INTO tasks (task_name, category, doneness, deadline, description, user_id) VALUES 
    ('Fix Bug in App', 'high', TRUE, '2024-12-12 14:00:00', 'Fix critical bug affecting app performance', 2),
    ('Schedule Meeting', 'medium', FALSE, '2024-12-14 09:00:00', 'Schedule a meeting with the team', 2),
    ('Clean Workspace', 'low', FALSE, '2024-12-30 18:00:00', 'Organize and clean the workspace', 2),
    ('Pay Bills', 'overdue', FALSE, '2022-12-01 00:00:00', 'Pay the overdue utility bills', 2);