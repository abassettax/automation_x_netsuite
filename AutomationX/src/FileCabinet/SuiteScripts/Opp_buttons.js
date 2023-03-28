function beforeLoadAddButton(type) {
	if (type == 'view') {
		form.addButton('custpage_oppquote', 'New Quote', 'transformToQuote()');
		form.setScript('customscript2480'); // sets the script on the client side
	}
}

function beforeSubmitOpp(type) {
	// nlapiLogExecution('DEBUG', 'type beforeSubmitOpp', JSON.stringify(type));
	if (type == 'create') {
		//set Class, Location, Sales Rep from customer/lead/prospect values if present
		var cust = nlapiGetFieldValue('entity');
		var custClass = nlapiLookupField('customer', cust, 'custentity149');
		if (custClass != '') {
			nlapiSetFieldValue('class', custClass);
		}
		var custLoc = nlapiLookupField('customer', cust, 'custentity180');
		if (custLoc != '') {
			nlapiSetFieldValue('location', custLoc);
		}
		var custRep = nlapiLookupField('customer', cust, 'salesrep');
		if (custRep != '') {
			nlapiSetFieldValue('salesrep', custRep);
		}
	}
	return true;
}