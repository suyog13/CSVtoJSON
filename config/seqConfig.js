const Sequelize = require('sequelize');
const db = require('./dbconfig');
const Op = Sequelize.Op;

const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    dialect: db.dialect,
    port: db.port,
    pool: {
        max: db.pool.max,
        min: db.pool.minmin,
        acquire: db.pool.acquire,
        idle: db.pool.idle
    },
    define: {
        timestamps: db.define.timestamps
    },
    logging: false,  //Prevent Sequelize from outputting SQL to the console on execution of query
    operatorsAliases: {
        $eq: Op.eq,
        $ne: Op.ne,
        $gte: Op.gte,
        $gt: Op.gt,
        $lte: Op.lte,
        $lt: Op.lt,
        $not: Op.not,
        $in: Op.in,
        $notIn: Op.notIn,
        $is: Op.is,
        $like: Op.like,
        $notLike: Op.notLike,
        $iLike: Op.iLike,
        $notILike: Op.notILike,
        $regexp: Op.regexp,
        $notRegexp: Op.notRegexp,
        $iRegexp: Op.iRegexp,
        $notIRegexp: Op.notIRegexp,
        $between: Op.between,
        $notBetween: Op.notBetween,
        $overlap: Op.overlap,
        $contains: Op.contains,
        $contained: Op.contained,
        $adjacent: Op.adjacent,
        $strictLeft: Op.strictLeft,
        $strictRight: Op.strictRight,
        $noExtendRight: Op.noExtendRight,
        $noExtendLeft: Op.noExtendLeft,
        $and: Op.and,
        $or: Op.or,
        $any: Op.any,
        $all: Op.all,
        $values: Op.values,
        $col: Op.col
    }
});

const models = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    users: require('../model/users')(sequelize, Sequelize),
};

module.exports = models;