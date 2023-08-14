const { z } = require("zod");
const db = require("../models");


const TypeSchema = {
    sessionSchema: z.object({
        title:z.string().min(1,"Title is Required"),
        value:z.string().min(1,"Value is Required"),
        active:z.boolean(),
    }),
    sessionId: z.string().min(1,"Session ID is required")
}


module.exports = {
    createSession: async (req,res,next)=>{
        try {
            const sessionData = TypeSchema.sessionSchema.parse(req.body);
            const isCreated = await db.Session.create({...sessionData});
            if(!isCreated) return res.json({
                success:false,
                message:"Cannot create session "
            })
            return res.json({
                success:true,
                message:"Session created successfully"
            })
        } catch (error) {
            return next(error)
        }
    },
    updateSession: async (req,res,next)=>{
        try{
            const sessionId = TypeSchema.sessionId.parse(req.params.sessionId);
            const sessionData = TypeSchema.sessionSchema.parse(req.body);
            const isUpdated = await db.Session.update({...sessionData},{where:{id:sessionId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update Session Data"
            })

            return res.json({
                success:true,
                message:"Session Updated successfully"
            })
        }catch(err){
            return next(err)
        }
    },

    getSessions: async (_,res,next)=>{
        try{
            const sessions = await db.Session.findAll();
            return res.json({
                success:true,
                data:sessions
            })
        }catch(err){
            return next(err);
        }
    },
    deleteSession: async (req,res,next)=>{
        try {
            const sessionId = TypeSchema.sessionId.parse(req.params.sessionId);
            const isDeleted = await db.Session.destroy({where:{id:sessionId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Cannot delete session"
            });
            return res.json({
                success:true,
                message:"session deleted successfully"
            })
        } catch (error) {
            return next(error)
        }
    }
}