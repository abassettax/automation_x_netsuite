function RecordLostCustomerItem()
{
    var d = new Date();
  var day = d.getDate();
  var month = d.getMonth() +1;
  var year = d.getFullYear();
 var effectiveDate = month + '-' + day +'-' +  year;

 //var thisitemid = nlapiGetCurrentLineItemValue('item', 'item'); 
 var thisCust = nlapiGetRecordId();  
// var thisLocation = nlapiGetFieldValue('location');
  var LostItemURL = 'https://422523.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=668&thisCust='+thisCust ;

 window.open(LostItemURL,'_blank');

}



function SubmitForecast()
{
 var thisCust =nlapiGetRecordId();
  var ForecastURL = 'https://422523.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=587&thisCust='+thisCust ;
 window.open(ForecastURL,'_blank');

}


function createso()
{
 var uid = nlapiGetRecordId();
 if(uid ) 
{
window.open("https://422523.app.netsuite.com/app/accounting/transactions/salesord.nl?entity=" + uid + "&whence=" , '_blank');
return true;
}
  
}

/////////////////////////////////
function createquote()
{
 var uid =nlapiGetRecordId();
 if(uid ) 
{
window.open("https://422523.app.netsuite.com/app/accounting/transactions/estimate.nl?entity=" + uid + "&whence=", '_blank');
return true;
}
  
}

function createfavoritesquoteClient()
{
  
    var Cust =  nlapiGetRecordId();    //nlapiGetFieldValue('entityid');

  //call the Suitelet created in Step 1
 var createtopsellingURL ='https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=478&deploy=1' ;//nlapiResolveURL('SUITELET', 'customscript478',  'customdeploy1');
  
  //pass the internal id of the current record
 createtopsellingURL += '&idd=' + Cust +'&compid=422523';
 
  //show the PDF file 
 newWindow = window.open(createtopsellingURL);
  
  

}

