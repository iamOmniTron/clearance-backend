const {ethers,Contract}= require('ethers');
const ContractArtifacts = require("./abis/Clearance.json");


module.exports = async ()=> {
    const CONTRACT_ADDRESS = ContractArtifacts.networks['5777'].address;
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
    const signer = await provider.getSigner();
    const mutationInterface = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,signer);
    const queryInterface = new Contract(CONTRACT_ADDRESS,ContractArtifacts.abi,provider);
    
    return {
        mutations:mutationInterface,
        queries:queryInterface
    }
}