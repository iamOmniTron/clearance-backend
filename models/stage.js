




module.exports = (sequelize,DataTypes)=>{
    const Stage = sequelize.define("Stage",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
        isIndex:DataTypes.BOOLEAN,
        label:DataTypes.STRING,
        isForm:DataTypes.BOOLEAN,
        isUpload:DataTypes.BOOLEAN
    },{
        sequelize,freezeTableName:true,timestamps:true
    });

    Stage.associate = (models)=>{
        Stage.belongsTo(models.FormConfig);
        Stage.hasMany(models.User);
        Stage.belongsTo(models.DocumentConfig);
        Stage.belongsTo(models.Stage,{
            as:"prerequisiteStage",
            foreignKey:"prerequisiteStageId",
            constraints:false
        })
    }

    return Stage;
}