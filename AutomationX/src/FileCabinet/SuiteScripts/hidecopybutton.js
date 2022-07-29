 
function hideSaveAndPrintButton(type, form)
{
     if (type == 'view');/// ||  type == 'edit' || type == 'copy')
{
    form.addButton('custpage_Copy', 'Make Copy & Reprice', 'CopyRecordReprice() ');  
   	form.setScript('customscript1218');
  
}
  var today = new Date();       
var ndays = nlapiAddDays(today, -90);

var td = nlapiGetFieldValue('trandate');
var tds = nlapiStringToDate(td);

var button = form.getButton('makecopy'); 
  if ( ndays > tds && !button){  if(button){button.setVisible(false);}}
}
 