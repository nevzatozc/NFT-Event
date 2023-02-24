const Web3 = require("web3");
const web3 = new Web3(
  "wss://eth-mainnet.g.alchemy.com/v2/ZxixEMu5GLz0q9vWOTkEeieHHq6M4ckV"
);
//
//const contractAbi = require('./puma_abi.json'); //  Super Puma (SPRPUMA) contract ABI
const contractAddress = "0x283c0BbA69EbD4643cfCe761B34b0206E75b2091"; // Super Puma (SPRPUMA) contract address
const eventSignature = "Transfer(address,address,uint256)";
//https://etherscan.io/address/0x283c0bba69ebd4643cfce761b34b0206e75b2091#events
web3.eth.subscribe(
  "logs",
  {
    address: contractAddress,
    topics: [web3.utils.sha3(eventSignature)],
  },
  async (error, result) => {
    if (!error) {
      const log = web3.eth.abi.decodeLog(
        [
          {
            type: "address",
            name: "from",
            indexed: true,
          },
          {
            type: "address",
            name: "to",
            indexed: true,
          },
          {
            type: "uint256",
            name: "tokenId",
            indexed: true,
          },
        ],
        result.data,
        result.topics.slice(1)
      );
      //console.log(result.transactionHash)
      web3.eth.getTransaction(result.transactionHash, (error, transaction) => {
        if (error) {
          console.error(error);
        } else {
          const price = web3.utils.fromWei(transaction.value, "ether");

          console.log(
            `Transaction Hash: ${result.transactionHash} - Token ID: ${log.tokenId} - Price: ${price} ETH - From: ${log.from} - To: ${log.to} `
          );
        }
      });
      /*const contract = new web3.eth.Contract(contractAbi, contractAddress);
        const tokenUri = await contract.methods.tokenURI(log.tokenId).call();
        const response = await fetch(tokenUri);
        const metadata = await response.json();
        console.log(metadata);*/
    } else {
      console.error(error);
    }
  }
);
