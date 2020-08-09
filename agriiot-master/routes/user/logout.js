module.exports = function(app,collections){
    
    app.get('/user/logout', function(req, res){
        console.log(req.body);
        
        delete req.session.userId 

        res.json({success:true});
        
        
    });
    
}