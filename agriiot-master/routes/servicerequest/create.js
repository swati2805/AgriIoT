module.exports = function(app,collections){
    
    const uuidv4 = require('uuid/v4');

    app.post('/servicerequest/create/subscribe', function(req, res){
        console.log('/servicerequest/create/subscribe');
        console.log(JSON.stringify(req.body));
        require('../../whoami')(req,collections,function(user){
            if(user.user === false || user.userDetails.userRole !== 'farmer'){
                res.json({success:false,reason:'Only Farmers have access to create a servicerequest'});
                return ;
            }
    
            var json = req.body;
            json['requestType'] = 'subscribe';
            json['requestStatus'] = 'raised';

            //json['farmOwners'] = [user.userDetails.userId];
    
            json['requestId'] = uuidv4();
            
            collections['contracts'].findOne({farmId:json['farmId']},function(err,contract){
                if(err){

                }
                if(contract){
                    json['contractId'] = contract.contractId;    
                }

                collections['service_requests'].save(json);
                
                res.json({success:true});
            });

        });
        
    });
    
    

}