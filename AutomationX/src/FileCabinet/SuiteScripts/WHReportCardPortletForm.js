function whPortlet(portlet, column)
{
  var d = new Date();
var n = d.getDay();
 var z = parseInt(d.getDate());  
var defaultthismonth = true;
var defaultlastmonth = false;
if(z<=10){defaultthismonth = false;  defaultlastmonth = true;}
  
    portlet.setTitle('Warehouse Report Card');
     var SPF = portlet.addField('custpage_periodselect','select','Select Cycle Count Range').setLayoutType('outsidebelow', 'startcol');
SPF.addSelectOption("lastmonth" ,  "last month", defaultlastmonth);
SPF.addSelectOption("lastmonthtodate" ,  "last month to date");
SPF.addSelectOption("lastweek" ,  "last week");
SPF.addSelectOption("lastweektodate" ,  "last week to date");
SPF.addSelectOption("lastyear" ,  "last year");
SPF.addSelectOption("lastyeartodate" ,  "last year to date");
SPF.addSelectOption("thisfiscalyear" ,  "this fiscal year");
SPF.addSelectOption("thisfiscalyeartodate" ,  "this fiscal year to date");
SPF.addSelectOption("thismonth" ,  "this month", defaultthismonth);
SPF.addSelectOption("thismonthtodate" ,  "this month to date");
SPF.addSelectOption("today" ,  "today");
SPF.addSelectOption("thisweektodate" ,  "this week to date");
SPF.addSelectOption("thisyear" ,  "this year");
SPF.addSelectOption("thisyeartodate" ,  "this year to date");
SPF.addSelectOption("weekbeforelast" ,  "week before last");
SPF.addSelectOption("weekbeforelasttodate" ,  "week before last to date");
SPF.addSelectOption("yesterday" ,  "yesterday");
SPF.addSelectOption("fiscalhalfbeforelast" ,  "fiscal half before last");
SPF.addSelectOption("fiscalhalfbeforelasttodate" ,  "fiscal half before last to date");
SPF.addSelectOption("threefiscalquartersago" ,  "three fiscal quarters ago");
SPF.addSelectOption("fiscalquarterbeforelast" ,  "fiscal quarter before last");
SPF.addSelectOption("fiscalquarterbeforelasttodate" ,  "fiscal quarter before last to date");
SPF.addSelectOption("threefiscalquartersagotodate" ,  "three fiscal quarters ago to date");
SPF.addSelectOption("threefiscalyearsago" ,  "three fiscal years ago");
SPF.addSelectOption("fiscalyearbeforelast" ,  "fiscal year before last");
SPF.addSelectOption("fiscalyearbeforelasttodate" ,  "fiscal year before last to date");
SPF.addSelectOption("threefiscalyearsagotodate" ,  "three fiscal years ago to date");
SPF.addSelectOption("lastfiscalhalf" ,  "last fiscal half");
SPF.addSelectOption("lastfiscalhalfonefiscalyearago" ,  "last fiscal half one fiscal year ago");
SPF.addSelectOption("lastfiscalhalftodate" ,  "last fiscal half to date");
SPF.addSelectOption("lastfiscalquarter" ,  "last fiscal quarter");
SPF.addSelectOption("lastfiscalquartertwofiscalyearsago" ,  "last fiscal quarter two fiscal years ago");
SPF.addSelectOption("lastfiscalquarteronefiscalyearago" ,  "last fiscal quarter one fiscal year ago");
SPF.addSelectOption("lastfiscalquartertodate" ,  "last fiscal quarter to date");
SPF.addSelectOption("lastfiscalyear" ,  "last fiscal year");
SPF.addSelectOption("lastfiscalyeartodate" ,  "last fiscal year to date");
SPF.addSelectOption("lastmonthtwofiscalquartersago" ,  "last month two fiscal quarters ago");
SPF.addSelectOption("lastmonthtwofiscalyearsago" ,  "last month two fiscal years ago");
SPF.addSelectOption("lastmonthonefiscalquarterago" ,  "last month one fiscal quarter ago");
SPF.addSelectOption("lastmonthonefiscalyearago" ,  "last month one fiscal year ago");
SPF.addSelectOption("lastrollinghalf" ,  "last rolling half");
SPF.addSelectOption("lastrollingquarter" ,  "last rolling quarter");
SPF.addSelectOption("lastrollingyear" ,  "last rolling year");
SPF.addSelectOption("threemonthsago" ,  "three months ago");
SPF.addSelectOption("monthbeforelast" ,  "month before last");
SPF.addSelectOption("monthbeforelasttodate" ,  "month before last to date");
SPF.addSelectOption("threemonthsagotodate" ,  "three months ago to date");
SPF.addSelectOption("previousoneday" ,  "previous one day");
SPF.addSelectOption("previousonehalf" ,  "previous one half");
SPF.addSelectOption("previousonemonth" ,  "previous one month");
SPF.addSelectOption("previousonequarter" ,  "previous one quarter");
SPF.addSelectOption("previousoneweek" ,  "previous one week");
SPF.addSelectOption("previousoneyear" ,  "previous one year");
SPF.addSelectOption("previousrollinghalf" ,  "previous rolling half");
SPF.addSelectOption("previousrollingquarter" ,  "previous rolling quarter");
SPF.addSelectOption("previousrollingyear" ,  "previous rolling year");
SPF.addSelectOption("samefiscalhalflastfiscalyear" ,  "same fiscal half last fiscal year");
SPF.addSelectOption("samefiscalhalflastfiscalyeartodate" ,  "same fiscal half last fiscal year to date");
SPF.addSelectOption("samefiscalquarterfiscalyearbeforelast" ,  "same fiscal quarter fiscal year before last");
SPF.addSelectOption("samefiscalquarterlastfiscalyear" ,  "same fiscal quarter last fiscal year");
SPF.addSelectOption("samefiscalquarterlastfiscalyeartodate" ,  "same fiscal quarter last fiscal year to date");
SPF.addSelectOption("samemonthfiscalquarterbeforelast" ,  "same month fiscal quarter before last");
SPF.addSelectOption("samemonthfiscalyearbeforelast" ,  "same month fiscal year before last");
SPF.addSelectOption("samemonthlastfiscalquarter" ,  "same month last fiscal quarter");
SPF.addSelectOption("samemonthlastfiscalquartertodate" ,  "same month last fiscal quarter to date");
SPF.addSelectOption("samemonthlastfiscalyear" ,  "same month last fiscal year");
SPF.addSelectOption("samemonthlastfiscalyeartodate" ,  "same month last fiscal year to date");
SPF.addSelectOption("sameweekfiscalyearbeforelast" ,  "same week fiscal year before last");
SPF.addSelectOption("sameweeklastfiscalyear" ,  "same week last fiscal year");
SPF.addSelectOption("thisbusinessweek" ,  "this business week");
SPF.addSelectOption("thisfiscalhalf" ,  "this fiscal half");
SPF.addSelectOption("thisfiscalhalftodate" ,  "this fiscal half to date");
SPF.addSelectOption("thisfiscalquarter" ,  "this fiscal quarter");
SPF.addSelectOption("thisfiscalquartertodate" ,  "this fiscal quarter to date");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 var IDJ = portlet.addField('custpage_invadj','select','Select Inventory Adjustment Date Range').setLayoutType('outsidebelow', 'startcol');
IDJ.addSelectOption("lastmonth" ,  "last month", defaultlastmonth);
IDJ.addSelectOption("lastmonthtodate" ,  "last month to date");
IDJ.addSelectOption("lastweek" ,  "last week");
IDJ.addSelectOption("lastweektodate" ,  "last week to date");
IDJ.addSelectOption("lastyear" ,  "last year");
IDJ.addSelectOption("lastyeartodate" ,  "last year to date");
IDJ.addSelectOption("thisfiscalyear" ,  "this fiscal year");
IDJ.addSelectOption("thisfiscalyeartodate" ,  "this fiscal year to date");
IDJ.addSelectOption("thismonth" ,  "this month", defaultthismonth);
IDJ.addSelectOption("thismonthtodate" ,  "this month to date");
IDJ.addSelectOption("today" ,  "today");
IDJ.addSelectOption("thisweektodate" ,  "this week to date");
IDJ.addSelectOption("thisyear" ,  "this year");
IDJ.addSelectOption("thisyeartodate" ,  "this year to date");
IDJ.addSelectOption("weekbeforelast" ,  "week before last");
IDJ.addSelectOption("weekbeforelasttodate" ,  "week before last to date");
IDJ.addSelectOption("yesterday" ,  "yesterday");
IDJ.addSelectOption("fiscalhalfbeforelast" ,  "fiscal half before last");
IDJ.addSelectOption("fiscalhalfbeforelasttodate" ,  "fiscal half before last to date");
IDJ.addSelectOption("threefiscalquartersago" ,  "three fiscal quarters ago");
IDJ.addSelectOption("fiscalquarterbeforelast" ,  "fiscal quarter before last");
IDJ.addSelectOption("fiscalquarterbeforelasttodate" ,  "fiscal quarter before last to date");
IDJ.addSelectOption("threefiscalquartersagotodate" ,  "three fiscal quarters ago to date");
IDJ.addSelectOption("threefiscalyearsago" ,  "three fiscal years ago");
IDJ.addSelectOption("fiscalyearbeforelast" ,  "fiscal year before last");
IDJ.addSelectOption("fiscalyearbeforelasttodate" ,  "fiscal year before last to date");
IDJ.addSelectOption("threefiscalyearsagotodate" ,  "three fiscal years ago to date");
IDJ.addSelectOption("lastfiscalhalf" ,  "last fiscal half");
IDJ.addSelectOption("lastfiscalhalfonefiscalyearago" ,  "last fiscal half one fiscal year ago");
IDJ.addSelectOption("lastfiscalhalftodate" ,  "last fiscal half to date");
IDJ.addSelectOption("lastfiscalquarter" ,  "last fiscal quarter");
IDJ.addSelectOption("lastfiscalquartertwofiscalyearsago" ,  "last fiscal quarter two fiscal years ago");
IDJ.addSelectOption("lastfiscalquarteronefiscalyearago" ,  "last fiscal quarter one fiscal year ago");
IDJ.addSelectOption("lastfiscalquartertodate" ,  "last fiscal quarter to date");
IDJ.addSelectOption("lastfiscalyear" ,  "last fiscal year");
IDJ.addSelectOption("lastfiscalyeartodate" ,  "last fiscal year to date");
IDJ.addSelectOption("lastmonthtwofiscalquartersago" ,  "last month two fiscal quarters ago");
IDJ.addSelectOption("lastmonthtwofiscalyearsago" ,  "last month two fiscal years ago");
IDJ.addSelectOption("lastmonthonefiscalquarterago" ,  "last month one fiscal quarter ago");
IDJ.addSelectOption("lastmonthonefiscalyearago" ,  "last month one fiscal year ago");
IDJ.addSelectOption("lastrollinghalf" ,  "last rolling half");
IDJ.addSelectOption("lastrollingquarter" ,  "last rolling quarter");
IDJ.addSelectOption("lastrollingyear" ,  "last rolling year");
IDJ.addSelectOption("threemonthsago" ,  "three months ago");
IDJ.addSelectOption("monthbeforelast" ,  "month before last");
IDJ.addSelectOption("monthbeforelasttodate" ,  "month before last to date");
IDJ.addSelectOption("threemonthsagotodate" ,  "three months ago to date");
IDJ.addSelectOption("previousoneday" ,  "previous one day");
IDJ.addSelectOption("previousonehalf" ,  "previous one half");
IDJ.addSelectOption("previousonemonth" ,  "previous one month");
IDJ.addSelectOption("previousonequarter" ,  "previous one quarter");
IDJ.addSelectOption("previousoneweek" ,  "previous one week");
IDJ.addSelectOption("previousoneyear" ,  "previous one year");
IDJ.addSelectOption("previousrollinghalf" ,  "previous rolling half");
IDJ.addSelectOption("previousrollingquarter" ,  "previous rolling quarter");
IDJ.addSelectOption("previousrollingyear" ,  "previous rolling year");
IDJ.addSelectOption("samefiscalhalflastfiscalyear" ,  "same fiscal half last fiscal year");
IDJ.addSelectOption("samefiscalhalflastfiscalyeartodate" ,  "same fiscal half last fiscal year to date");
IDJ.addSelectOption("samefiscalquarterfiscalyearbeforelast" ,  "same fiscal quarter fiscal year before last");
IDJ.addSelectOption("samefiscalquarterlastfiscalyear" ,  "same fiscal quarter last fiscal year");
IDJ.addSelectOption("samefiscalquarterlastfiscalyeartodate" ,  "same fiscal quarter last fiscal year to date");
IDJ.addSelectOption("samemonthfiscalquarterbeforelast" ,  "same month fiscal quarter before last");
IDJ.addSelectOption("samemonthfiscalyearbeforelast" ,  "same month fiscal year before last");
IDJ.addSelectOption("samemonthlastfiscalquarter" ,  "same month last fiscal quarter");
IDJ.addSelectOption("samemonthlastfiscalquartertodate" ,  "same month last fiscal quarter to date");
IDJ.addSelectOption("samemonthlastfiscalyear" ,  "same month last fiscal year");
IDJ.addSelectOption("samemonthlastfiscalyeartodate" ,  "same month last fiscal year to date");
IDJ.addSelectOption("sameweekfiscalyearbeforelast" ,  "same week fiscal year before last");
IDJ.addSelectOption("sameweeklastfiscalyear" ,  "same week last fiscal year");
IDJ.addSelectOption("thisbusinessweek" ,  "this business week");
IDJ.addSelectOption("thisfiscalhalf" ,  "this fiscal half");
IDJ.addSelectOption("thisfiscalhalftodate" ,  "this fiscal half to date");
IDJ.addSelectOption("thisfiscalquarter" ,  "this fiscal quarter");
IDJ.addSelectOption("thisfiscalquartertodate" ,  "this fiscal quarter to date");

////////////////////////////////////////////////////////////////////
  var thisweekDefault =false;
  var lastweekDefault =false;

if(n<= 1){ lastweekDefault = true;    }else{thisweekDefault=true; }
  
    var CCF = portlet.addField('custpage_cyclecount','select','Select Miss Report Range').setLayoutType('outsidebelow', 'startcol');
CCF.addSelectOption("lastmonth" ,  "last month");
CCF.addSelectOption("lastmonthtodate" ,  "last month to date");
CCF.addSelectOption("lastweek" ,  "last week", lastweekDefault);
CCF.addSelectOption("lastweektodate" ,  "last week to date");
CCF.addSelectOption("lastyear" ,  "last year");
CCF.addSelectOption("lastyeartodate" ,  "last year to date");
CCF.addSelectOption("thisfiscalyear" ,  "this fiscal year");
CCF.addSelectOption("thisfiscalyeartodate" ,  "this fiscal year to date");
CCF.addSelectOption("thismonth" ,  "this month");
CCF.addSelectOption("thismonthtodate" ,  "this month to date");
CCF.addSelectOption("today" ,  "today");
CCF.addSelectOption("thisweektodate" ,  "this week to date",thisweekDefault  );
CCF.addSelectOption("thisyear" ,  "this year");
CCF.addSelectOption("thisyeartodate" ,  "this year to date");
CCF.addSelectOption("weekbeforelast" ,  "week before last");
CCF.addSelectOption("weekbeforelasttodate" ,  "week before last to date");
CCF.addSelectOption("yesterday" ,  "yesterday");
CCF.addSelectOption("fiscalhalfbeforelast" ,  "fiscal half before last");
CCF.addSelectOption("fiscalhalfbeforelasttodate" ,  "fiscal half before last to date");
CCF.addSelectOption("threefiscalquartersago" ,  "three fiscal quarters ago");
CCF.addSelectOption("fiscalquarterbeforelast" ,  "fiscal quarter before last");
CCF.addSelectOption("fiscalquarterbeforelasttodate" ,  "fiscal quarter before last to date");
CCF.addSelectOption("threefiscalquartersagotodate" ,  "three fiscal quarters ago to date");
CCF.addSelectOption("threefiscalyearsago" ,  "three fiscal years ago");
CCF.addSelectOption("fiscalyearbeforelast" ,  "fiscal year before last");
CCF.addSelectOption("fiscalyearbeforelasttodate" ,  "fiscal year before last to date");
CCF.addSelectOption("threefiscalyearsagotodate" ,  "three fiscal years ago to date");
CCF.addSelectOption("lastfiscalhalf" ,  "last fiscal half");
CCF.addSelectOption("lastfiscalhalfonefiscalyearago" ,  "last fiscal half one fiscal year ago");
CCF.addSelectOption("lastfiscalhalftodate" ,  "last fiscal half to date");
CCF.addSelectOption("lastfiscalquarter" ,  "last fiscal quarter");
CCF.addSelectOption("lastfiscalquartertwofiscalyearsago" ,  "last fiscal quarter two fiscal years ago");
CCF.addSelectOption("lastfiscalquarteronefiscalyearago" ,  "last fiscal quarter one fiscal year ago");
CCF.addSelectOption("lastfiscalquartertodate" ,  "last fiscal quarter to date");
CCF.addSelectOption("lastfiscalyear" ,  "last fiscal year");
CCF.addSelectOption("lastfiscalyeartodate" ,  "last fiscal year to date");
CCF.addSelectOption("lastmonthtwofiscalquartersago" ,  "last month two fiscal quarters ago");
CCF.addSelectOption("lastmonthtwofiscalyearsago" ,  "last month two fiscal years ago");
CCF.addSelectOption("lastmonthonefiscalquarterago" ,  "last month one fiscal quarter ago");
CCF.addSelectOption("lastmonthonefiscalyearago" ,  "last month one fiscal year ago");
CCF.addSelectOption("lastrollinghalf" ,  "last rolling half");
CCF.addSelectOption("lastrollingquarter" ,  "last rolling quarter");
CCF.addSelectOption("lastrollingyear" ,  "last rolling year");
CCF.addSelectOption("threemonthsago" ,  "three months ago");
CCF.addSelectOption("monthbeforelast" ,  "month before last");
CCF.addSelectOption("monthbeforelasttodate" ,  "month before last to date");
CCF.addSelectOption("threemonthsagotodate" ,  "three months ago to date");
CCF.addSelectOption("previousoneday" ,  "previous one day");
CCF.addSelectOption("previousonehalf" ,  "previous one half");
CCF.addSelectOption("previousonemonth" ,  "previous one month");
CCF.addSelectOption("previousonequarter" ,  "previous one quarter");
CCF.addSelectOption("previousoneweek" ,  "previous one week");
CCF.addSelectOption("previousoneyear" ,  "previous one year");
CCF.addSelectOption("previousrollinghalf" ,  "previous rolling half");
CCF.addSelectOption("previousrollingquarter" ,  "previous rolling quarter");
CCF.addSelectOption("previousrollingyear" ,  "previous rolling year");
CCF.addSelectOption("samefiscalhalflastfiscalyear" ,  "same fiscal half last fiscal year");
CCF.addSelectOption("samefiscalhalflastfiscalyeartodate" ,  "same fiscal half last fiscal year to date");
CCF.addSelectOption("samefiscalquarterfiscalyearbeforelast" ,  "same fiscal quarter fiscal year before last");
CCF.addSelectOption("samefiscalquarterlastfiscalyear" ,  "same fiscal quarter last fiscal year");
CCF.addSelectOption("samefiscalquarterlastfiscalyeartodate" ,  "same fiscal quarter last fiscal year to date");
CCF.addSelectOption("samemonthfiscalquarterbeforelast" ,  "same month fiscal quarter before last");
CCF.addSelectOption("samemonthfiscalyearbeforelast" ,  "same month fiscal year before last");
CCF.addSelectOption("samemonthlastfiscalquarter" ,  "same month last fiscal quarter");
CCF.addSelectOption("samemonthlastfiscalquartertodate" ,  "same month last fiscal quarter to date");
CCF.addSelectOption("samemonthlastfiscalyear" ,  "same month last fiscal year");
CCF.addSelectOption("samemonthlastfiscalyeartodate" ,  "same month last fiscal year to date");
CCF.addSelectOption("sameweekfiscalyearbeforelast" ,  "same week fiscal year before last");
CCF.addSelectOption("sameweeklastfiscalyear" ,  "same week last fiscal year");
CCF.addSelectOption("thisbusinessweek" ,  "this business week");
CCF.addSelectOption("thisfiscalhalf" ,  "this fiscal half");
CCF.addSelectOption("thisfiscalhalftodate" ,  "this fiscal half to date");
CCF.addSelectOption("thisfiscalquarter" ,  "this fiscal quarter");
CCF.addSelectOption("thisfiscalquartertodate" ,  "this fiscal quarter to date");



  //////////////////////////////////////////////////////////////////
  
  
  
  
  
  ///////////////////////////////////////////////////////////////////////


  var portletsearch =nlapiResolveURL('SUITELET','customscript725','customdeploy1');
 
 portlet.setSubmitButton(portletsearch,'Submit', 'pickle' ); 
  
var results =  portlet.addField('custpage_lblproductrating', 'inlinehtml')
   results.setLayoutType('outsidebelow', 'startrow')
   results.setDefaultValue("<iframe frameborder=\"0\" name=\"pickle\" width=\"1250px\" height=\"395px\" src="+ portletsearch+"></iframe>"); 

         

}
