




module.exports = (sequelize,DataTypes)=>{
    const Session = sequelize.define("Session",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        title:DataTypes.STRING,
        value:DataTypes.STRING,
        active:DataTypes.BOOLEAN
    },{
        sequelize,freezeTableName:true,timeStamps:true
    })

    Session.associate = (models)=>{
        Session.hasMany(models.User);
    }


    return Session;
}