const express = require("express");
const { auth } = require("../middlewares");
const { registerUser, getUsers, deleteUser, updateUser, getUser, profile } = require("../controllers/user");
const { loginUser, loginAdmin } = require("../controllers/auth");
const { createFormConfig, createDocumentConfig, getAllFormConfigs, getAllDocumentConfigs, updateFormConfig, updateDocumentConfig, deleteFormConfig, deleteDocumenConfig } = require("../controllers/configs");
const { uploadForm, deleteForm } = require("../controllers/forms");
const { upload } = require("../utilities/helpers");
const { deleteDocument } = require("../controllers/documents");
const { addStage, getStages, updateStage, deleteStage } = require("../controllers/stage");
const { createSession, getSessions, updateSession, deleteSession } = require("../controllers/session");


const router = express.Router();



// AUTH
router.post("/login",loginUser);
router.post("/admin/login",loginAdmin);

// USERS
router.post("/student/register",auth,registerUser);
router.get("/student/get-all",auth,getUsers);
router.delete("/student/delete/:userId",auth,deleteUser);
router.put("/student/update/:userId",auth,updateUser);
router.get("/student/find/:registrationNumber",getUser);
router.get("/profile",auth,profile);

// CONFIGS
router.post("/config/form/create",auth,createFormConfig);
router.post("/config/document/create",auth,createDocumentConfig);
router.get("/config/form/get-all",auth,getAllFormConfigs);
router.get("/config/document/get-all",auth,getAllDocumentConfigs);
router.put("/config/form/update/:configId",auth,updateFormConfig);
router.put("/config/document/update/:configId",auth,updateDocumentConfig);
router.delete("/config/form/delete/:configId",auth,deleteFormConfig);
router.delete("/config/document/delete/:configId",auth,deleteDocumenConfig);


// FORM
router.post("/form/upload",auth,uploadForm);
router.delete("/form/delete/:configId",auth,deleteForm);

//DOCUMENT
router.post("/documet/upload",auth,upload.single("document"),uploadForm);
router.delete("/document/delete/:configId",auth,deleteDocument); 

// STAGE
router.post("/stage/create",auth,addStage);
router.get("/stage/get-all",auth,getStages);
router.put("/stage/update/:stageId",auth,updateStage);
router.delete("/stage/delete/:stageId",auth,deleteStage);


// SESSIONS
router.post("/session/create",auth,createSession);
router.get("/session/get-all",auth,getSessions);
router.put("/session/update/:sessionId",auth,updateSession);
router.delete("/session/delete/:sessionId",auth,deleteSession);


module.exports = router;