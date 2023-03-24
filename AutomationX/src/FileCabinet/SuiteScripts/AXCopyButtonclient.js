function CopyRecordReprice()
{
var currentrecordID = nlapiGetRecordId();
var currentrecordType =nlapiGetRecordType();
// var copyrecord = nlapiLoadRecord(currentrecordType, currentrecordID );
// var copyrecordcust = nlapiLookupField(currentrecordType, currentrecordID , 'entity');
var typeToCopy =  'salesord';
// //alert(copyrecordcust);
 if( currentrecordType == 'estimate'  ){typeToCopy = 'estimate'};

//  var URLnewSO = 'https://system.na3.netsuite.com/app/accounting/transactions/'+ typeToCopy +'.nl?entity=' +  copyrecordcust  + '&currentrecordType='+ currentrecordType  + '&currentrecordID='+  currentrecordID + '&axCopy=yes&whence='
 

//  window.open(URLnewSO, '_blank');
// return true; 

// alert(currentrecordID);

try{
    // var s_url = 'https://system.na3.netsuite.com/app/accounting/transactions/salesord.nl?entity=' +  i_cust  + '&currentrecordType='+ record.Type.SALES_ORDER  + '&currentrecordID='+  i_id + '&axCopy=yes&whence=';
    var s_url2 = 'https://422523.app.netsuite.com/app/accounting/transactions/'+ typeToCopy +'.nl?id='+currentrecordID+'&whence=&e=T&memdoc=0&axCopy=yes';
    // window.open(s_url,'_blank');
    window.open(s_url2,'_blank');
}catch(e){
    console.error('error',e);
}
return true; 
}