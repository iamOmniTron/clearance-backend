

module.exports = (sequelize,DataTypes)=>{
    const Admin = sequelize.define("Admin",{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        userId:DataTypes.STRING,
        password:DataTypes.STRING
    },{
        freezeTableName:true,timestamps:true,sequelize
    });

    return Admin;
}