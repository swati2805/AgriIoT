module.exports = function(app,collections){
    
    const uuidv4 = require('uuid/v4');

    app.post('/bill/create', function(req, res){
        console.log('/bill/create');
        console.log(JSON.stringify(req.body));
        
        require('../../whoami')(req,collections,function(user){
            if(user.user === false || user.userDetails.userRole !== 'servicecarrierstaff'){
                res.json({success:false,reason:'Only servicecarrierstaff have access to create a bill'});
                return ;
            }

            var json = req.body;
            json['billId'] = uuidv4();
            //charge
            //payAsYouGo
            //srId

            collections['service_requests'].findOne({requestId:json['requestId']},function(err,sreq){
                if(err){
                    res.json({success:false});
                    return;
                }
                if(sreq.contractId){
                    // add srId to existing contract 
                    collections['contracts'].findOne({contractId:sreq.contractId},function(err,contract){

                        contract['requestId'].push(sreq.requestId);
                        
                        collections['contracts'].update( { _id: contract['_id'] }, contract, true ,function(err,data){
                            collections['bills'].save(json,function(err){
                                sreq.billId = json['billId'];
                                sreq.requestStatus='estimated';
                                sreq.requestServiceCarrierStaffId = user.userDetails.userId;
                                collections['service_requests'].update({ _id: sreq['_id'] },sreq,true,function(err,data){
                                    res.json({success:true});
                                })
                            });
                        });

                    });
                }else{
                    var contract = {};
                    contract['contractId']=uuidv4();
                    contract['farmId'] = sreq.farmId;
                    contract['requestId'] = [sreq.requestId];
                    contract['cost'] = 1000.0;
                    contract['startTime'] = Date.now();
                    contract['endTime'] = contract['startTime'] + (365 * 24 * 60 * 60 * 1000);
                    
                    collections['contracts'].save(contract,function(err){
                        collections['bills'].save(json,function(err){
                                sreq.billId = json['billId'];
                                sreq.contractId = contract['contractId'];
                                sreq.requestStatus='estimated';
                                sreq.requestServiceCarrierStaffId = user.userDetails.userId;
                                collections['service_requests'].update({ _id: sreq['_id'] },sreq,true,function(err,data){
                                    res.json({success:true});
                                })
                        });
                    });

                }
            });

            /*
            var json = req.body;
            json['requestType'] = 'subscribe';
            json['requestStatus'] = 'raised';

            //json['farmOwners'] = [user.userDetails.userId];
    
            json['requestId'] = uuidv4();
    
            collections['service_requests'].save(json);
            
            res.json({success:true});
            */
        });
        
    });
    
    

}