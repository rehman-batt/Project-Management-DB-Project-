var express = require("express");
const session = require('express-session');
var mysql = require("mysql")
var database = require('./database');
var app = express();
var path = require('path');
let alert = require('alert'); 

app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  }));

// app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/login.html");
});



app.get('/1', function(req, res) {
    var uname = req.query.username;
    var pass = req.query.password;
    let sql = "select * from users where user_name = '" + uname +"'";
    database.query(sql, function(err, results){
        if (err) throw err;

        if (Object.keys(results).length === 0)
        {
            res.sendFile((path.join(__dirname, 'views', 'auth_failed.html')));
        }
        else
        { 
            if(results[0]['user_password'] === pass)
            {
                
                req.session.user = results[0]['user_id'];
                if(results[0]['user_role'] === 'Admin')
                {
                    res.sendFile((path.join(__dirname, 'views', 'Admin-home.html')));
                }
                else if (results[0]['user_role'] === 'Customer') 
                {
                    res.sendFile((path.join(__dirname, 'views', 'customer-home.html')));
                }
                else
                {
                    let sql1 = "select * from teams where team_lead in (select user_id from users where fname = '" + uname +"')";
                    database.query(sql1, function(err, results2){
                        if (err) throw err;
                        if (Object.keys(results2).length === 0)
                        {
                            res.sendFile((path.join(__dirname, 'views', 'TeamMember-home.html')));
                        }
                        else
                        {
                            res.sendFile((path.join(__dirname, 'views', 'Manager-home.html')));
                        }
                    });
                }


            }
            else
            {
                res.sendFile((path.join(__dirname, 'views', 'auth_failed.html')));
            }
            
        }
        
    });
});

app.get('/admin_projects', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = "select * from projects";

        database.query(sql, function(err, results){
            res.render('show_projects_admin', {title:'Projects', data:results});
        });
    }
    else if(op === '2')
    {
        let sql = "select * from projects where proj_status = 'Active'";

        database.query(sql, function(err, results){
            res.render('show_projects_admin', {title:'Projects', data:results});
        });
    }
    else if(op === '3')
    {
        let sql = "select * from projects where proj_status = 'In-Active'";

        database.query(sql, function(err, results){
            res.render('show_projects_admin', {title:'Projects', data:results});
        });
    }
    else if(op === '4')
    {
        let sql = "select * from projects where proj_status = 'Completed'";

        database.query(sql, function(err, results){
            res.render('show_projects_admin', {title:'Projects', data:results});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'Admin-projects.html')));
    }
});



app.get('/admin_users', function(req, res) {
    
    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = "select * from users";

        database.query(sql, function(err, results){
            res.render('show_users_admin', {title:'Users', data:results});
        });
    }
    else if(op === '2')
    {
        res.render('create_user', {title:'Create User'});
    }
    else if(op === '3')
    {
        res.render('remove_user', {title:'Remove User'});
    }
    else if(op === '4')
    {
        res.render('update_user', {title:'Update User'});
    }
    else if(op === '5')
    {
        res.render('create_team', {title:'Create Team'});
    }
    else if(op === '6')
    {
        res.render('add_team_member', {title:'Add Team Member'});
    }
    else if(op === '7')
    {
        res.render('remove_team_member', {title:'Remove Team Member'});
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'Admin-users.html')));
    }

    
});

app.get('/create_new_user', function(req, res) {
    var fname = req.query.fname;
    var lname = req.query.lname;
    var user_name = req.query.user_name;
    var email = req.query.email;
    var user_password = req.query.user_password;
    var user_role = req.query.user_role;
    var dob = req.query.dob;

    let sql = `INSERT INTO users (fname, lname, user_name, email, user_password, user_role, dob) VALUES('${fname}', '${lname}', '${user_name}', '${email}', '${user_password}', '${user_role}', '${dob}')`;
   
    database.query(sql, function(err, results){
        if (err) 
        {

            alert('User Name or Email Already Occupied!');
            res.render('create_user', {title:'Create User'});
        }
        else
        {
            alert('New User Created Successfully!');
            res.render('create_user', {title:'Create User'});
        }
    });


});

app.get('/delete_user', function(req, res) {

    var user_name = req.query.user_name;
    

    let sql = `DELETE FROM users WHERE user_name = '${user_name}';`;
   
    database.query(sql, function(err, results){
        if (results.affectedRows === 0) 
        {

            alert('No Such User Found!');
            res.render('remove_user', {title:'Remove User'});
        }
        else
        {

            alert('User Removed Successfully!');
            res.render('remove_user', {title:'Remove User'});
        }
    });


});

app.get('/update_existing_user', function(req, res) {


    var fname = req.query.fname;
    var lname = req.query.lname;
    var user_name = req.query.user_name;
    var email = req.query.email;
    var user_password = req.query.user_password;
    var user_role = req.query.user_role;
    var dob = req.query.dob;

    var user_check = 0;

    let sql = `select * from users WHERE user_name = '${user_name}'`;
   
    database.query(sql, function(err, results){
        if (Object.keys(results).length === 0)
        {
            alert('Error! check user name.');
            res.render('update_user', {title:'Update User'});
        }
        else
        {
            if(fname !== '')
            {
                let sql = `UPDATE users SET fname = '${fname}' WHERE user_name = '${user_name}'`;
        
                database.query(sql, function(err, results){
                });
            }
            if(lname !== '')
            {
                let sql = `UPDATE users SET lname = '${lname}' WHERE user_name = '${user_name}'`;
        
                database.query(sql, function(err, results){
                });
            }
            if(email !== '')
            {
                let sql = `UPDATE users SET email = '${email}' WHERE user_name = '${user_name}'`;
        
                database.query(sql, function(err, results){
                });
            }
            if(user_password !== '')
            {
                let sql = `UPDATE users SET user_password = '${user_password}' WHERE user_name = '${user_name}'`;
        
                database.query(sql, function(err, results){
                });
            }
            if(user_role !== '')
            {
                let sql = `UPDATE users SET user_role = '${user_role}' WHERE user_name = '${user_name}'`;
        
                database.query(sql, function(err, results){
                });
            }
            if(dob !== '')
            {
                let sql = `UPDATE users SET dob = '${dob}' WHERE user_name = '${user_name}'`;

                database.query(sql, function(err, results){
                });

                
            }

           
            alert('Successfully updated.');
            

            res.render('update_user', {title:'Update User'});
        }
        
    });

    

    


});

app.get('/create_new_team', function(req, res) {

    var user_name = req.query.lead;
    var team_name = req.query.name;

    let sql = `select user_id FROM users WHERE user_name = '${user_name}' and user_role = 'Team Member'`;
   
    database.query(sql, function(err, results){
        if (Object.keys(results).length === 0)
        {
            alert('please enter correct username for team-lead!');
            res.render('create_team', {title:'Create Team'});
        }
        else
        {
            let id = results[0]['user_id'];
            let sql =  `INSERT INTO teams (team_name, team_lead) VALUES('${team_name}', ${id})`;
            database.query(sql, function(err, results){
                if(err)
                {
                    alert('an error occured!');
            
                }
                else
                {

                    let sql = `select team_id from teams where team_name = '${team_name}'`;
                    database.query(sql, function(err, results){
                        let sql =  `INSERT INTO team_members (team_id, user_id) VALUES(${results[0]['team_id']}, ${id})`;
                        database.query(sql, function(err, results){
                            alert('Team Created Successfully!');
                        });
                        
                    });
                }
                res.render('create_team', {title:'Create Team'});
            });

            
            
            
            
        }
    });


});

app.get('/add_member', function(req, res) {

    var user_name = req.query.user_name;
    var team_name = req.query.name;

    let sql = `select user_id FROM users WHERE user_name = '${user_name}' and user_role = 'Team Member'`;
   
    database.query(sql, function(err, results){
        if (Object.keys(results).length === 0)
        {
            alert('please enter correct username for team-member!');
            res.render('add_team_member', {title:'Add Team Member'});
        }
        else
        {
            let id = results[0]['user_id'];
            let sql = `select team_id FROM teams WHERE team_name = '${team_name}'`;
            database.query(sql, function(err, results){
                if(err)
                {
                    alert('an error occured!');
                    res.render('add_team_member', {title:'Add Team Member'});
            
                }
                else if (Object.keys(results).length === 0)
                {
                    alert('please enter correct team name!');
                    
                }
                else
                {

                    let sql =  `INSERT INTO team_members (team_id, user_id) VALUES('${results[0]['team_id']}', ${id})`;
                    database.query(sql, function(err, results){       
                        if(err)
                        {
                            alert('an error occured!');
                           
                    
                        }           
                        else
                        {
                            alert('Success!');
                        }
                    });
                }
                res.render('add_team_member', {title:'Add Team Member'});
            });
            
        }
    });


});


app.get('/remove_member', function(req, res) {

    var user_name = req.query.user_name;
    var team_name = req.query.name;

    let sql = `select user_id FROM users WHERE user_name = '${user_name}' and user_role = 'Team Member'`;
   
    database.query(sql, function(err, results){
        if (Object.keys(results).length === 0)
        {
            alert('please enter correct username for team-member!');
            res.render('remove_team_member', {title:'Remove Team Member'});
        }
        else
        {
            let id = results[0]['user_id'];
            let sql = `select team_id FROM teams WHERE team_name = '${team_name}'`;
            database.query(sql, function(err, results){
                if(err)
                {
                    alert('an error occured!');
                    res.render('remove_team_member', {title:'Remove Team Member'});
            
                }
                else if (Object.keys(results).length === 0)
                {
                    alert('please enter correct team name!');
                    
                }
                else
                {
                    let sql =  `delete from team_members where team_id = ${results[0]['team_id']} and user_id = ${id}`;
                    database.query(sql, function(err, results){       
                        if(err)
                        {
                            alert('an error occured!');
                    
                        }           
                        else
                        {
                            alert('Success!');
                        }
                    });
                }
                res.render('remove_team_member', {title:'Remove Team Member'});
            });
            
        }
    });


});



app.get('/admin_reports', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = "select proj_name, proj_description, start_date, end_date, proj_status from projects where proj_status = 'Completed'";

        database.query(sql, function(err, results){
            res.render('show_reports_admin', {title:'Reports', data:results, check: 1});
        });
    }
    else if(op === '2')
    {
        let sql = "select proj_name, proj_description, start_date, end_date, proj_status, team_id from projects inner join proj_teams on projects.proj_id = proj_teams.proj_id where proj_status = 'Active' order by team_id";

        database.query(sql, function(err, results){
            res.render('show_reports_admin', {title:'Reports', data:results, check: 0});
        });
    }
    else if(op === '3')
    {
        let sql = "select proj_name, proj_description, start_date, end_date, proj_status, team_id from projects inner join proj_teams on projects.proj_id = proj_teams.proj_id where proj_status = 'Completed' order by team_id";

        database.query(sql, function(err, results){
            res.render('show_reports_admin', {title:'Reports', data:results, check: 0});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'Admin-reports.html')));
    }
});


app.get('/manager_projects', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = `select projects.proj_id, proj_name, proj_description, start_date, end_date, proj_status from projects inner join proj_teams on projects.proj_id = proj_teams.proj_id inner join teams on proj_teams.team_id = teams.team_id where team_lead = ${req.session.user};`;
    
        database.query(sql, function(err, results){
      
            res.render('manage_projects', {title:'Projects', data:results});
        });
    }
    else if(op === '2')
    {
        res.render('create_project', {title:'Create New Project'});
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'Admin-reports.html')));
    }
});


app.get('/create_new_project', function(req, res) {

    var name = req.query.name;
    var desc = req.query.desc;
    var start = req.query.start;
    
    let sql = `INSERT INTO projects (proj_name, proj_description, start_date, proj_status) VALUES('${name}', '${desc}', '${start}', 'Active')`;

    database.query(sql, function(err, results){
        console.log(req.session.user);
        let sql = `select team_id from teams where team_lead = ${req.session.user}`;
        database.query(sql, function(err, results){
            let team_id = results[0]['team_id'];
            console.log(team_id);
            let sql = `select proj_id from projects where proj_name = '${name}'`
            database.query(sql, function(err, results){
                console.log(results);
                let sql = `INSERT INTO proj_teams (proj_id, team_id) VALUES(${results[0]['proj_id']}, ${team_id})`;
                database.query(sql, function(err, results){
                });
            });
        });
    });
    
    res.render('create_project', {title:'Create New Project'});
    
});


app.get('/project_detail', function(req, res) {

    var id = req.query.id;

    let sql = `select * from sprints where proj_id = ${id}`;

    database.query(sql, function(err, results){
        res.render('show_sprints', {title:'Sprints', data:results, id:id});
    });
});

app.get('/sprint_detail', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;



    let sql = `select * from boards where proj_id = ${p_id} and sprint_id = ${s_id}`;
   
    database.query(sql, function(err, results){
 
        res.render('show_boards', {title:'Boards', data:results, p_id:p_id, s_id:s_id});
    });
});

app.get('/board_detail', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var b_id = req.query.b_id;


    let sql = `select * from lists where proj_id = ${p_id} and sprint_id = ${s_id} and board_id = ${b_id}`;
   
    database.query(sql, function(err, results){

        res.render('show_lists', {title:'Lists', data:results, p_id:p_id, s_id:s_id, b_id:b_id});
    });
});

app.get('/list_detail', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var b_id = req.query.b_id;
    var l_id = req.query.l_id;

    let sql = `select * from issues where proj_id = ${p_id} and sprint_id = ${s_id} and board_id = ${b_id} and list_id = ${l_id}`;
   
    database.query(sql, function(err, results){

        res.render('show_issues', {title:'Issues', data:results});
    });
});


app.get('/create_sprint', function(req, res) {

    var p_id = req.query.p_id;

    res.render('sprint_form', {title:'Create Sprint', data:p_id});
});

app.get('/create_sprint_2', function(req, res) {

    var p_id = req.query.p_id;
    var name = req.query.name;
    
    let sql = `insert into sprints (proj_id, sprint_name) values (${p_id}, '${name}')`;

    database.query(sql, function(err, results){
        if (err) {
            alert('An Error Occured!');
        }
        else
        {
            alert('Successfully Created a Sprint!');
        }

        res.sendFile(__dirname + "/views/manager-project.html");
    });

});

app.get('/create_board', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;

    res.render('board_form', {title:'Create Board', p_id:p_id, s_id:s_id});
});

app.get('/create_board_2', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var name = req.query.name;
    
    let sql = `insert into boards (proj_id, sprint_id, board_title) values (${p_id}, ${s_id}, '${name}')`;

    database.query(sql, function(err, results){
        if (err) {
            
            alert('An Error Occured!');
        }
        else
        {
            alert('Successfully Created a Board!');
        }

        res.sendFile(__dirname + "/views/manager-project.html");
    });

});

app.get('/create_list', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var b_id = req.query.b_id;

    res.render('list_form', {title:'Create list', p_id:p_id, s_id:s_id, b_id: b_id});
});

app.get('/create_list_2', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var b_id = req.query.b_id;
    var name = req.query.name;
    
    let sql = `insert into lists (proj_id, sprint_id, board_id, list_title) values (${p_id}, ${s_id}, ${b_id}, '${name}')`;
    console.log(sql);
    database.query(sql, function(err, results){
        if (err) {
            
            alert('An Error Occured!');
        }
        else
        {
            alert('Successfully Created a List!');
        }

        res.sendFile(__dirname + "/views/manager-project.html");
    });

});

app.get('/create_list_2', function(req, res) {

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var b_id = req.query.b_id;
    var name = req.query.name;
    
    let sql = `insert into lists (proj_id, sprint_id, board_id, list_title) values (${p_id}, ${s_id}, ${b_id}, '${name}')`;
    console.log(sql);
    database.query(sql, function(err, results){
        if (err) {
            
            alert('An Error Occured!');
        }
        else
        {
            alert('Successfully Created a List!');
        }

        res.sendFile(__dirname + "/views/manager-project.html");
    });

});

app.get('/manager_tasks', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = `select * from issues where proj_id in (select proj_id from teams inner join proj_teams on teams.team_id = proj_teams.team_id where teams.team_lead = ${req.session.user}) and assigned_user_id is not null`;

        database.query(sql, function(err, results){
      
            res.render('show_assigned_tasks', {title:'Assigned Tasks', data:results});
        });
    }
    else if(op === '2')
    {
        let sql = `select * from issues where proj_id in (select proj_id from teams inner join proj_teams on teams.team_id = proj_teams.team_id where teams.team_lead = ${req.session.user}) and assigned_user_id is null`;

        database.query(sql, function(err, results){
      
            res.render('show_unassigned_tasks', {title:'Un-Assigned Tasks', data:results});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'manager-task.html')));
    }
});

app.get('/assign_task', function(req, res) {

    var t_id = req.query.t_id;
    var u_id = req.query.u_id;

    var p_id = req.query.p_id;
    var s_id = req.query.s_id;
    var l_id = req.query.l_id;
    var b_id = req.query.b_id;

    let sql = `UPDATE issues SET list_id= ${l_id}, board_id= ${b_id}, sprint_id = ${s_id}, proj_id = ${p_id}, assigned_user_id = ${u_id} WHERE issue_id = ${t_id}`;

    database.query(sql, function(err, results){
        if(err)
        {
            alert('An Error Occured!');
        }
        else
        {
            alert('Success');
        }

        res.sendFile((path.join(__dirname, 'views', 'manager-task.html')));

    });

});


app.get('/member_issues', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = `select * from issues where assigned_user_id = ${req.session.user}`;

        database.query(sql, function(err, results){
      
            res.render('show_member_issues', {title:'Assigned Issues', data:results});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'TeamMember-issue.html')));
    }
});

app.get('/member_projects', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = `select * from projects where proj_id in (select proj_id from proj_teams where team_id in (select team_id from team_members where user_id = ${req.session.user}))`;

        database.query(sql, function(err, results){
      
            res.render('show_member_projects', {title:'Assigned Projects', data:results});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'TeamMember-issue.html')));
    }
});

app.get('/customer_issue', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = `select * from issues where user_id = ${req.session.user}`;


        database.query(sql, function(err, results){
      
            res.render('customer_issues', {title:'Issues', data:results});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'customer-issue.html')));
    }
});

app.get('/create_issues', function(req, res) {

    var title = req.query.title;
    var desc = req.query.desc;
    var due = req.query.due;
    var priority = req.query.priority;
    var issue_status = req.query.issue_status;
    var issue_type = req.query.issue_type;
    var p_id = req.query.p_id;

    let sql = `insert into issues (title, issue_description, due_date, priority, issue_status, issue_type, user_id, proj_id) values('${title}', '${desc}', '${due}', '${priority}', '${issue_status}', '${issue_type}', ${req.session.user}, ${p_id})`
    
    database.query(sql, function(err, results){
        if(err)
        {
            alert('An error occured!');
        }
        else
        {
            alert('Success');
            res.sendFile((path.join(__dirname, 'views', 'customer-issue.html')));
    
        }
    });

    
});


app.get('/issue_detail', function(req, res) {

    var i_id = req.query.i_id;
    

    let sql = `select * from comments where issue_id = ${i_id}`;
   
    database.query(sql, function(err, results){
       
        res.render('show_comments', {title:'Issues', data:results});
    });
});


app.get('/customer_comments', function(req, res) {

    var op = req.query.project_options;
    
    
    if (op === '1')
    {
        let sql = `select * from comments where user_id = ${req.session.user}`;


        database.query(sql, function(err, results){
      
            res.render('show_customer_comment', {title:'Comments', data:results});
        });
    }
    else
    {
        alert('Select A Valid Option!');
        res.sendFile((path.join(__dirname, 'views', 'customer-comment.html')));
    }
});

app.get('/create_comment', function(req, res) {

    var txt = req.query.txt;
    var i_id = req.query.i_id;
    

    let sql = `insert into comments (comment_text, issue_id, user_id) values('${txt}', ${i_id}, ${req.session.user})`
    
    database.query(sql, function(err, results){
        if(err)
        {
            alert('An error occured!');
        }
        else
        {
            alert('Success');
            res.sendFile((path.join(__dirname, 'views', 'customer-issue.html')));
    
        }
    });

    
});


// select * from projects where proj_status = 'Completed';

// app.get('/customer_issues', function(req, res) {

//     let sql = "select * from issues where user_id = " + req.session.user;

//     database.query(sql, function(err, results){
//         res.send(results);
//     });

// });

// app.get('/customer_comments', function(req, res) {
    
//     let sql = "select * from comments where user_id = " + req.session.user;

//     database.query(sql, function(err, results){
//         res.send(results);
//     });
// });

// app.get('/team_projects', function(req, res) {
    
//     let sql = "select projects.proj_name, projects.proj_description, projects.start_date, projects.end_date, projects.proj_status from team_members inner join proj_teams on team_members.team_id = proj_teams.team_id inner join projects on projects.proj_id = proj_teams.proj_id where user_id = " + req.session.user;

//     database.query(sql, function(err, results){
//         res.send(results);
//     });
// });

// app.get('/team_issues', function(req, res) {
    
//     let sql = `select title, issue_description, due_date, issue_status, issue_type from issues where assigned_user_id = ${req.session.user}`;

//     database.query(sql, function(err, results){
//         res.send(results);
//     });
// });


// app.get('/manager_projects', function(req, res) {
    
//     let sql = `select projects.proj_name, projects.proj_description, projects.start_date, projects.end_date, projects.proj_status from projects inner join proj_teams on projects.proj_id = proj_teams. proj_id where proj_teams.team_id in (select team_id from teams where team_lead = ${req.session.user})`;

//     database.query(sql, function(err, results){
//         res.send(results);
//     });
// });

// app.get('/manager_tasks', function(req, res) {
    
//     let sql = `select title, issue_description, due_date, priority, issue_status, issue_type from issues where proj_id in (select  proj_id from proj_teams where team_id in (select team_id from teams where team_lead = ${req.session.user}))`;

//     database.query(sql, function(err, results){
//         res.send(results);
//     });
// });

module.exports = app;