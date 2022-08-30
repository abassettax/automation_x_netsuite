function hidequotefieldurl()
{
 var relatedtext =  nlapiGetLineItemField('item','custcol98'); 
    if(relatedtext){relatedtext.setDisplayType('hidden');}
  
}

function beforesubmitquote(type,name)
{
var itemCount = nlapiGetLineItemCount('item');	
  if(itemCount <75) // times out if quote is too long
    {
	for (var i=1;  i<=itemCount;i++){			
		
		// get Item Id
		var itemId = nlapiGetLineItemValue('item','item',i);
		
        // get item type
		var itemType = nlapiGetLineItemValue('item', 'itemtype', i);
		var recordType = '';	
		  	        
        switch (itemType) {   // Compare item type to its record type counterpart
            case 'InvtPart':
            	recordType = 'inventoryitem';
                break;
            case 'NonInvtPart':
            	recordType = 'noninventoryitem';
                break;
            case 'Service':
            	recordType = 'serviceitem';
                break;
            case 'Assembly':
            	recordType = 'assemblyitem';
                break;                
            case 'GiftCert':
            	recordType = 'giftcertificateitem';
                break;
            default:
       }		

		// load item and get image file from Item Display Thumbnail
		if(recordType == 'inventoryitem')
          {
		//var item = nlapiLoadRecord(recordType,itemId);	 nlapiLogExecution('debug','item', item);	
		var imgFileId =nlapiLookupField(recordType,itemId ,'custitem16');	
        nlapiLogExecution('debug','imgFileId', imgFileId);	
		// if it has image - continue
		if (imgFileId) {
			var file = nlapiLoadFile(imgFileId);
           nlapiLogExecution('debug','file', file);	
          
			// printed file must be available without login, otherwise you get error on printing 
			//if (file.isOnline()){
				var imageUrl = 'https://shop.automation-x.com' +file.getURL();
				// complete url
				//var completeUrl = imageUrl;
				// set completed url to your custom field of type free-form-text
            var mySubString = imageUrl.substring( imageUrl.lastIndexOf("h=") + 2,  imageUrl.lastIndexOf("&"));
            nlapiLogExecution('debug','mySubString', mySubString);
				 nlapiLogExecution('debug','imageUrl', imageUrl);
				nlapiSetLineItemValue('item','custcol98',i,imageUrl);
			//}
		}
	  }
    } }
   
}



////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//
//
function quotetaskCreator(type)
{
     if (type == 'create') {
if( nlapiGetLineItemCount('item') >= 75 )
          {
          
      var params = new Array();
     params['custscript9'] = nlapiGetRecordId();
  
       var status = nlapiScheduleScript('customscript1521', 'customdeploy1' ,params);
          
          
          }
  
  

var taskid =  nlapiGetFieldValue('custbody167');
 var qinternalId = nlapiGetRecordId();
if(taskid && qinternalId)
 {
 nlapiSubmitField('task', taskid, 'transaction' , qinternalId);
  }}
}




/*


function quotetaskCreator(type)
{
	var currentRecord;
	var recordCreated;
	var emp;
	var ent;
	var tranNum;
	var duedate;
	var date;
	var docno;
	var followup = nlapiGetFieldValue('custbody_createfollowup');
	
	//var emailText = 'A new task has been assigned to you';
	// create Task only when a new Opportunity is created
	if ( type == 'create' && followup  == 'T') 
	{

	// Get the Current Record
		currentRecord = nlapiGetNewRecord();

	// Get the emp on opportunity. 
		emp = nlapiGetUser();


	// Get the opportunity Id being created
		tranNum = currentRecord.getId();

	// Get the Customer from the opportunity.
		ent = currentRecord.getFieldValue('entity');
		var cust = nlapiLookupField('customer', ent, 'companyname'); 

	// Get Doc number
		docno = currentRecord.getFieldValue('tranid');
	
//start date conversion	
		
	var startDateString = currentRecord.getFieldValue('trandate');	

	//  convert to Date
	var startDate = nlapiStringToDate(startDateString);

	//  Add 30 days
	startDate.setDate(startDate.getDate() + 2);

	//  Convert back to string
	date = nlapiDateToString(startDate);

//end date converison

	mes3 = currentRecord.getFieldValue('memo');

		// Set default sales rep if none on opportunity
		//if (salesrep == '' )
		//{
		//	salesrep = 302; 
		//}


		// Create Task 
		 recordCreated = nlapiCreateRecord('task');

		// Set Title, Assigned to, Message and Company
		recordCreated.setFieldValue('title', 'Quote Follow-Up: ' + cust + '  ');

		recordCreated.setFieldValue('assigned', emp);

		recordCreated.setFieldValue('message', 'Quote Notes: ' + mes3 );

		recordCreated.setFieldValue('crm_createdfrom', '<href = https://system.na3.netsuite.com/app/accounting/transactions/opprtnty.nl?id=' + tranNum + '>  View Doc </href>');
		
		recordCreated.setFieldValue('company', ent);

		recordCreated.setFieldValue('transaction', tranNum );

		recordCreated.setFieldValue( 'startdate', date);
		recordCreated.setFieldValue( 'duedate', date);

		nlapiSubmitRecord(recordCreated, true);

		//nlapiSendEmail(-5, salesrep, 'Task Creating Email 
		//Notification', emailText,null); 
	}
}
*/