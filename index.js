var config = require('./config.json');
var mysql = require('mysql');
var http = require('http');

var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

connection.connect();

var server = http.createServer(function (request, response) {
  connection.query('show global status where variable_name="wsrep_local_state"', function(err, rows, fields) {
    if (err) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.end('Internal Server Error');
      return;
    }

    if (rows.length < 1) {
      response.writeHead(503, {"Content-Type": "text/plain"});
      response.end('Server Down');
    }

    var row = rows[0];

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end(row);
  });
});

server.listen(9200);