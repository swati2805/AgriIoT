module.exports = function(app,collections){
    app.get('/servicerequest/cancel',function(req,res){

        console.log(req.body);

        if(req.query.srId){
            require('../../whoami')(req,collections,function(user){
                if(user.user === false ){
                    res.json({success:false});
                    return ;
                }
                collections['service_requests'].findOne({requestId:req.query.srId},function(err,sreq){
                    if(err){
                        res.json({success:false});
                        return ;
                    }//user.userRole
                    if(sreq){
                        sreq.requestStatus = user.userDetails.userRole + '_cancelled';
                        collections['service_requests'].update({ _id: sreq['_id'] },sreq,true,function(err,data){
                            res.json({success:true});
                        })
                    }else{
                        res.json({success:false});
                        return ;
                    }
                });
            });
        }

    });
}