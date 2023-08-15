const { z } = require("zod");
const db = require("../models");
const { isNullObject } = require("../utilities/helpers");
const {mutations} = require("../contract");


const TypeSchema = {
    createStage: z.object({
        name:z.string().min(1,"Name is required"),
        isIndex:z.boolean(),
        label:z.string().min(1,"Stage Label is Required"),
        isForm:z.boolean(),
        isUpload:z.boolean(),
        formType:z.number().nullable(),
        documentType:z.number().nullable(),
        previousStage:z.number().nullable()
    }),
    stageId: z.string().min(1,"Stage ID is required")
}


module.exports = {
    // CREATE BLOCKCHAIN TRANSACTION
    addStage: async (req,res,next)=>{
        try {
            const stageData = TypeSchema.createStage.parse(req.body);
            const newStage = await db.Stage.create({...stageData,FormConfigId:stageData.formType,DocumentConfigId:stageData.documentType,prerequisiteStageId:stageData.previousStage,prerequisiteStage:stageData.previousStage});
            const txResponse = mutations.addStage(newStage.id,stageData.name,newStage.previousStage??0);
            const txReciept = txResponse.wait();
            if(isNullObject(newStage || !txReciept.hash)) return res.json({
                success:false,
                message:"Cannot create stage"
            })
            return res.json({
                success:true,
                message:"Stage created successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    getStages: async (_,res,next)=>{
        try {
            const stages = await db.Stage.findAll({include:[{model:db.Stage,as:"prerequisiteStage"}]});
            return res.json({
                success:true,
                data:stages
            })
        } catch (error) {
            return next(error)
        }
    },
    updateStage: async (req,res,next)=>{
        try {
            const stageId = TypeSchema.stageId.parse(req.params.stageId);
            const stageData = TypeSchema.createStage.parse(req.body);
            const isUpdated = await db.Stage.update({...stageData,FormConfigId:stageData.formType,DocumentConfigId:stageData.documentType,prerequisiteStage:stageData.previousStage},{id:stageId});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update stage"
            })

            return res.json({
                success:true,
                message:"Stage updates successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    deleteStage: async (req,res,next)=>{
        try{
            const stageId = TypeSchema.stageId.parse(req.params.stageId);
            const isDeleted = await db.Stage.destroy({where:{id:stageId}});
            const txResponse = mutations.deleteStage(+stageId);
            const txReciept = txResponse.wait();
            if(isDeleted < 1 || !txReciept.hash) return res.json({
                success:false,
                message:"Cannot delete stage"
            })

            return res.json({
                success:true,
                message:"Stage Deleted successfully"
            })
        }catch(err){
            return next(err);
        }
    }
}