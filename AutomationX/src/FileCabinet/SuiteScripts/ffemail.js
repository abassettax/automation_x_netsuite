/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define(['N/email','N/render', 'N/record', 'N/file'],
function(email, render, record,file) { 

function afterSubmit(context) {

//    if (context.type === context.UserEventType.CREATE)
//{         


//var id = record.submitFields({
//    type: record.Type.ITEM_FULFILLMENT,
//    id: recordid,
//   values: {
//        custbody145: true
//    }
//});
//       return;
//}
            if (context.type === context.UserEventType.DELETE)
{
                return;
}
else
{

var newId =  context.newRecord;
var didiship=newId.getValue('shipstatus');
var resendemail=newId.getValue('custbody145');


//var createdfromtype=newId.getText('createdfrom');


var TO =  newId.getValue('transferlocation');    
log.debug("Debug Entry", "TO" + TO);





if (didiship!== "C"||resendemail!==true || TO != null)
{
          return;
}
else{
//var recordid=newId.getValue('id');
var recordid = context.newRecord.id;
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

var comesfrom= objRecord.getValue('custbody144');
if(comesfrom>=1)
{
var finalfrom=comesfrom;
}
else
{
var finalfrom=objRecord.getSublistValue({
    sublistId: 'salesteam',
    fieldId: 'employee',
    line: 1
});
}
if (!finalfrom||!tobeemailedto)
          return;

    email.send({
               author: finalfrom,
                recipients: tobeemailedto,
               subject: myMergeResult.subject,
               //subject: id,
               body: myMergeResult.body,
                attachments: [transactionFile],
                relatedRecords: {
                    entityid: recipientEmail,
                    transactionId: recordid 
                }
            });
newId.setValue({
    fieldId: 'custbody145',
    value: false,
    ignoreFieldChange: true
});
var id = record.submitFields({
    type: record.Type.ITEM_FULFILLMENT,
    id: recordid,
    values: {
        custbody145: false
    }
});
}}
}
return {
afterSubmit: afterSubmit
};
});