function avacashportlet(portlet, column)
{
    portlet.setTitle('Available Cash');

 var portletsearch =nlapiResolveURL('SUITELET','customscript857','customdeploy1');
 
var results =  portlet.addField('custpage_lblproductrating', 'inlinehtml')
   results.setLayoutType('outsidebelow', 'startrow')
   results.setDefaultValue('<iframe style=\"border: 0px none; height:225px; width:550px;  \"src='+ portletsearch+'></iframe>'); 


}