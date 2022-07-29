/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/email','N/render', 'N/record', 'N/file','N/runtime'],

function(email, render, record,file,runtime) {
    function beforeLoad (scriptContext) {
    	var newId =  scriptContext.newRecord;
    	var recordid=newId.getValue('id');
    	log.debug("Debug Entry", "ID" + recordid);
 //   	var entityid=newId.getValue('entity');
 //   	var entityidnum=parseInt(entityid);
    	recordidnum=parseInt(recordid);
    	var myMergeResult = render.mergeEmail({
    	templateId: 90,
    	entity: {
    	type: 'employee',
    	id: 18040
    	},
    	recipient: {
    	type: 'employee',
    	id: 18040
    	},
    	supportCaseId: null,
    	transactionId: recordidnum,
    	customRecord: null
    	});
  /*  	var transactionFile = render.packingSlip({
    	    entityId: recordidnum,
    	    printMode: render.PrintMode.PDF
    	    });*/
    //	var senderId = 7015;
    	
    	/*   	var persontosendto = newId.getValue('createdfrom');
    	var objRecord = record.load({
    	    type: record.Type.paycheck, 
    	    id: persontosendto,
    	    isDynamic: false,
    	});
    	var tobeemailedto= objRecord.getValue('email');
    	var comesfrom= objRecord.getValue('custbody_po_follow_up');
    	if(comesfrom=='')
    	{
    	var finalfrom=objRecord.getSublistValue({
    	    sublistId: 'salesteam',
    	    fieldId: 'employee',
    	    line: 1
    	});
    	}*/
    	    email.send({
    	               //author: finalfrom,
    	               author: 18040,
    	                //recipients: tobeemailedto,
    	                recipients: 18040,
    	               subject: myMergeResult.subject,
    	               //subject: comesfrom,
    	               body: myMergeResult.body,
    	               // attachments: [transactionFile],
    	               // relatedRecords: {
    	               //     entityid: recipientEmail
    	               // }
    	            });
    }

    return {
        beforeLoad : beforeLoad 
    };
    
});
