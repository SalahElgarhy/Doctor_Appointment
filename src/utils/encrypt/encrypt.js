import CryptoJS from 'crypto-js';
export const encrypt = ({plaintext , secret_key = process.env.ENCRYPTION_KEY})=> {

    return CryptoJS.AES.encrypt(plaintext , secret_key).toString();
}




export const decrypt = ({ciphertext , secret_key = process.env.ENCRYPTION_KEY})=> {

    return CryptoJS.AES.decrypt(ciphertext , secret_key).toString(CryptoJS.enc.Utf8);

}