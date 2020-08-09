module.exports = function (req,collections,callback){
    if(req.session.userId !== undefined){
        console.log("whoami.js : "+req.session.userId);
        collections["users"].findOne({userId:req.session.userId}, function(err, user) {
            if(err)callback({user:false});
            else callback({user:true,userDetails:user});
        });
    }else
        callback({user:false});
}