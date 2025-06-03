const CryptoJS = require("crypto-js");
const { ENCRYPT_PAYLOAD_KEY } = require("../../config/env");

class CryptingTool{
  static encrypt(text){
    try{
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(text,CryptoJS.enc.Hex.parse(ENCRYPT_PAYLOAD_KEY),{iv:iv});
      const encryptedString = iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();
      return encryptedString;
    }catch(error){
      console.log("Error during encryption",error);
      throw error;
    }
  }

  static decrypt(encryptedBody){
    try{
      const [ivHex,encryptedData] = encryptedBody.split(":");
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const decrypted = CryptoJS.AES.decrypt(encryptedData,CryptoJS.enc.Hex.parse(ENCRYPT_PAYLOAD_KEY),{iv:iv});
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return decryptedString;
    }catch(error){
      console.log(error);
      throw error;
    }
  }
}

module.exports = { CryptingTool };

// const testing = {
//   id: 1,
//   name: "ilham",
// };
// const parseTostring = JSON.stringify(testing);
// const testEnc = CryptingTool.encrypt(parseTostring);

// console.log(testEnc);

// const testDec = CryptingTool.decrypt(
//   "1d6bb2bf28f0b8fa93585f2d2bd6a41f:05d8ee78d0a9bbc0ee4f8c1fcf8a26efbfccf4e224cb3a2ef5f0b9853ec4e2d59d641748b1aed8192b64007fd2acbfb81d6f5b59ea5d0ad1bd852abe979f033d"
// );


