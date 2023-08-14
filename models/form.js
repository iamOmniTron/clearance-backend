



module.exports = (sequelize,DataTypes)=>{
    const Form = sequelize.define("Form",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        data:DataTypes.TEXT
    },sequelize,{freezeTableName:true,timestamps:true});


    Form.associate =(models)=>{
        Form.belongsTo(models.User);
        Form.belongsTo(models.FormConfig);
    }

    return Form;
}