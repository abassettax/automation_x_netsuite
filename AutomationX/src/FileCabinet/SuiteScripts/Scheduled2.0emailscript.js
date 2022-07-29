/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/email','N/render', 'N/record', 'N/file','N/runtime'],
function(email, render, record,file,runtime) { 

function execute(context) {
var newId =  context.newRecord;
var didiship=newId.getValue('shipstatus');
if (didiship!== "C")
          return;
var recordid=newId.getValue('id');
var entityid=newId.getValue('entity');
var entityidnum=parseInt(entityid);
recordidnum=parseInt(recordid);
var myMergeResult = render.mergeEmail({
templateId: 121,
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
var transactionFile = render.packingSlip({
    entityId: recordidnum,
    printMode: render.PrintMode.PDF
    });
var senderId = 7015;
var recipientEmail = 'jason.feucht@automation-x.com';
var persontosendto = newId.getValue('createdfrom');
var objRecord = record.load({
    type: record.Type.SALES_ORDER, 
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
var comesfrom=finalfrom;
}
    email.send({
               author: finalfrom,
                //recipients: tobeemailedto,
                recipients: 18040,
               subject: myMergeResult.subject,
               //subject: comesfrom,
               body: myMergeResult.body,
                attachments: [transactionFile],
                relatedRecords: {
                    entityid: recipientEmail
                }
            });
}
return {
execute: execute
};
});