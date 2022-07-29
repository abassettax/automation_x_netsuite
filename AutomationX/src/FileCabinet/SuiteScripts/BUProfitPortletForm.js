function demoSimpleFormPortlet(portlet, column)
{
   // var portlet = nlapiCreateForm('BU');
//  form.setScript('customscript418');
var accountingperiodSearch = nlapiSearchRecord("accountingperiod",null,
[
   ["enddate","within","lastmonth"], 
   "AND", 
   ["alllocked","is","T"]
], 
[
   new nlobjSearchColumn("periodname").setSort(false)
]
);
 var isDefaultLP = true;
  var isDefaultPBL = false; 
  if(!accountingperiodSearch){ isDefaultPBL =  true; isDefaultLP =false;}
  
    portlet.setTitle('Business Unit P&L');
     var SPF = portlet.addField('custpage_periodselect','select','Select Period Range').setLayoutType('outsidebelow', 'startcol');
SPF.addSelectOption("Q1LFY" , "First Fiscal Quarter Last FY ");
SPF.addSelectOption("Q1TFY" , "First Fiscal Quarter This FY ");
SPF.addSelectOption("QBL" , "Fiscal Quarter Before Last ");
SPF.addSelectOption("FYBL" , "Fiscal Year Before Last ");
SPF.addSelectOption("Q4LFY" , "Fourth Fiscal Quarter Last FY ");
SPF.addSelectOption("Q4TFY" , "Fourth Fiscal Quarter This FY ");
SPF.addSelectOption("LQ" , "Last Fiscal Quarter ");
SPF.addSelectOption("LQOLFY" , "Last Fiscal Quarter One Fiscal Year Ago ");
SPF.addSelectOption("LFQTP" , "Last Fiscal Quarter to Period ");
SPF.addSelectOption("LFY" , "Last Fiscal Year");
SPF.addSelectOption("LFYTP" , "Last Fiscal Year to Period ");
SPF.addSelectOption("LP" , "Last Period ", isDefaultLP);
SPF.addSelectOption("LPOLQ" , "Last Period One Fiscal Quarter Ago ");
SPF.addSelectOption("LPOLFY" , "Last Period One Fiscal Year Ago ");
SPF.addSelectOption("LR18FP" , "Last Rolling 18 Periods ");
SPF.addSelectOption("LR6FQ" , "Last Rolling 6 Fiscal Quarters ");
SPF.addSelectOption("PBL" , "Period Before Last ", isDefaultPBL);
SPF.addSelectOption("TQOLFY" , "Same Fiscal Quarter Last FY ");
SPF.addSelectOption("TFQOLFYTP" , "Same Fiscal Quarter Last FY to Period ");
SPF.addSelectOption("TPOLFY" , "Same Period Last FY ");
SPF.addSelectOption("TPOLQ" , "Same Period Last Fiscal Quarter ");
SPF.addSelectOption("Q2LFY" , "Second Fiscal Quarter Last FY ");
SPF.addSelectOption("Q2TFY" , "Second Fiscal Quarter This FY ");
SPF.addSelectOption("Q3LFY" , "Third Fiscal Quarter Last FY ");
SPF.addSelectOption("Q3TFY" , "Third Fiscal Quarter This FY ");
SPF.addSelectOption("TQ" , "This Fiscal Quarter ");
SPF.addSelectOption("TFQTP" , "This Fiscal Quarter to Period ");
SPF.addSelectOption("TFY" , "This Fiscal Year ");
SPF.addSelectOption("TFYTP" , "This Fiscal Year to Period ");
SPF.addSelectOption("TP" , "This Period ");


//var startdate =  portlet.addField('startdate','date','Start Date').setLayoutType('outsidebelow', 'startcol');
//var enddate =  portlet.addField('enddate','date','End Date').setLayoutType('outsidebelow', 'startcol');

   var periodFields = "LP";// nlapiGetFieldValue('text');//portlet.getParameter('periodselect'); //"LP";//
//if( SPF == "LQ" )
//  {periodFields = "LQ" }
//  else{periodFields = "LP"}

  var portletsearch =nlapiResolveURL('SUITELET','customscript419','customdeploy1');
   // portletsearch += "&custpage_periodselect=" + periodFields;// + "&SD=" + startdate +  "&ED=" + enddate;

 portlet.setSubmitButton(portletsearch,'Submit', 'pickle' ); 
//  html.getElementsById("server_commands").setAttribute("display", "block");

  
var results =  portlet.addField('custpage_lblproductrating', 'inlinehtml')
   results.setLayoutType('outsidebelow', 'startrow')
   results.setDefaultValue("<iframe frameborder=\"0\" name=\"pickle\" width=\"1250px\" height=\"395px\" src="+ portletsearch+"></iframe>"); 

    portlet.setScript('customscript1517');     

}

