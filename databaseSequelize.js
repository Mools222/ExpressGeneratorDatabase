const mysql = require('mysql2/promise');
const Sequelize = require('sequelize');

function getConnection() {
    return new Sequelize('nodejs_database', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
        define: {
            timestamps: false
        }
    });
}

function getFoodstuffsTable(sequelize) {
    return sequelize.define('foodstuffs', {
        fs_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fs_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fs_price: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}

exports.setupDatabase = async function (host = "localhost", user = "root", password = "") {
    let connection;
    let sequelize;
    try {
        connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password
        });

        let queryCreateDatabase = "CREATE DATABASE nodejs_database";
        await connection.query(queryCreateDatabase); // Create the database
        connection.end();

        sequelize = getConnection();

        const Foodstuffs = getFoodstuffsTable(sequelize); // Define the "foodstuffs" table

        const Orders = sequelize.define('orders', { // Define the "orders" table
            order_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            buyer_name: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });

        Orders.belongsTo(Foodstuffs, {foreignKey: 'fs_id'});

        await Foodstuffs.sync({force: true}); // Create the "foodstuffs" table
        await Foodstuffs.bulkCreate([{fs_name: 'Pork', fs_price: 50}, {fs_name: 'Beef', fs_price: 80}, {fs_name: 'Chicken', fs_price: 30}, {fs_name: 'Salmon', fs_price: 70}]); // Populate the "foodstuffs" table
        await Orders.sync({force: true}); // Create the "orders" table
        await Orders.bulkCreate([{buyer_name: 'John', fs_id: 1}, {buyer_name: 'Peter', fs_id: 1}, {buyer_name: 'Amy', fs_id: 3}, {buyer_name: 'Hannah', fs_id: 1}, {buyer_name: 'Michael', fs_id: 2},
            {buyer_name: 'Sandy', fs_id: 2}, {buyer_name: 'Betty', fs_id: 1}, {buyer_name: 'Richard', fs_id: 3}, {buyer_name: 'Susan', fs_id: 4}, {buyer_name: 'Vicky', fs_id: 2}, {buyer_name: 'Ben', fs_id: 3},
            {buyer_name: 'William', fs_id: 1}, {buyer_name: 'Chuck', fs_id: 4}, {buyer_name: 'Viola', fs_id: 4}]); // Populate the "orders" table
    } catch (e) {
        throw e;
    } finally {
        if (sequelize)
            await sequelize.close();
    }
};

exports.create = async function (name, price) {
    let sequelize;
    try {
        sequelize = getConnection();
        const Foodstuffs = getFoodstuffsTable(sequelize);
        let result = await Foodstuffs.create({
            fs_name: name,
            fs_price: price
        });
        return result.dataValues.fs_id; // Return the ID of the inserted row
    } catch (e) {
        throw e;
    } finally {
        if (sequelize)
            await sequelize.close();
    }
};

exports.read = async function (tableName, id) {
    let sequelize;
    try {
        sequelize = getConnection();
        const Foodstuffs = getFoodstuffsTable(sequelize);
        let result = await Foodstuffs.findAll((id ? {where: {fs_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject() : result; // Return a 404 error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    } finally {
        if (sequelize)
            await sequelize.close();
    }
};

exports.update = async function (id, updatedName, updatedPrice) {
    let sequelize;
    try {
        sequelize = getConnection();
        const Foodstuffs = getFoodstuffsTable(sequelize);
        await Foodstuffs.update(
            {fs_name: updatedName, fs_price: updatedPrice},
            {where: {fs_id: id}
        });
    } catch (e) {
        throw e;
    } finally {
        if (sequelize)
            await sequelize.close();
    }
};

exports.deleteSomething = async function (id) {
    let sequelize;
    try {
        sequelize = getConnection();
        const Foodstuffs = getFoodstuffsTable(sequelize);
        let result = await Foodstuffs.destroy({where: {fs_id: id}});
        return result === 0 ? await Promise.reject() : result;
    } catch (e) {
        throw e;
    } finally {
        if (sequelize)
            await sequelize.close();
    }
};
