const express = require("express");
const cors = require("cors");
const logger = require("morgan")
const router = require("./router");
const { ZodError } = require("zod");
const app = express();

require("./__dbinit")()

app.use(cors({origin:"http://localhost:3000"}));
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Prevent Caching Results
app.use("*",(_,res,next)=>{
    res.header("Cache-control","no-cache, no-store, must-revalidate");
    res.header("Pragma","no-cache");
    res.header("Expires",0);

    return next();
})

app.disable("etag");

app.use("/api",router);
app.use(express.static("./public"));

app.use((err,_,res,__)=>{
    console.log(JSON.stringify(err));
    if(err){
        if(err.name == "JsonWebTokenError"){
            return res.json({
                success:false,
                message:"User Unauthenticated"
            })
        }
        if(err instanceof ZodError){
            let msg = "";
            err.issues.forEach(e=>{
                msg +=`${e.message}, `
            })
            return res.json({
                success:false,
                message:msg
            })
        }
        if(err instanceof Error){
            return res.json({
                success:false,
                message:err.message
            })
        }
        return res.json({
            success:false,
            message:err
        })
    }
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
});


module.exports = app;