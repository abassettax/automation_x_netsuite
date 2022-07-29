function CopyRecordReprice()
{
var currentrecordID = nlapiGetRecordId();
var currentrecordType =nlapiGetRecordType();
var copyrecord = nlapiLoadRecord(currentrecordType, currentrecordID );
var copyrecordcust = nlapiLookupField(currentrecordType, currentrecordID , 'entity');
var typeToCopy =  'salesord';
//alert(copyrecordcust);
 if( currentrecordType == 'estimate'  ){typeToCopy = 'estimate'};

 var URLnewSO = 'https://system.na3.netsuite.com/app/accounting/transactions/'+ typeToCopy +'.nl?entity=' +  copyrecordcust  + '&currentrecordType='+ currentrecordType  + '&currentrecordID='+  currentrecordID + '&axCopy=yes&whence='
 

 window.open(URLnewSO, '_blank');
return true; 

alert(currentrecordID);
}