const mysql = require('promise-mysql');

function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "nodejs_database",
        multipleStatements: true
    });
}

exports.setupDatabase = async function (host = "localhost", user = "root", password = "") {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password
        });

        let queryCreateDatabase = "CREATE DATABASE nodejs_database";
        await connection.query(queryCreateDatabase);
        connection.end();

        connection = await getConnection();

        // http://www.dpriver.com/pp/sqlformat.htm
        let queryCreateTable = 'CREATE TABLE `foodstuffs`\n' +
            '  (\n' +
            '     `fs_id`    INT NOT NULL auto_increment,\n' +
            '     `fs_name`  VARCHAR(45) NOT NULL,\n' +
            '     `fs_price` INT NOT NULL,\n' +
            '     PRIMARY KEY (`fs_id`)\n' +
            '  );\n' +
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
        await connection.query(queryCreateTable);

        let queryInsertData = `INSERT INTO foodstuffs (fs_name, fs_price) VALUES ?; INSERT INTO orders (buyer_name, fs_id) VALUES ?`;
        let values1 = [['Pork', 50], ['Beef', 80], ['Chicken', 30], ['Salmon', 70]];
        let values2 = [['John', 1], ['Peter', 1], ['Amy', 3], ['Hannah', 1], ['Michael', 2], ['Sandy', 2], ['Betty', 1], ['Richard', 3], ['Susan', 4], ['Vicky', 2], ['Ben', 3], ['William', 1], ['Chuck', 4], ['Viola', 4]];
        await connection.query(queryInsertData, [values1, values2]);
    } catch (e) {
        throw e;
    } finally {
        if (connection)
            connection.end();
    }
};

exports.create = async function (name, price) {
    let connection;
    try {
        connection = await getConnection();
        let query = `INSERT INTO foodstuffs (fs_name, fs_price) VALUES ('${name}', '${price}')`;
        let result = await connection.query(query);
        return result.insertId;
    } catch (e) {
        throw e;
    } finally {
        if (connection)
            connection.end();
    }
};

exports.read = async function (tableName, id) {
    let connection;
    try {
        connection = await getConnection();
        let query = `SELECT * FROM ${tableName}` + (id ? ` WHERE fs_id = ${id}` : "");
        let result = await connection.query(query);
        return result.length === 0 ? await Promise.reject() : result;
    } catch (e) {
        throw e;
    } finally {
        if (connection)
            connection.end();
    }
};

exports.update = async function (id, updatedName, updatedPrice) {
    let connection;
    try {
        connection = await getConnection();
        let query = `UPDATE foodstuffs SET fs_name = '${updatedName}', fs_price = '${updatedPrice}' WHERE fs_id = '${id}'`;
        await connection.query(query);
    } catch (e) {
        throw e;
    } finally {
        if (connection)
            connection.end();
    }
};

exports.deleteSomething = async function (id) {
    let connection;
    try {
        connection = await getConnection();
        let query = `DELETE FROM foodstuffs WHERE fs_id = '${id}'`;
        let result = await connection.query(query);
        return result.affectedRows === 0 ? await Promise.reject() : result;
    } catch (e) {
        throw e;
    } finally {
        if (connection)
            connection.end();
    }
};