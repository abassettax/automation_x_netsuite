/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
function beforeLoadAddButton(type) {
	if (type == 'create' || type == 'edit' || type == 'copy') {
		form.addButton('custpage_checkinventory', ' Check Inventory ', ' getinv() ');
		form.setScript('customscript350'); // sets the script on the client side

		//---------------------------------------------------------------------------------------------

		form.addButton('custpage_buttoncustomeritemhistory', ' Customer Item History ', ' gethist() ');
		form.setScript('customscript350'); // sets the script on the client side

		//---------------------------------------------------------------------------------------------

		form.addButton('custpage_buttoncustpriceupdate', ' Customer Price Update', ' itemprice() ');
		form.setScript('customscript350'); // sets the script on the client side

		//---------------------------------------------------------------------------------------------

		form.addButton('custpage_buttonmakecopies', ' Make Copies ', ' makecopies() ');
		form.setScript('customscript350'); // sets the script on the client side

		//---------------------------------------------------------------------------------------------

		form.addButton('custpage_buttoncopylocation', ' Copy Locations ', ' setpolocationvlgx() ');
		form.setScript('customscript350'); // sets the script on the client side

		//---------------------------------------------------------------------------------------------
	}

	if (type == 'view') {
		var POSSignature = nlapiGetField('custbody139');
		POSSignature.setDisplayType('hidden');
	}
}