module.exports = function(app,collections){
    
    app.get('/servicerequest/read', function(req, res){
        console.log(req.body);

        if(req.query.srId){
            collections["service_requests"].findOne({requestId:req.query.srId},function(err,sr){
                if(err){
                    res.json({success:false});
                    return;
                }
                //res.json({success:true,data:sr});
                var sr1 = sr;
                if(sr1.contractId){
                    collections["contracts"].findOne({contractId : sr1.contractId},function(err,contract){
                        if(err){
                            res.json({success:true,data:sr});
                            return;
                        }
                        sr1.contract = contract;
                        
                        if(sr1.billId){
                            collections["bills"].findOne({billId : sr1.billId},function(err,bill){
                                if(err){
                                    res.json({success:true,data:sr1});
                                    return;
                                }
                                sr1.bill = bill;
                                res.json({success:true,data:sr1});
                            });
                        }else{
                            res.json({success:true,data:sr1});
                        }

                    });
                }else{
                    res.json({success:true,data:sr1});
                }
            });
        }else        
        res.json({success:false});
    });

    
    
}