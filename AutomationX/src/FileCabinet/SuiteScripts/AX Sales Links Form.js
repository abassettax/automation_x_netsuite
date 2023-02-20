function salesLinksPortlet(portlet, column) {

  portlet.setTitle('Sales Shortcuts');
  var portletsearch = nlapiResolveURL('SUITELET', 'customscript2476', 'customdeploy1');
  var results = portlet.addField('custpage_lblproductrating', 'inlinehtml')
  results.setLayoutType('outsidebelow', 'startrow')
  results.setDefaultValue("<iframe frameborder=\"0\" name=\"pickle\" width=\"1250px\" height=\"200px\" src=" + portletsearch + "></iframe>");
}
