function taskCreator(type)
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
		var cust = nlapiLookupField('vendor', ent, 'companyname'); 

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
	mes1 = currentRecord.getFieldValue('custbody45');
	mes2 = currentRecord.getFieldValue('custbody2');
	mes4 = currentRecord.getFieldValue('custbody4');
	
	//maerialstatid = currentRecord.getFieldValue('custbody6');
	//MaterialStat= nlapiLookupField('vendor', ent, 'companyname', true);
	
	

		// Set default sales rep if none on opportunity
		//if (salesrep == '' )
		//{
		//	salesrep = 302; 
		//}


		// Create Task 
		 recordCreated = nlapiCreateRecord('task');

		// Set Title, Assigned to, Message and Company
		recordCreated.setFieldValue('title', 'Purchase Order Follow-Up: ' + cust + ' - ');

		recordCreated.setFieldValue('assigned', emp);

		recordCreated.setFieldValue('message', 'PO Notes: ' + mes1 + '   --  ' + mes2 + ' -- ' + mes3 + ' --  ' + mes4);

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
