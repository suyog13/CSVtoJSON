
module.exports = (sequelize,Sequelize) =>{
    const Users = sequelize.define('users',{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.JSONB
        },
        additional_info: {
            type: Sequelize.JSONB
        },
    })
    return Users;
}