// католог с модулем для синхр. работы с MySQL, который должен быть усталовлен командой: sync-mysql
const dir_nms = 'C:\\nodejs\\node_modules\\sync-mysql';

// работа с базой данных.
const Mysql = require(dir_nms)
const connection = new Mysql({
    host:'localhost', 
    user:'root', 
    password:'', 
    database:'test'
})

// обработка параметров из формы.
var qs = require('querystring');
function reqPost (request, response) {
    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
			var post = qs.parse(body);
			var sInsert = "INSERT INTO myarttable (text, description, keywords) VALUES (\""+post['col1']+"\",\""+post['col2']+"\",\""+post['col3']+"\")";
			var results = connection.query(sInsert);
            console.log('Done. Hint: '+sInsert);
        });
    }
}

// выгрузка массива данных.
function ViewSelect(res) {
	var results = connection.query('SHOW COLUMNS FROM myarttable');
	res.write('<tr>');
	for(let i=0; i < results.length; i++)
		res.write('<td>'+results[i].Field+'</td>');
	res.write('</tr>');

	var results = connection.query('SELECT * FROM myarttable WHERE id>14 ORDER BY id DESC');
	for(let i=0; i < results.length; i++)
		res.write('<tr><td>'+String(results[i].id)+'</td><td>'+results[i].text+'</td><td>'+results[i].description+'</td><td>'+results[i].keywords+'</td></tr>');
}
function ViewVer(res) {
	var results = connection.query('SELECT VERSION() AS ver');
	res.write(results[0].ver);
}

// создание ответа в браузер, на случай подключения.
const http = require('http');
const server = http.createServer((req, res) => {
	reqPost(req, res);
	console.log('Loading...');
	
	res.statusCode = 200;
//	res.setHeader('Content-Type', 'text/plain');

	// чтение шаблока в каталоге со скриптом.
	var fs = require('fs');
	var array = fs.readFileSync(__dirname+'\\select.html').toString().split("\n");
	console.log(__dirname+'\\select.html');
	for(i in array) {
		// подстановка.
		if ((array[i].trim() != '@tr') && (array[i].trim() != '@ver')) res.write(array[i]);
		if (array[i].trim() == '@tr') ViewSelect(res);
		if (array[i].trim() == '@ver') ViewVer(res);
	}
	res.end();
	console.log('1 User Done.');
});

// запуск сервера, ожидание подключений из браузера.
const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
