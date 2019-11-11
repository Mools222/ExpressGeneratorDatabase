const mysql = require('mysql');

function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodejs_database",
        multipleStatements: true
    });
}

exports.createDatabase = function (host, user, password) {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection({
            host: host,
            user: user,
            password: password
        });

        connection.connect(function (err) {
            if (err)
                return reject(err);

            connection.query("CREATE DATABASE nodejs_database", function (err, result) {
                if (err)
                    return reject(err);

                console.log("Database created");
                connection.end();
                createTables(resolve, reject);
            });
        });
    });
};

// createDatabase();

function createTables(resolve, reject) {
    let connection = getConnection();

    connection.connect(function (err) {
        if (err)
            return reject(err);

        // http://www.dpriver.com/pp/sqlformat.htm
        let query = 'CREATE TABLE `foodstuffs`\n' +
            '  (\n' +
            '     `fs_id`    INT NOT NULL auto_increment,\n' +
            '     `fs_name`  VARCHAR(45) NOT NULL,\n' +
            '     `fs_price` INT NOT NULL,\n' +
            '     PRIMARY KEY (`fs_id`)\n' +
            '  );\n' +
            '\n' +
            'CREATE TABLE `orders`\n' +
            '  (\n' +
            '     `order_id`   INT NOT NULL auto_increment,\n' +
            '     `buyer_name` VARCHAR(45) NOT NULL,\n' +
            '     `fs_id`      INT NOT NULL,\n' +
            '     PRIMARY KEY (`order_id`),\n' +
            '     KEY `fkidx_11` (`fs_id`),\n' +
            '     CONSTRAINT `fk_11` FOREIGN KEY `fkidx_11` (`fs_id`) REFERENCES `foodstuffs`\n' +
            '     (`fs_id`)\n' +
            '  );';

        connection.query(query, function (err, results, fields) {
            if (err)
                return reject(err);

            console.log("Tables created");
            connection.end();
            insertData(resolve, reject);
        });
    });
}

function insertData(resolve, reject) {
    let connection = getConnection();

    connection.connect(function (err) {
        if (err)
            return reject(err);

        let query = `INSERT INTO foodstuffs (fs_name, fs_price) VALUES ?; INSERT INTO orders (buyer_name, fs_id) VALUES ?`;
        let values1 = [['Pork', 50], ['Beef', 80], ['Chicken', 30], ['Salmon', 70]];
        let values2 = [['John', 1], ['Peter', 1], ['Amy', 3], ['Hannah', 1], ['Michael', 2], ['Sandy', 2], ['Betty', 1], ['Richard', 3], ['Susan', 4], ['Vicky', 2], ['Ben', 3], ['William', 1], ['Chuck', 4], ['Viola', 4]];

        connection.query(query, [values1, values2], function (err, result) {
            if (err)
                return reject(err);

            console.log("Number of records inserted into the table 'foodstuffs': " + result[0].affectedRows);
            console.log("Number of records inserted into the table 'orders': " + result[1].affectedRows);
            connection.end();
            resolve();
        });
    });
}

exports.create = function (name, price) {
    return new Promise((resolve, reject) => {
        let connection = getConnection();

        connection.connect(function (err) {
            if (err)
                return resolve(err);

            let sql = `INSERT INTO foodstuffs (fs_name, fs_price) VALUES ('${name}', '${price}')`;

            connection.query(sql, function (err, result, fields) {
                if (err)
                    return resolve(err);

                connection.end();
                resolve(result.insertId);
            });
        });
    });
};

exports.read = function (tableName, id) {
    return new Promise((resolve, reject) => {
        let connection = getConnection();

        connection.connect(function (err) {
            if (err)
                return reject(err);

            let query = `SELECT * FROM ${tableName}` + (id ? ` WHERE fs_id = ${id}` : "");

            connection.query(query, function (err, result, fields) {
                if (err)
                    return reject(err);

                if (result.length === 0)
                    return reject();

                connection.end();
                resolve(result);
            });
        });
    });
};

exports.update = function (id, updatedName, updatedPrice) {
    return new Promise((resolve, reject) => {
        let connection = getConnection();

        connection.connect(function (err) {
            if (err)
                return reject(err);

            let query = `UPDATE foodstuffs SET fs_name = '${updatedName}', fs_price = '${updatedPrice}' WHERE fs_id = '${id}'`;

            connection.query(query, function (err, result, fields) {
                if (err)
                    return reject(err);

                connection.end();
                resolve();
            });
        });
    });
};

exports.deleteSomething = function (id) {
    return new Promise((resolve, reject) => {
        let connection = getConnection();

        connection.connect(function (err) {
            if (err)
                return reject(err);

            let query = `DELETE FROM foodstuffs WHERE fs_id = '${id}'`;

            connection.query(query, function (err, result, fields) {
                if (err)
                    return reject(err);

                if (result.affectedRows === 0)
                    return reject();

                connection.end();
                resolve();
            });
        });
    });
};