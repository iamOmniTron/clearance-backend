const { decodeUserToken } = require("../utilities/helpers");


module.exports = {
    auth: async (req,_,next)=>{
        try{
            const authHeader = req.headers["authorization"];
            if(!authHeader || typeof authHeader !== "string") return next("Unauthenticated");
            const token = authHeader.split(" ")[1];
            if(!token || typeof token !== "string") return next("Unauthenticated");
            const {userId,isAdmin} = decodeUserToken(token);
            req.userId = userId;
            req.isAdmin = isAdmin;
            return next();
        }catch(err){
            return next(err);
        }
    }
}