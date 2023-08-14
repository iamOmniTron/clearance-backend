const db = require("../models");
const {z} = require("zod");
const { isNullObject, hashPassword } = require("../utilities/helpers");

const TypeSchema = {
    userData: z.object({
        fullname:z.string().min(1,"User Fullname is Required"),
        email:z.string().email("Invalid Email format"),
        phone:z.string().min(1,"User Phone Number is required"),
        registrationNumber:z.string().min(1,"Registration Number is Required"),
        department:z.string().min(1,"User Department is required"),
        StageId:z.number(),
        SessionId:z.number()
    }),
    userId: z.string().min(1,"User ID is required"),
    registrationNumber: z.string().min(1,"Student Registration Number is Required")
}



module.exports = {
    registerUser: async (req,res,next)=>{
        try{
            const userData = TypeSchema.userData.parse(req.body)

            const isUserExist = await db.User.findOne({where:{registrationNumber:userData.registrationNumber}});
            if(isUserExist) return res.json({
                success:false,
                message:"Student with Registration number already exists"
            })
            const hashedPassword = await hashPassword("12345678")
            const newUser = await db.User.create({...userData,password:hashedPassword});
            if(isNullObject(newUser)) return res.json({
                success:false,
                message:"Cannot register student"
            });

            return res.json({
                success:true,
                message:"Student Registered successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateUser: async (req,res,next)=>{
        try{
            const userId = TypeSchema.userId.parse(req.params.userId);
            const userData = TypeSchema.userData.parse(req.body);
            const isUpdated = await db.User.update({...userData},{where:{id:userId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update Student Data"
            })

            return res.json({
                success:true,
                message:"Student Updated successfully"
            })
        }catch(err){
            return next(err)
        }
    },
    getUsers: async (_,res,next)=>{
        try {
            const users = await db.User.findAll({include:[{model:db.Stage},{model:db.Session}]});
            return res.json({
                success:true,
                data:users
            })
        } catch (error) {
            return next(error)
        }
    },
    getUser: async (req,res,next)=>{
        try{
            const registrationNumber = TypeSchema.registrationNumber.parse(req.params.registrationNumber);
            const user = await db.User.findOne({where:{registrationNumber},include:[{model:db.Session},{model:db.Stage}]});
            return res.json({
                success:true,
                data:user
            })
        }catch(err){
            return next(err);
        }
    },
    profile: async (req,res,next)=>{
        try{
            const {userId,isAdmin} = req;
            if(!userId || userId === null) return res.status(403).json({
                success:false,
                message:"Unauthenticated"
            });

            if(isAdmin){
                const adminUser = await db.Admin.findOne({where:{id:userId}});
                if(!adminUser || isNullObject(adminUser)) return res.json({success:false,message:"Unauthenticated"});
                return res.json({
                    success:true,
                    data:adminUser
                })
            }
            const user = await db.User.findOne({where:{userId}});
            return res.json({
                success:true,
                data:user
            })
        }catch(err){
            return next(err);
        }
    },
    deleteUser: async (req,res,next)=>{
        try {
            const userId = TypeSchema.userId.parse(req.params.userId);
            const isDeleted = await db.User.destroy({where:{id:userId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Cannot delete Student"
            });

            return res.json({
                success:true,
                message:"Student deleted successfully"
            })
        } catch (error) {
            return next(error)
        }
    }
}