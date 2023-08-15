const { z } = require("zod");
const db = require("../models");
const { isNullObject } = require("../utilities/helpers");
const {mutations} = require("../contract");
const {ethers,Contract}= require('ethers');
const ContractArtifacts = require("../abis/Clearance.json");

const CONTRACT_ADDRESS = ContractArtifacts.networks['5777'].address;
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');


const TypeSchema = {
    uploadForm: z.object({
        formType:z.number().min(1,"Form Type is required"),
        data:z.string().min(1,"Form content must not be empty")
    }),
    configId: z.string().min("Config ID is required"),
}



module.exports = {
    uploadForm : async (req,res,next)=>{
        const t = await db.sequelize.transaction();
        const signer = await provider.getSigner();
        const mutations = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
        try {   
            const {userId} = req;
            const formData = TypeSchema.uploadForm.parse(req.body);
            const newForm = await db.Form.create({...formData,UserId:userId,FormConfigId:formData.formType},{transaction:t});
            const txResponse = await mutations.updateAction(+userId);
            const txReciept = await txResponse.wait();
            if(isNullObject(newForm) || !txReciept.hash) return res.json({
                success:false,
                message:"Error uploading form"
            })
            await t.commit();
            return res.json({
                success:true,
                message:"Form uploaded successfully"
            })
        } catch (error) {
            await t.rollback();
            return next(error)
        }
    },
    getAllForms: async (_,res,next)=>{
        try {
            const forms = await db.Form.findAll({include:[{model:db.User,required:true,include:[{model:db.Stage}]},{model:db.FormConfig}]});
            return res.json({
                success:true,
                data:forms
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