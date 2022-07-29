function createinvportletDB(portlet, column)
{
    portlet.setTitle('Inventory Overview');

 var portletsearch =nlapiResolveURL('SUITELET','customscript782','customdeploy1');
 
var results =  portlet.addField('custpage_lblproductrating', 'inlinehtml')
   results.setLayoutType('outsidebelow', 'startrow')
   results.setDefaultValue("<iframe frameborder=\"0\" name=\"pickle\" width=\"1250px\" height=\"300px\" src="+ portletsearch+"></iframe>"); 

}