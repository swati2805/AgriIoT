var crypto = require('crypto');
module.exports = function(ciphertext){
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(ciphertext, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr;
}