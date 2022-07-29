function beforeloadlinecustfields(type, form)  
{

 ///////////////////////hide/show line item cust codes 
var hasitemsublist = form.getSubList('item');
if(hasitemsublist)
  {
var LineTechnicianName = form.getSubList('item').getField('custcol102'); if(nlapiGetFieldValue('custbody216') != 'T' && LineTechnicianName ){  LineTechnicianName.setDisplayType('hidden'); }  //PER LINE TECHNICIAN NAME
var LineWellsiteName = form.getSubList('item').getField('custcol103'); if(nlapiGetFieldValue('custbody217') != 'T' && LineWellsiteName ){  LineWellsiteName.setDisplayType('hidden'); }  //PER LINE WELLSITE NAME 
var LineWellNumber = form.getSubList('item').getField('custcol104'); if(nlapiGetFieldValue('custbody218') != 'T' && LineWellNumber ){  LineWellNumber.setDisplayType('hidden'); }  //PER LINE WELL NUMBER 
var LineAccountingNum = form.getSubList('item').getField('custcol105'); if(nlapiGetFieldValue('custbody219') != 'T' && LineAccountingNum ){  LineAccountingNum.setDisplayType('hidden'); }  //PER LINE ACCOUNTING # 
var LinePlantCode = form.getSubList('item').getField('custcol106'); if(nlapiGetFieldValue('custbody220') != 'T' && LinePlantCode ){  LinePlantCode.setDisplayType('hidden'); }  //PER LINE PLANT CODE 
var LineApproverId = form.getSubList('item').getField('custcol107'); if(nlapiGetFieldValue('custbody221') != 'T' && LineApproverId ){  LineApproverId.setDisplayType('hidden'); }  //PER LINE APPROVER ID 
var LineCode = form.getSubList('item').getField('custcol108'); if(nlapiGetFieldValue('custbody222') != 'T' && LineCode ){  LineCode.setDisplayType('hidden'); }  //PER LINE CODE 
var LineReasonCodes = form.getSubList('item').getField('custcol109'); if(nlapiGetFieldValue('custbody223') != 'T' && LineReasonCodes ){  LineReasonCodes.setDisplayType('hidden'); }  //PER LINE REASON CODES 
var LineGlAccount = form.getSubList('item').getField('custcol110'); if(nlapiGetFieldValue('custbody224') != 'T' && LineGlAccount ){  LineGlAccount.setDisplayType('hidden'); }  //PER LINE GL ACCOUNT
var LineOnlinePaykeyUserid = form.getSubList('item').getField('custcol111'); if(nlapiGetFieldValue('custbody225') != 'T' && LineOnlinePaykeyUserid ){  LineOnlinePaykeyUserid.setDisplayType('hidden'); }  //PER LINE ONLINE PAYKEY/USERID


 }

 //////////////////////////

}