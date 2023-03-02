function quotaPortlet(portlet, column) {

  portlet.setTitle('BU Monthly Tracking');
  var SPF = portlet.addField('custpage_periodselect','select','Select Period').setLayoutType('outsidebelow', 'startcol');
  SPF.addSelectOption("current" , "Current Month", true);
  SPF.addSelectOption("last" , "Last Month");
  var portletsearch = nlapiResolveURL('SUITELET', 'customscript2473', 'customdeploy1');
  portlet.setSubmitButton(portletsearch,'Refresh', 'pickle' );
  var results = portlet.addField('custpage_lblproductrating', 'inlinehtml')
  results.setLayoutType('outsidebelow', 'startrow')
  results.setDefaultValue("<iframe frameborder=\"0\" name=\"pickle\" width=\"1250px\" height=\"340px\" src=" + portletsearch + "></iframe>");}
