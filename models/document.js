




module.exports = (sequelize,DataTypes)=>{
    const Document = sequelize.define("Document",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        documentUrl:DataTypes.STRING,
    },{
        sequelize,freezeTableName:true,timestamps:true
    });



    Document.associate = (models)=>{
        Document.belongsTo(models.User);
        Document.belongsTo(models.DocumentConfig);
    }


    return Document;
}