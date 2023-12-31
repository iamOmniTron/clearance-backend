const db = require("../models");
const {z} = require("zod");
const { isNullObject, hashPassword } = require("../utilities/helpers");
const {ethers,Contract}= require('ethers');
const ContractArtifacts = require("../abis/Clearance.json");

const CONTRACT_ADDRESS = ContractArtifacts.networks['5777'].address;
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');


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
        const t = await db.sequelize.transaction();
        const signer = await provider.getSigner();
        const mutations = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
        try{
            const userData = TypeSchema.userData.parse(req.body)

            const isUserExist = await db.User.findOne({where:{registrationNumber:userData.registrationNumber}});
            if(isUserExist) return res.json({
                success:false,
                message:"Student with Registration number already exists"
            })
            const hashedPassword = await hashPassword("12345678")
            const newUser = await db.User.create({...userData,password:hashedPassword},{transaction:t});
            const txResponse = await mutations.addUser(newUser.id,userData.StageId);
            const txReciept = await txResponse.wait();
            if(isNullObject(newUser)|| isNullObject(txReciept) || !txReciept.hash) return res.json({
                success:false,
                message:"Cannot register student"
            });
            await t.commit();
            return res.json({
                success:true,
                message:"Student Registered successfully"
            })
        }catch(err){
            await t.rollback()
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
            const user = await db.User.findOne({where:{id:userId},include:[{model:db.Session},{model:db.Stage,include:[{model:db.Stage,as:"prerequisiteStage"},{model:db.FormConfig},{model:db.DocumentConfig}]}]});
            return res.json({
                success:true,
                data:user
            })
        }catch(err){
            return next(err);
        }
    },
    deleteUser: async (req,res,next)=>{
        const t = await db.sequelize.transaction();
        const signer = await provider.getSigner();
        const mutations = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
        try {
            const userId = TypeSchema.userId.parse(req.params.userId);
            const isDeleted = await db.User.destroy({where:{id:userId}},{transaction:t});
            const txResponse = await mutations.deleteUser(+userId);
            const txReciept = await txResponse.wait();
            if(isDeleted < 1 || !txReciept.hash) return res.json({
                success:false,
                message:"Cannot delete Student"
            });
            await t.commit();
            return res.json({
                success:true,
                message:"Student deleted successfully"
            })
        } catch (error) {
            await t.rollback();
            return next(error)
        }
    },
    advanceUserStage: async (req,res,next)=>{
        const t = await db.sequelize.transaction();
        const signer = await provider.getSigner();
        const mutations = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
        try {
            const userId = TypeSchema.userId.parse(req.params.userId);
            const user = await db.User.findOne({where:{id:userId}});
            if(!user) return res.status(400).json({
                success:false,
                message:"Invalid User"
            });
            const stages = await db.Stage.findAll();
            const nextStageId = stages.find(({prerequisiteStageId:id})=>id === user.StageId).id;
            if(!nextStageId) return res.json({
                success:true,
                message:"User at final stage"
            })
            const isSaved = await db.User.update({StageId:nextStageId},{where:{id:userId}},{transaction:t})
            const txResponse = await mutations.proceedUser(+userId);
            const txReciept = await txResponse.wait();
            if(!isSaved || !txReciept.hash) return res.json({
                success:false,
                message:"Cannot proceed User Advancement"
            });
            await t.commit();
            return res.json({
                success:true,
                message:"User stage advanced"
            })
        } catch (error) {
            await t.rollback();
            return next(error)
        }
    },
    reverseUserStage: async (req,res,next)=>{
        const t = await db.sequelize.transaction();
        const signer = await provider.getSigner();
        const mutations = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
        try {
            const userId = TypeSchema.userId.parse(req.params.userId);
            const user = await db.User.findOne({where:{id:userId},include:[{model:db.Stage}]});
            if(!user) return res.status(400).json({
                success:false,
                message:"Invalid User" 
            });
            const stages = await db.Stage.findAll();
            const prevStageId = stages.find(({id})=>id === user.Stage.prerequisiteStageId).id;
            if(!prevStageId) return res.json({
                success:true,
                message:"User at Initial stage"
            })
            user.StageId = prevStageId;
            const isSaved = await db.User.update({StageId:prevStageId},{where:{id:userId}},{transaction:t})
            const txResponse = await mutations.revertUser(+userId);
            const txReciept = await txResponse.wait();
            if(!isSaved || !txReciept.hash) return res.json({
                success:false,
                message:"Cannot proceed User Stage reversal"
            });
            await t.commit();
            return res.json({
                success:true,
                message:"User stage reversed"
            })
        } catch (error) {
            await t.rollback();
            return next(error)
        }
    },
}