



module.exports = (sequelize,DataTypes)=>{

    const DocumentConfig = sequelize.define("DocumentConfig",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        type:DataTypes.STRING,
        name:DataTypes.STRING
    },{
        sequelize,freezeTableName:true,timestamps:true
    });

    DocumentConfig.associate = (models)=>{
        DocumentConfig.hasMany(models.Stage);
        DocumentConfig.hasMany(models.Document);
        DocumentConfig.hasMany(models.Stage);
    }

    return DocumentConfig;
}