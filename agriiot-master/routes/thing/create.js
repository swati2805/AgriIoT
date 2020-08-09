module.exports = function(app,collections){
    
    const uuidv4 = require('uuid/v4');

    app.post('/thing/create', function(req, res){
        console.log('/thing/create');
        console.log(JSON.stringify(req.body));

        var thingList = req.body.thingList;
        if(thingList.length == 0){
            res.json({success:false});
            return;
        }
        require('../../whoami')(req,collections,function(user){
            if(user.user === false || user.userDetails.userRole !== 'machinecontroller'){
                res.json({success:false,reason:'Only machinecontroller have access to create a thing'});
                return ;
            }

            
            
            //charge
            //payAsYouGo
            //srId

            collections['service_requests'].findOne({requestId:thingList[0]['thingRequestId']},function(err,sreq){
                if(err){
                    res.json({success:false});
                    return;
                }
                thingList.forEach(function(thing){
                    thing.thingFarmId = sreq.farmId;
                    thing.thingRequestId = sreq.requestId;
                    thing.thingContractId = sreq.contractId;
                    thing.thingServiceCarrierStaffId = sreq.requestServiceCarrierStaffId;
                    thing.thingMachineControllerId = user.userDetails.userId;
                    thing.thingId = uuidv4();
                });
                collections['things'].insertMany(thingList,function(err,data){
                    if(err){
                        res.json({success:false});
                        return;
                    }
                    sreq.requestMachineControllerId = user.userDetails.userId;
                    sreq.requestStatus = 'handled';
                    collections['service_requests'].update( { _id: sreq['_id'] }, sreq, true ,function(err,data){
                        res.json({success:true});
                    });
                });
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