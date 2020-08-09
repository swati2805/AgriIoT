module.exports = function(app,collections){
    
    app.get('/servicerequest/list', function(req, res){
        console.log(req.body);
        
        var servicerequestlist = []
        require('../../whoami')(req,collections,function(user){
            if(user.user === false ){
                res.json({success:false,reason:'Login First'});
                return ;
            }
            
            if(req.query.farmId){
                collections["farms"].findOne({farmId:req.query.farmId},function(err,farm){
                    if(err){
                        res.json({servicerequestlist:servicerequestlist});
                        return;
                    }
                    var temp = collections['service_requests'].find({farmId:farm.farmId});
                    temp.each(function(err,sreq){
                        if(err){
    
                        }else{
                            if(sreq){
                                servicerequestlist.push(sreq);
                            }else{
                                res.json({servicerequestlist:servicerequestlist});
                            }
                        }
                            
                    });
    
                });
            }else{
                if(user.userDetails.userRole === 'servicecarrierstaff' || user.userDetails.userRole === 'machinecontroller'){
                    
                    var keyUID = user.userDetails.userRole === 'servicecarrierstaff' ? 'requestServiceCarrierStaffId' : 'requestMachineControllerId';

                    var status = user.userDetails.userRole === 'servicecarrierstaff' ? 'raised' : 'approved';

                    var orOp = {};

                    orOp[keyUID] = user.userDetails.userId;

                    

                    console.log([
                        orOp,
                        {requestStatus:status}
                    ]);

                    var temp = collections['service_requests'].find({
                        $or:[
                            orOp,
                            {requestStatus:status}
                        ]
                    });
                    temp.each(function(err,sreq){
                        if(err){
    
                        }else{
                            if(sreq){
                                servicerequestlist.push(sreq);
                            }else{
                                res.json({servicerequestlist:servicerequestlist});
                            }
                        }
                            
                    });

                }else{
                    res.json({servicerequestlist:servicerequestlist});
                }
            }

        });
        
    });
    
}