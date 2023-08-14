



module.exports = (sequelize,DataTypes)=>{
    const FormConfig = sequelize.define("FormConfig",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
        title:DataTypes.STRING,
        fields:DataTypes.TEXT
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    FormConfig.associate = (models)=>{
    FormConfig.hasMany(models.Stage);
    FormConfig.hasMany(models.Form);
    }


    return FormConfig;
}