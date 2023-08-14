const db = require("./models");
const { hashPassword } = require("./utilities/helpers");

const {sequelize} = db;


module.exports = async()=>{
    try{
        console.log("Authenticating Database.../n")
        await sequelize.authenticate();
        console.log("Authenticated successfull, Awaiting connection.../n");
        await sequelize.sync();
        console.log("Database Connected successfully...")
        const pass = await hashPassword("12345678")
        await db.Admin.findOrCreate({where:{userId:"administrator"},defaults:{userId:"administrator",password:pass}})
    }catch(err){
        console.log(err);
        throw new Error(err?.message??"Database Error")
    }
}