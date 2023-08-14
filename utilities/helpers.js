require("dotenv").config();
const {hash,compare} = require("bcrypt");
const {sign,verify} = require("jsonwebtoken");
const {ONE_DAY} = require("./defaults");
const multer = require("multer");


const storage =  multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "./public/documents")
        },
        filename: function (_, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
      })



module.exports = {
    genUserAuthToken: (userId,isAdmin)=>sign({userId,isAdmin},process.env.SECRET_KEY,{expiresIn:ONE_DAY}),
    decodeUserToken:(token)=>verify(token,process.env.SECRET_KEY),
    hashPassword:async(password)=> await hash(password,10),
    isPassMatched:async(password,encrypted)=>await compare(password,encrypted),
    parseURLParam:(qs)=>Object.fromEntries(new URLSearchParams(qs))??{},
    isNullObject:(obj)=>Object.keys(obj) < 1,
    upload:multer({storage})
}