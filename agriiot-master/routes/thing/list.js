module.exports = function(app,collections){
    
    app.get('/thing/list', function(req, res){
        console.log(req.body);
        
        var thinglist = []

        if(req.query.farmId || req.query.srId){
            var search = {};
            if(req.query.farmId){
                search['thingFarmId'] = req.query.farmId;
            }else{
                search['thingRequestId'] = req.query.srId;
            }
            var cursor = collections["things"].find(search);

            cursor.each(function(err, item) {
                if(err){
                    res.json({thinglist:thinglist});
                    return;
                }
                if(item){
                    thinglist.push(item);
                }else{
                    res.json({thinglist:thinglist});
                }
            });
        }else{
            res.json({thinglist:thinglist});
        }
    });
    
}