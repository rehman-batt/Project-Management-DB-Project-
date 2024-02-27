USE PWB;

INSERT INTO users (fname, lname, user_name, email, user_password, user_role, dob) VALUES
('John', 'Doe', 'John', 'johndoe@example.com', 'password123', 'Admin', '1990-01-01'),
('Jane', 'Doe', 'Jane', 'janedoe@example.com', 'password456', 'Customer', '1995-02-15'),
('Bob', 'Smith', 'Bob','bobsmith@example.com', 'password789', 'Team Member', '1993-07-07'),
('Alice', 'Jones', 'Alice','alicejones@example.com', 'passwordabc', 'Customer', '1998-11-30'),
('Mark', 'Lee', 'Mark','marklee@example.com', 'passworddef', 'Team Member', '1991-05-20'),
('test', 'test', 'test','test@test.com', 'test', 'Team Member', '1991-05-20');

INSERT INTO projects (proj_name, proj_description, start_date, end_date, proj_status) VALUES
 ('Project A', 'This is a description for Project A', '2022-01-01', null, 'Active'),
 ('Project B', 'This is a description for Project B', '2022-02-15', null, 'Active'),
 ('Project C', 'This is a description for Project C', '2022-03-01', null, 'In-Active'),
 ('Project D', 'This is a description for Project D', '2022-04-01', null, 'Active'),
 ('Project E', 'This is a description for Project E', '2022-05-01', '2023-04-21', 'Completed');


INSERT INTO teams (team_name, team_lead) VALUES 
 ('Marketing Team', 3),
 ('Development Team', 5);
 

 -- we need to write a trigger, to insert the team lead into team, when data is inserted into teams.

 -- create trigger team_lead_insertion 
-- before INSERT 
-- on 
-- teams 
-- for each row 
-- select * from NEW.team_id;
-- INSERT INTO team_members (team_id, user_id) VALUES (NEW.team_id, NEW.team_lead);

INSERT INTO proj_teams (proj_id, team_id) Values
 (1, 1),
 (2, 2),
 (3, 1),
 (4, 2),
 (5, 1);

INSERT INTO team_members (team_id, user_id) VALUES (1, 5);
INSERT INTO team_members (team_id, user_id) VALUES (1, 3);
INSERT INTO team_members (team_id, user_id) VALUES (2, 5);

INSERT INTO roadmaps (roadmap_name, roadmap_description, milestones, proj_id)
VALUES
('Project A Roadmap', 'This is the roadmap for Project A', 'Milestone 1: DO This, Milestone 2 DO That, Milestone 3: Done', 1),
('Project B Roadmap', 'This is the roadmap for Project B', 'Milestone 1: ABC, Milestone 2, Milestone 3, Milestone 4', 2),
('Project C Roadmap', 'This is the roadmap for Project C', 'Milestone 1: EDV, Milestone 2: NOPE, Milestone 3: YAYAY, Milestone 5', 3),
('Project D Roadmap', 'This is the roadmap for Project D', 'Milestone 1: DEF, Milestone 2: HM', 4),
('Project E Roadmap', 'This is the roadmap for Project E', 'Milestone 1: LALA, Milestone 2: QWERTY', 5);

INSERT INTO sprints (sprint_name, proj_id) VALUES
 ('Sprint 1', 1),
 ('Sprint 2', 1),
 ('Sprint 1', 2),
 ('Sprint 1', 3),
 ('Sprint 2', 3);
 
INSERT INTO boards (board_title, sprint_id, proj_id) VALUES
 ('Board 1', 1, 1),
 ('Board 2', 1, 1),
 ('Board 3', 2, 1),
 ('Board 4', 3, 2),
 ('Board 5', 3, 2);
 
INSERT INTO lists (list_title, board_id, sprint_id, proj_id)
VALUES ('To Do', 1, 1, 1),
       ('In Progress', 1, 1, 1),
       ('Done', 1, 1, 1),
       ('Backlog', 1, 1, 1),
       ('Blocked', 1, 1, 1),
       ('To Do', 2, 1, 1),
       ('In Progress', 2, 1, 1),
       ('Done', 2, 1, 1);

INSERT INTO issues (title, issue_description, due_date, priority, issue_status, issue_type, list_id, user_id, board_id, sprint_id, proj_id)
VALUES ('Fix Login Bug', 'Users are unable to login to the system', '2023-05-20', 'High', 'Open', 'Bug', 1, 2, 1, 1, 1),
('Add User Management Feature', 'Allow admin to manage users', '2023-06-01', 'Medium', 'Open', 'Feature', 1, 2, 1, 1, 1),
('Design Landing Page', 'Design a landing page for the website', '2023-06-10', 'Medium', 'In-Progress', 'Task', 2, 4, 1, 1, 1),
('Implement Payment Gateway', 'Add support for payment gateway integration', '2023-06-15', 'High', 'Open', 'Feature', 1, 4, 1, 1, 1),
('Optimize Database Queries', 'Optimize slow database queries', '2023-05-30', 'High', 'In-Progress', 'Improvement', 2, 4, 1, 1, 1);

INSERT INTO comments (comment_text, user_id, issue_id) VALUES
 ('I found a bug in this feature. Please fix it.', 2, 5),
 ('Can we add more functionality to this feature?', 4, 2),
 ('I have some ideas to improve this feature. Who can I talk to?', 2, 4),
 ('This issue has been resolved. Thanks!', 2, 1);

update issues set assigned_user_id = 6 where issue_id = 2;

-- select * from issues;

-- select title, issue_description, due_date, priority, issue_status, issue_type from issues where proj_id in (select  proj_id from proj_teams where team_id in (select team_id from teams where team_lead = 3));

-- select * from users;

-- select * from projects where proj_status = 'Completed';

-- select proj_name, proj_description, start_date, end_date, proj_status from projects inner join proj_teams on projects.proj_id = proj_teams.proj_id inner join teams on proj_teams.team_id = teams.team_id where team_lead = 3;
-- -- where proj_status = 'Active' order by team_id;

-- select * from teams;

-- select * from projects;
-- delete from projects where proj_id = 6;
-- select * from proj_teams;

-- select proj_id, proj_name, proj_description, start_date, end_date, proj_status from projects inner join proj_teams on projects.proj_id = proj_teams.proj_id inner join teams on proj_teams.team_id = teams.team_id;


-- INSERT INTO projects (proj_name, proj_description, start_date) VALUES('abc', 'def', '2023-05-10');

-- -- -- select projects.proj_name, projects.proj_description, projects.start_date, projects.end_date, projects.proj_status from projects inner join proj_teams on projects.proj_id = proj_teams. proj_id where proj_teams.team_id in (select team_id from teams where team_lead = 6);
-- -- select title, issue_description, due_date, issue_status, issue_type from issues where assigned_user_id = 6;
-- select team_id from teams where team_lead = 3;
-- -- select projects.proj_name, projects.proj_description, projects.start_date, projects.end_date, projects.proj_status from team_members inner join proj_teams on team_members.team_id = proj_teams.team_id inner join projects on projects.proj_id = proj_teams.proj_id where user_id = 3;

-- -- select * from team_members inner join proj_teams on team_members.team_id = proj_teams.team_id inner join projects on projects.proj_id = proj_teams.proj_id;

-- -- select user_id FROM users WHERE user_name = 'test' and user_role = 'Team Member';

-- select * from lists;
-- select * from sprints;
-- select * from issues;
-- select * from boards;

-- delete from boards where board_id = 8;

-- select * from sprints inner join boards on boards.proj_id = sprints.proj_id and boards.sprint_id = sprints.sprint_id inner join lists on boards.proj_id = lists.board_id and boards.sprint_id = lists.sprint_id and boards.proj_id = sprints.proj_id;
-- -- select * from teams;

-- -- select * from team_members;

-- -- delete from teams where team_id = 4;

-- -- UPDATE users
-- -- SET lname = 'Doe' 
-- -- WHERE user_name = 'Jane';

-- select * from users;

-- -- select projects.proj_name, projects.proj_description, projects.start_date, projects.end_date, projects.proj_status from team_members inner join proj_teams on team_members.team_id = proj_teams.team_id inner join projects on projects.proj_id = proj_teams.proj_id where user_id = 3;