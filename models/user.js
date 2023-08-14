
module.exports  = (sequelize,DataTypes)=>{

    const User = sequelize.define("User",{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        fullname:DataTypes.TEXT,
        email:DataTypes.STRING,
        phone:DataTypes.STRING,
        password:DataTypes.STRING,
        registrationNumber:DataTypes.STRING,
        department:DataTypes.STRING,
    },{
        sequelize,freezeTabelName:true,timestamps:true
    });


    User.associate =(models)=>{
        User.belongsTo(models.Stage);
        User.hasMany(models.Form);
        User.hasMany(models.Document);
        User.belongsTo(models.Session)
    }

    return User;
}