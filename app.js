/*
Author: Justin Winningham
Filename: app.js
Date: 4/30/2014
All rights reserved
*/

// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    ejs        = require('ejs'),
    connect    = require('connect'),
    http       = require('http');

// Application Variable initialization
// Database login Information

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'jwinningham',
        password : '3993878'
    });

var app = express();

var routes = require('./controller/index');

// Init Config
app.use(connect.urlencoded());
app.use(connect.json());
app.use(connect.bodyParser());
app.use(express.static('public'));


// Template / View Init

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

// Database Creation

connection.query('CREATE DATABASE IF NOT EXISTS jwinningham', function (err) {
    if (err) throw err;
    connection.query('USE jwinningham', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30)'
            +  ')', function (err) {
                if (err) throw err;
            });
    });
});

app.get('/members', function(req, res) {
    var qry = "select * from members where active = true ORDER BY Joined ASC";
    connection.query(qry,
                     function(err, result) {
                         console.log('---Fetching Active Members---'); //result                                                                                                   
                         if(typeof result != 'undefined') {
                             var RESPONSE = '<html><head><title>404th - Members</title>'
                             RESPONSE +='<link rel="stylesheet" type="text/css" href="css/members.css">'
                             RESPONSE +='</head><body><div id="title">Active Members</div><br>';
                             RESPONSE += '<table id="memtable">';
                             for(var i=0; i < result.length; i++) {
                                 RESPONSE += '<tr><td>' + result[i].username + '</td><td>'
                                     + result[i].rank +'</td><td>' + result[i].Joined + '</td></tr>';
                             }
                             RESPONSE += '</table><br><div id="notice"><p>If you are an active member,'
                             RESPONSE += 'and you dont see your name here</p><p>please contact daxx'
                             RESPONSE += ' on steam (daxzoth)</p></div></body><footer>'
                             RESPONSE += '<div id="foot"><p>Copyright Justin Winningham 2014</p></div>'
                             RESPONSE += '</footer></html>';
                             res.send(RESPONSE);
                         }
                         else{
                             res.send("User DNE");
                         }
                     });
});

// Primary Database Insert (aka apply)

app.post('/apply', function(req, res) {
    connection.query('INSERT INTO members values("'+ req.body.name +'", false, "Recruit", default,"'+ req.body.age + '", default,"' + req.body.pass + '") ON DUPLICATE KEY UPDATE username=username;',
		     function(err, result) {
			 if(err) throw err;
			 res.send('<div id="applied">Thank you for applying ' + req.body.name + ', you will be contaced through steam shortly!</div>');
			 console.log('---------- SOMEBODY HAS APPLIED ----------');
		     });
    connection.query('INSERT INTO merits (username) values("' + req.body.name + '") ON DUPLICATE KEY update username=username;');
});

// Login Page

app.post('/login', function (req, res) {
    var post = req.body;
    if (post.name === 'Daxx' && post.pass === 'gamecube') {
	console.log("Daxx has logged in to admin pannel");
	res.redirect('/admin54ywhtry');
    } else if(post.name === 'Panicsferd' && post.pass === '373371') {
	console.log("Panicsferd has logged into admin pannel");
	res.redirect('admin54ywhtry');
    } else if (post.name === 'test' && post.pass === 'test') {
	console.log("Test Admin Logged into admin pannel");
	res.redirect('admin54ywhtry');
    } else {
	res.send('Bad user/pass');
    }
});


/* TESTING AREA */





/* END TEST AREA */


/*****************************/
/*    ADMIN CONTROL START    */
/*****************************/

// Update selected Member

app.post('/admin/up', function (req, res) {
    console.log("Admin Updated a record... Updating Member/Merit information");
    var qry = 'update members set username = "' + req.body.newname + '", active=1 where username = "' + req.body.oldname + '";';
    var alt_qry = 'update members set active=1 where username = "' + req.body.oldname + '";';
    if(req.body.activestate === "false") {
	var qry = 'update members set username = "' + req.body.newname + '", active=0 where username = "' + req.body.oldname + '";';
	var alt_qry = 'update members set active=0 where username = "' + req.body.oldname + '";';
    }
    if( !req.body.newname != "" || req.body.oldname === req.body.newname)
    {
	connection.query(alt_qry);
	console.log('Update: "' + req.body.oldname + '" was updated, username unchanged.');
    }
    else
    {
	connection.query(qry);
	console.log('Update: "' + req.body.oldname + '" username changed to: "' + req.body.newname +'".');
    }
    res.send('<div id="updatesuccess">User successfully Updated.</div>');
});

// Delete selected user

app.post('/admin/del', function (req, res) {
    var qry = 'delete from members where username = "' + req.body.name + '" and rank !="Commander";';
    if(req.body.verify === 'off')
    {
	console.log('User deletion attempt failed - not verified');
	res.send("TEST");
    }
    else
    {
	console.log("************* WARNING! USER: " + req.body.name + " HAS BEEN DELETED *************");
	connection.query(qry);
    }
    res.send('<div id="userdeleted">' + req.body.name + ' has been deleted.');
});

// Fill update dropdown with existing members

// This one for the delete user selection box

app.post('/admin2', function(req, res) {
    connection.query('select username from members',
		     function(err, result) {
			 var responseHTML2 = '<select id="user-list2">';
                         for (var i=0; result.length > i; i++) {
                             var option = '<option value="' + result[i].username + '">' + result[i].username + '</option>';
                             responseHTML2 += option;
                         }
                         responseHTML2 += '</select>';
                         res.send(responseHTML2);
                     });
});

// This one for the update user selection box

app.post('/admin', function (req, res) {
    connection.query('select username from members', 
		     function (err, result) {
			 var responseHTML = '<select id="user-list">';
			 for (var i=0; result.length > i; i++) {
			     var option = '<option value="' + result[i].username + '">' + result[i].username + '</option>';
			     responseHTML += option;
			 }
			 responseHTML += '</select>';
			 res.send(responseHTML);
		     });
});



/*****************************/
/*     ADMIN CONTROL END     */
/*****************************/

// Begin Listening

//Routing
app.use('/', routes);

app.set('port', 8028);
app.listen(app.get('port'));
console.log("Express server listening on port", app.get('port'));
