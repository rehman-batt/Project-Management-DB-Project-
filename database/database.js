const mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	database : 'PWB',
	user : 'root',
	password : 'qazwsxedcrfvtgbyhnujmikolp'
});

connection.connect(function(error){
	if(error) throw error;
		console.log('MySQL Database is connected Successfully');
});

module.exports = connection;