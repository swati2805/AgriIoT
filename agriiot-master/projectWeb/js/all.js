function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener){
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}

function sendMsgToChild(id,msg){
    document.getElementById(id).contentWindow.postMessage(JSON.stringify(msg),'*');
    
}

function sendMsgToParent(msg){
    
    window.parent.postMessage(JSON.stringify(msg),'*');
    
}

var msgListen = function(data){
  console.log(data);  
};

bindEvent(window, 'message', function (e) {
    msgListen(e.data);
});

function GetURLParameter(sParam)
{
    console.log(window.location);
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function validateMyForm()
            {
              return false;
            }


            function getFormData(form){
                var unindexed_array = form.serializeArray();
                var indexed_array = {};
            
                $.map(unindexed_array, function(n, i){
                    indexed_array[n['name']] = n['value'];
                });
                console.log(indexed_array);
                return indexed_array;
            }
