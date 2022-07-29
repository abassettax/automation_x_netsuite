/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/error','N/search'],
    function(error,search) {
function pageInit(context) {
            if (context.mode !== 'create')
{
                return;
}
debugger
 var currentRecord = context.currentRecord;
//////
           // var sublistName = context.sublistId;
            var FieldName = context.fieldId;
			//var recordid = context.newRecord.id;
            var line = context.line;


			var whocreated=currentRecord.getValue('createdby');

			var ffcontact=currentRecord.getValue('custbody_po_follow_up');
			currentRecord.setValue({
				fieldId: 'email'
		 	,	value: whocreated 
                });

			var ffcontact=currentRecord.getValue('custbody91');
			var ffcontact2=currentRecord.getValue('custbody_po_follow_up');
if(ffcontact>=1)
{

var ffcontactemail=nlapiLookupField('contact',ffcontact, 'email')+";"+ffcontact2; 
			currentRecord.setValue({
				fieldId: 'email'
		 	,	value: ffcontactemail
                });
}
else
{
var ffcontactemail=ffcontact2; 
			currentRecord.setValue({
				fieldId: 'email'
		 	,	value: ffcontactemail
                });
}

///////
//             currentRecord.setValue({
//			fieldId: 'custbody89'
//		,	value: currentRecord.getValue('custbody91')
//			});
        }
      
      
        function fieldChanged(context) {
            var currentRecord = context.currentRecord;
//////
           // var sublistName = context.sublistId;
            var FieldName = context.fieldId;
            var line = context.line;

            if (FieldName === 'custbody_po_follow_up')
{
			//var salesrep1 = nlapiGetUser();
			//var salesRole = nlapiLookupField('employee', salesrep1, 'location', true); 
			var whocreated=currentRecord.getValue('createdby');

			var ffcontact=currentRecord.getValue('custbody_po_follow_up');
			currentRecord.setValue({
				fieldId: 'email'
		 	,	value: whocreated //nlapiLookupField('contact',whocreated, 'email')   //'Item: ' + currentRecord.getValue({fieldId: 'custbody91'}) + ' is selected'
                });
}

            if (FieldName === 'custbody91'||FieldName === 'custbody_po_follow_up')
{
			var ffcontact=currentRecord.getValue('custbody91');
			var ffcontact2=currentRecord.getValue('custbody_po_follow_up');
if(ffcontact>=1)
{
//nlapiLookupField('contact',ffcontact, 'email') ///changed 5/24/17
var ffcontactemail=  search.lookupFields({
    type:  search.Type.CONTACT,
    id:ffcontact,
    columns: ['email']
});
var ffcontactemails = ffcontactemail.email;

var emailstrings =ffcontactemails +";"+ffcontact2; 
			currentRecord.setValue({
				fieldId: 'email'
		 	,	value: emailstrings
                });
}
else
{
var ffcontactemail=ffcontact2; 
			currentRecord.setValue({
				fieldId: 'email'
		 	,	value: ffcontactemail
                });
}
}
///////
//             currentRecord.setValue({
//			fieldId: 'custbody89'
//		,	value: currentRecord.getValue('custbody91')
//			});
        }
        return {
			//pageInit: pageInit,
        	fieldChanged: fieldChanged,
        };
    });