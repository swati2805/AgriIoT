module.exports = function(callback){
    
    const client = new require('mongodb').MongoClient("mongodb+srv://nihalkonda:Mrox@5497*com@cluster0-lhpja.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });

    var collections = {}

    client.connect(err => {
        const collectionNames = ["users","service_requests","contracts","bills","farms","things"];
        collectionNames.forEach((collNam) => (collections[collNam] = client.db("agriiot").collection(collNam)));
        callback(collections);
        //client.close();
    });

}