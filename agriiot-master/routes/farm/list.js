module.exports = function(app,collections){
    
    app.get('/farm/list', function(req, res){
        console.log(req.body);
        
        require('../../whoami')(req,collections,function(user){
            var farmlist = [];
            var cursor ;
            if(user.user){
                if(user.userDetails.userRole === 'farmer'){
                    cursor = collections["farms"].find({farmOwners:{$in : [user.userDetails.userId]}});
                    cursor.each(function(err, item){
                        console.log('cursor iterated');
                        console.log(item);
                        if(item){
                            farmlist.push(item);
                        }else{
                            res.json({farmList:farmlist});
                        }
                    });
                }else{
                    var key = user.userDetails.userRole === 'machinecontroller' ? 'requestUsersAssociated.machineController' : 'requestUsersAssociated.serviceCareerStaff';
                    var temp = collections["service_requests"].find({key:user.userDetails.userId});
                    var farmIds = [];
                    temp.each(function(err, item){
                        if(item){
                            farmIds.push(item.farmId);
                        }else{
                            cursor = collections["farms"].find({farmId:{$in:farmIds}});
                            cursor.each(function(err, item){
                                console.log('cursor iterated');
                                console.log(item);
                                if(item){
                                    farmlist.push(item);
                                }else{
                                    res.json({farmList:farmlist});
                                }
                            });
                        }
                    });
                    
                }
                
                console.log('cursor iter fin');
            }

            
        });
        
        
    });

}