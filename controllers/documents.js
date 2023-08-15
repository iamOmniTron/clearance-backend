const { z } = require("zod");
const db = require("../models");
const { isNullObject } = require("../utilities/helpers");
const {ethers,Contract}= require('ethers');
const ContractArtifacts = require("../abis/Clearance.json");

const CONTRACT_ADDRESS = ContractArtifacts.networks['5777'].address;
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');


const TypeSchema = {
    documentConfigType: z.object({
        documentType: z.string().min(1,"Document Type id Required")
    })
}



module.exports = {
    uploadDocument: async (req,res,next)=>{
        const t = await db.sequelize.transaction();
        const signer = await provider.getSigner();
        const mutations = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
        try {
            const {userId} = req;
            const file = req.file;
            const documentUrl = file.path.replace(/\\/g, "/").substring(7);
            const {documentType} = TypeSchema.documentConfigType.parse(req.body);
            const isCreated = await db.Document.create({documentUrl,UserId:userId,DocumentConfigId:documentType},{transaction:t});
            const txResponse = await mutations.updateAction(+userId);
            const txReciept = await txResponse.wait();
            if(isNullObject(isCreated) || !txReciept.hash) return res.json({
                success:false,
                message:"Cannot upload document"
            })
            await t.commit();
            return res.json({
                success:true,
                message:"Uploaded successfully"
            })
        } catch (error) {
            await t.rollback();
            return next(error);
        }
    },
    getAllDocuments: async (_,res,next)=>{
        try {
            const documents = await db.Document.findAll({include:[{model:db.User,required:true,include:[{model:db.Stage}]},{model:db.DocumentConfig}]});
            return res.json({
                success:true,
                data:documents
            })
        } catch (error) {
            return next(error)
        }
    },
    deleteDocument: async (req,res,next)=>{
        try {
            const {configId} = req.params;
            const isDeleted = await db.Document.destroy({where:{id:configId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Cannot delete document"
            });

            return res.json({
                success:true,
                message:"document deleted successfully"
            })
        } catch (error) {
            return next(error)
        }
    }
}