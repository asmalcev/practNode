const mysql = require('mysql2/promise');
const qs = require('querystring');
const fs = require('fs');

const TABLE_NAME = 'myarttable';

async function main() {
    // работа с базой данных.
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test',
        password: 'rootpass',
    });

    const result = await connection.query(`SHOW TABLES LIKE '${TABLE_NAME}';`);
    if (result[0].length < 1) {
        console.log('NO TABLES');

        const sqlScript = fs.readFileSync(__dirname + '/import_test.sql').toString();

        for (const script of sqlScript.split(';')) {
            await connection.query(script);
        }

    } else {
        console.log('HERE ARE TABLES', result[0]);
    }

    const version = (await connection.query('SELECT VERSION() AS ver'))[0][0].ver;

    // обработка параметров из формы.
    async function reqPost(request, response) {
        if (request.method == 'POST') {
            var body = '';

            request.on('data', function (data) {
                body += data;
            });

            request.on('end', async function () {
                var post = qs.parse(body);
                var sInsert =
                    `INSERT INTO ${TABLE_NAME} (text, description, keywords) VALUES ("` +
                    post['col1'] +
                    '","' +
                    post['col2'] +
                    '","' +
                    post['col3'] +
                    '")';
                var results = await connection.query(sInsert);
                console.log('Done. Hint: ' + sInsert);
            });
        }
    }

    // выгрузка массива данных.
    async function ViewSelect(res) {
        const columns = (await connection.query(`SHOW COLUMNS FROM ${TABLE_NAME}`))[0];

        res.write('<tr>');
        for (let i = 0; i < columns.length; i++)
            res.write('<td>' + columns[i].Field + '</td>');
        res.write('</tr>');

        const data = (await connection.query(
            `SELECT * FROM ${TABLE_NAME} WHERE id>14 ORDER BY id DESC`
        ))[0];

        for (let i = 0; i < data.length; i++)
            res.write(
                '<tr><td>' +
                    String(data[i].id) +
                    '</td><td>' +
                    data[i].text +
                    '</td><td>' +
                    data[i].description +
                    '</td><td>' +
                    data[i].keywords +
                    '</td></tr>'
            );
    }

    async function ViewVer(res) {
        res.write(version);
    }

    // создание ответа в браузер, на случай подключения.
    const http = require('http');
    const server = http.createServer(async (req, res) => {
        reqPost(req, res);
        console.log('Loading...');

        res.statusCode = 200;

        // чтение шаблока в каталоге со скриптом.
        var array = fs
            .readFileSync(__dirname + '/select.html')
            .toString()
            .split('\n');
        console.log(__dirname + '/select.html');

        for (i in array) {
            // подстановка.
            if (array[i].trim() != '@tr' && array[i].trim() != '@ver')
                res.write(array[i]);

            if (array[i].trim() == '@tr') await ViewSelect(res);
            if (array[i].trim() == '@ver') await ViewVer(res);
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
}

main();
