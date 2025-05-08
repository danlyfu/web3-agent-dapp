const { ethers } = require("ethers");

function verifySignature(address, message, signature) {
  try {
    const recovered = ethers.utils.verifyMessage(message, signature);
    return recovered.toLowerCase() === address.toLowerCase();
  } catch (e) {
    return false;
  }
}

module.exports = { verifySignature };
