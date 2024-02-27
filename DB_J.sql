drop database if exists PWB;

Create Database PWB;

USE PWB;

CREATE TABLE users (
  user_id INT PRIMARY KEY auto_increment,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL unique,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_role VARCHAR(20) check(user_role in ('Admin', 'Customer', 'Team Member')) NOT NULL ,
  dob DATE
);

CREATE TABLE projects (
  proj_id INT PRIMARY KEY auto_increment,
  proj_name VARCHAR(255) NOT NULL,
  proj_description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  proj_status VARCHAR(20) check(proj_status in ('Active', 'In-Active', 'Completed')) NOT NULL
);

CREATE TABLE teams ( 
  team_id INT Primary Key auto_increment,
  team_name VARCHAR(255) NOT NULL,
  team_lead int not null,
  FOREIGN KEY (team_lead) REFERENCES users(user_id) on delete no action on update cascade
);

CREATE TABLE proj_teams ( 
  proj_id int,
  team_id INT,
  
  Primary KEY (proj_id, team_id)
);

CREATE TABLE team_members (
  team_id INT not null,
  user_id INT not null,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id) on delete cascade on update cascade,
  FOREIGN KEY (user_id) REFERENCES users(user_id) on delete cascade on update cascade
);

CREATE TABLE roadmaps (
  roadmap_id INT PRIMARY KEY auto_increment,
  roadmap_name VARCHAR(255),
  roadmap_description TEXT,
  milestones TEXT,
  proj_id INT not null,
  FOREIGN KEY (proj_id) REFERENCES Projects(proj_id)
  on delete cascade on update cascade
);

CREATE TABLE sprints (
  sprint_id INT primary key auto_increment,
  proj_id INT not null,
  sprint_name VARCHAR(255),
  
  FOREIGN KEY (proj_id) REFERENCES projects(proj_id) on delete cascade on update cascade
);

CREATE TABLE boards (
  board_id INT primary key auto_increment,
  board_title VARCHAR(255),
  sprint_id INT not null,
  proj_id INT not null,
  FOREIGN KEY (proj_id) REFERENCES projects(proj_id) on delete cascade on update cascade,
  FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) on delete cascade on update cascade
);

CREATE TABLE lists (
  list_id INT auto_increment,
  list_title VARCHAR(255),
  board_id INT not null,
  sprint_id INT not null,
  proj_id INT not null,
  Primary Key(list_id, board_id, sprint_id, proj_id),
  FOREIGN KEY (board_id) REFERENCES boards(board_id) on delete cascade on update cascade,
  FOREIGN KEY (proj_id) REFERENCES projects(proj_id) on delete cascade on update cascade,
  FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) on delete cascade on update cascade
);

CREATE TABLE issues (
  issue_id INT primary key auto_increment,
  title VARCHAR(255),
  issue_description TEXT,
  due_date DATE,
  priority VARCHAR(10) check(priority in ('High', 'Medium', 'Low')),
  issue_status VARCHAR(20) check(issue_status in ('Open', 'In-Progress', 'Resolved')),
  issue_type VARCHAR(15) check(issue_type in ('Bug', 'Task', 'Feature', 'Improvement')),
  user_id int,
  assigned_user_id int default null,
  list_id INT,
  board_id INT,
  sprint_id INT,
  proj_id INT not null,
  FOREIGN KEY (board_id) REFERENCES boards(board_id) on delete cascade on update cascade,
  FOREIGN KEY (proj_id) REFERENCES projects(proj_id) on delete cascade on update cascade,
  FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) on delete cascade on update cascade,
  FOREIGN KEY (list_id) REFERENCES lists(list_id) on delete cascade on update cascade,
   FOREIGN KEY(user_id) REFERENCES users(user_id),
   FOREIGN KEY(assigned_user_id) REFERENCES users(user_id)
);

CREATE TABLE comments (
  comment_id INT PRIMARY KEY auto_increment,
  comment_text TEXT NOT NULL,
  user_id INT,
  issue_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id) on delete set null on update cascade,
  FOREIGN KEY (issue_id) REFERENCES issues (issue_id) on delete cascade on update cascade
);
