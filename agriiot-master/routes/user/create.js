module.exports = function(app,collections){
    
    const uuidv4 = require('uuid/v4');

    app.post('/user/sendVerificationToken',function(req, res){
        console.log(req.body.email);
        require('../../mail/mailer')(req.body.email,'Verification Token','Here is your Verification Token : '+require('../../crypto/encrypt')(req.body.email));
        res.json({success:true});
    });

    app.post('/user/register', function(req, res){
        console.log(req.body);
        if(require('../../crypto/verify')(req.body.userEmail,req.body.verificationToken) === false){
            res.json({success:false,reason:'Verification Failed'});
            return;
        }
        var json = req.body

        delete json['verificationToken'];

        json['userPassword'] = require('../../crypto/encrypt')(json['userPassword']);

        json['userId'] = uuidv4();

        if(json['userRole'] === undefined)
        json['userRole'] = 'farmer';

        json['userAuthorizedBy'] = '';

        json['userSignUpTimeStamp'] = Date.now();

        req.session.userId = json['userId'];

        req.session.save(function(err) {
            // session saved
          });

        collections["users"].save(json);
        
        res.json({success:true});
    });
    
}