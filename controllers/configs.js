const db = require("../models");
const {z} = require("zod");
const { isNullObject } = require("../utilities/helpers");

const TypeSchema = {
    formConfigData: z.object({
        name:z.string().min(1,"Invalid Config Name"),
        title: z.string().min(1,"Invalid Config Title"),
        fields:z.string().min(1,"Must not be an empty form")
    }),
    configId: z.string().min("Config ID is required"),
    documentConfigData: z.object({
        name:z.string().min(1,"Invalid Config Name"),
        type: z.string().min(1,"Invalid Document Type"),
    })
}

module.exports = {
    createFormConfig: async (req,res,next)=>{
        try {
            const configData = TypeSchema.formConfigData.parse(req.body);
            const newFormConfig = await db.FormConfig.create({...configData});
            if(isNullObject(newFormConfig)) return res.json({
                success:false,
                message:"Cannot create form config"
            })

            return res.json({
                success:true,
                message:"Config created successfully"
            })
        } catch (error) {
            return next(error)
        }
    },
    getAllFormConfigs : async (req,res,next)=>{
        try {
            const formConfigs = await db.FormConfig.findAll();
            return res.json({
                success:true,
                data:formConfigs
            })
        } catch (error) {
            return next(error)
        }
    },
    updateFormConfig: async (req,res,next)=>{
        try {
            const configId = TypeSchema.configId.parse(req.params.configId);
            const configData = TypeSchema.formConfigData.parse(req.body);
            const isUpdated = await db.FormConfig.update({...configData},{where:{id:configId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update config"
            })

            return res.json({
                success:true,
                message:"Config updated successfully"
            })
        } catch (error) {   
            return next(error);
        }
    },
    deleteFormConfig: async (req,res,next)=>{
        try {
            const configId = TypeSchema.configId.parse(req.params.configId);
            const isDeleted = await db.FormConfig.destroy({where:{id:configId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Cannot delete config"
            });
            return res.json({
                success:true,
                message:"config deleted successfully"
            })
        } catch (error) {
            return next(error)
        }
    },
    createDocumentConfig: async (req,res,next)=>{
        try {
            const configData = TypeSchema.documentConfigData.parse(req.body);
            const isCreated = await db.DocumentConfig.create({...configData});
            if(isNullObject(isCreated)) return res.json({
                success:false,
                message:"Error creating config"
            });
            return res.json({
                success:true,
                message:"Config created successfully"
            })
        } catch (error) {
            return next(error)
        }
    },
    getAllDocumentConfigs : async (req,res,next)=>{
        try {
            const documentConfigs = await db.DocumentConfig.findAll();
            return res.json({
                success:true,
                data:documentConfigs
            })
        } catch (error) {
            return next(error)
        }
    },
    updateDocumentConfig: async (req,res,next)=>{
        try{
            const configId = TypeSchema.configId.parse(req.params.configId);
            const configData = TypeSchema.documentConfigData.parse(req.body);
            const isUpdated = await db.DocumentConfig.update({...configData},{where:{id:configId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update config"
            })

            return res.json({
                success:true,
                message:"Config updated successfully"
            })
        }catch(err){
            return next(err)
        }
    },
    deleteDocumenConfig :async (req,res,next)=>{
        try {
            const configId = TypeSchema.configId.parse(req.params.configId);
            const isDeleted = await db.DocumentConfig.destroy({where:{id:configId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Cannot delete config"
            });
            return res.json({
                success:true,
                message:"config deleted successfully"
            })
        } catch (error) {
            return next(error)
        }
    }
}