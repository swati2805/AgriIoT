module.exports = function(app,collections){
    
    app.post('/user/login', function(req, res){
        console.log(req.body);
        
        var cursor = collections["users"].find();

        // Execute the each command, triggers for each document
            cursor.each(function(err, item) {
                // If the item is null then the cursor is exhausted/empty and closed
                if(item == null) {
                    //db.close(); // you may not want to close the DB if you have more code....
                    return;
                }
                console.log(item);
                // otherwise, do something with the item
            });

        collections["users"].findOne({userEmail:req.body.userEmail}, function(err, user) {
            
            if (err){console.log(err); throw err;}
            console.log(user);

            if(require('../../crypto/verify')(req.body.userPassword,user.userPassword) === false){
                res.json({success:false,reason:'Login Failed'});
                return;
            }

            req.session.userId = user['userId'];

            req.session.save(function(err) {
                // session saved
                if(err)
                console.log(err);
                console.log('session saved');
                console.log(req.session.userId);
                res.json({success:true,user:user});
              });

              //res.json({success:false});
          });
        
        
    });
    
}