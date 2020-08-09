module.exports = function(app,collections){

    app.get('/bill/pay',function(req, res){
        console.log('/bill/create');
        console.log(JSON.stringify(req.body));
        if(req.query.srId){
            require('../../whoami')(req,collections,function(user){
                if(user.user === false || user.userDetails.userRole !== 'farmer'){
                    res.json({success:false,reason:'Only farmer have access to create a payment'});
                    return ;
                }
                collections['service_requests'].findOne({requestId:req.query.srId},function(err,sreq){
                    if(err){
                        res.json({success:false});
                        return;
                    }
                    collections['bills'].findOne({billId : sreq.billId },function(err,bill){
                        if(err){
                            res.json({success:false});
                            return;
                        }
                        bill.paymentTime = Date.now();
                        collections['bills'].update( { _id: bill['_id'] }, bill, true ,function(err,data){
                            sreq.requestStatus='approved';
                            collections['service_requests'].update( { _id: sreq['_id'] }, sreq, true ,function(err,data){
                                res.json({success:true});
                            });
                        });
                    });
                    
                });
    
            });
        }else{
            res.json({success:false});
        }
        
    });

}