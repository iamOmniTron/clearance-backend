const { z } = require("zod");
const db = require("../models");
const { isNullObject } = require("../utilities/helpers");


const TypeSchema = {
    uploadForm: z.object({
        formType:z.string().min(1,"Form Type is required"),
        data:z.string().min(1,"Form content must not be empty")
    }),
    configId: z.string().min("Config ID is required"),
}



module.exports = {
    uploadForm : async (req,res,next)=>{
        try {   
            const {userId} = req;
            const formData = TypeSchema.uploadForm.parse(req.body);
            const newForm = await db.Form.create({...formType,UserId:userId,FormConfigId:formData.formType});
            if(isNullObject(newForm)) return res.json({
                success:false,
                message:"Error uploading form"
            })
            return res.json({
                success:true,
                message:"Form uploaded successfully"
            })
        } catch (error) {
            return next(error)
        }
    },
    deleteForm: async (req,res,next)=>{
        try {
            const configId = TypeSchema.configId.parse(req.params.configId);
            const isDeleted = await db.Form.destroy({where:{id:configId}});
            if(isDeleted < 1) return res.json({
                success:false,
                messsage:"Cannot delete form"
            })

            return res.json({
                success:true,
                message:'Form deleted successfully'
            })
        } catch (error) {
            return next(error)
        }
    }
}