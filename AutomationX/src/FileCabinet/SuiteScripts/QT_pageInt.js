// This function search for all parameters and returns value for set parameter
function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
            
        }
    }
}

function PageIntMHQT()
{
  if(nlapiGetFieldValue('tranid') =='To Be Generated')
  {
    var taskid =GetUrlValue('taskid');
   if(taskid)
   { 
     nlapiSetFieldValue('custbody174',taskid );
   }
  }
  
var transource = nlapiGetFieldValue('custbody125');
if(transource == 11){nlapiSetFieldValue('custbody125',"");}
  
  
}