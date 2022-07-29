function button(type, form, request){
form.addButton('custpage_RemoveCreateFrom','Remove Created From2');
 //form.setScript('customscript245');//
var purchasingnotes = nlapiGetFieldValue('custbody34');
var cf = nlapiGetFieldText('createdfrom');

var newpurchasingnotes = purchasingnotes +" " + cf
nlapiSetFieldValue('custbody34', newpurchasingnotes);
nlapiSetFieldValue('createdfrom', null);


}
 