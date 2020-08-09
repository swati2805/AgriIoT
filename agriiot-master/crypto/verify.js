module.exports = function(plaintext,ciphertext){
    const deciphered = require('./decrypt')(ciphertext);
    console.log('plaintext : '+plaintext);
    console.log('deciphered : '+deciphered);
    return plaintext === deciphered;
}