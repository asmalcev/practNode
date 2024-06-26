const mysql = require('mysql2/promise');
const qs = require('querystring');
const fs = require('fs');

const TABLE_NAME = 'individual';

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test',
        password: 'rootpass',
    });

    const execFile = async (pathToFile) => {
        const sqlScript = fs.readFileSync(__dirname + pathToFile).toString();

        for (const script of sqlScript.split(';')) {
            if (script.trim() === '') continue;
            await connection.query(script);
        }
    };

    const result = await connection.query(`SHOW TABLES LIKE '${TABLE_NAME}';`);
    if (result[0].length < 1) {
        await execFile('/db_init_lab1.sql');
    }

    const version = (await connection.query('SELECT VERSION() AS ver'))[0][0]
        .ver;
    const columns = (
        await connection.query(`SHOW COLUMNS FROM ${TABLE_NAME}`)
    )[0];

    // обработка параметров из формы.
    async function reqPost(request, response) {
        if (request.method == 'POST') {
            var body = '';

            request.on('data', function (data) {
                body += data;
            });

            request.on('end', async function () {
                var post = qs.parse(body);

                const cols = columns.map((col) => col.Field).join(', ');
                const values = columns
                    .map((_, i) => `"${post[`col${i + 1}`]}"`)
                    .join(', ');

                var sInsert = `INSERT INTO ${TABLE_NAME} (${cols}) VALUES (${values})`;
                var results = await connection.query(sInsert);
                console.log('Done. Hint: ' + sInsert);
            });

            response.setHeader('Refresh', '2;url=http://127.0.0.1:3000');
        }
    }

    // выгрузка массива данных.
    async function ViewSelect(res) {
        res.write('<tr>');
        for (let i = 0; i < columns.length; i++)
            res.write('<td>' + columns[i].Field + '</td>');
        res.write('</tr>');

        const data = (
            await connection.query(
                `SELECT * FROM ${TABLE_NAME} ORDER BY id DESC`
            )
        )[0];

        for (let i = 0; i < data.length; i++) {
            res.write(
                `<tr>${Object.entries(data[i])
                    .map(([key, value]) => `<td>${value}</td>`)
                    .join('')}</tr>`
            );
        }
    }

    // выгрузка массива данных.
    async function Inputs(res) {
        for (let i = 0; i < columns.length; i++) {
            res.write(
                `<label>${columns[i].Field} <input type="text" name="col${
                    i + 1
                }" placeholder="${columns[i].Type}" /></label><br>`
            );
        }
    }

    async function ViewVer(res) {
        res.write(version);
    }

    // создание ответа в браузер, на случай подключения.
    const http = require('http');
    const server = http.createServer(async (req, res) => {
        await reqPost(req, res);
        console.log('Loading...');

        res.statusCode = 200;

        // чтение шаблока в каталоге со скриптом.
        var array = fs
            .readFileSync(__dirname + '/select2.html')
            .toString()
            .split('\n');
        console.log(__dirname + '/select.html');

        for (i in array) {
            const word = array[i].trim();

            if (word === '@cols') {
                await Inputs(res);
                continue;
            }
            if (word === '@tr') {
                await ViewSelect(res);
                continue;
            }
            if (word === '@ver') {
                await ViewVer(res);
                continue;
            }

            res.write(array[i]);
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
