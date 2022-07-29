function deliveryPortlet(type, form)
{

 portlet.setTitle('Delivery Route');

  var portletsearch =nlapiResolveURL('SUITELET','customscript1491','customdeploy1');

var results =  portlet.addField('custpage_lblproductrating', 'inlinehtml')

 
   results.setLayoutType('outsidebelow', 'startrow')
   results.setDefaultValue("<iframe style=\"border: 0px none; height:2000px; margin-top: -100px; width:1250px; \" src=https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1491&deploy=1&compid=422523></iframe>"); 
}