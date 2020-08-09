var crypto = require('crypto');
module.exports = function(plaintext){
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(plaintext, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr;
}