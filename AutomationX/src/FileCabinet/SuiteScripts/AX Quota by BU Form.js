function quotaPortlet(portlet, column) {

  portlet.setTitle('BU Monthly Tracking');
  var portletsearch = nlapiResolveURL('SUITELET', 'customscript2473', 'customdeploy1');
  var results = portlet.addField('custpage_lblproductrating', 'inlinehtml')
  results.setLayoutType('outsidebelow', 'startrow')
  results.setDefaultValue("<iframe frameborder=\"0\" name=\"pickle\" width=\"1250px\" height=\"340px\" src=" + portletsearch + "></iframe>");}
