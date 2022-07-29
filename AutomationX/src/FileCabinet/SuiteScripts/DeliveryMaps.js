function deliverymap(request,response)
{

 var form = nlapiCreateForm('Delivery Directions', false);
     form.setTitle('Map Route');
  form.setScript('customscript1492'); // sets the script on the client side
  
 ///////////////header fields 
 
  var homelocation = nlapiLookupField('employee', nlapiGetUser(), 'location', false);
  
  
  var locationidd = request.getParameter('custpage_locationid');
  
  if(!locationidd){ locationidd = homelocation;   }
parseInt(locationidd);
 form.addField('custpage_locationid','select','Home Location', 'location').setLayoutType('normal', 'startcol'  ).setDefaultValue(locationidd);  
  
 
  
// 
////////////////end header fields
 var deliveriesColumns = new Array();
  deliveriesColumns[0] = new nlobjSearchColumn("location", null ,'GROUP'); 
  //deliveriesColumns[1] = new nlobjSearchColumn("trandate").setSort(true); 
  //deliveriesColumns[2] = new nlobjSearchColumn("internalid");
  deliveriesColumns[1] = new nlobjSearchColumn("internalid","customer", 'GROUP').setSort(true);
 // deliveriesColumns[4] = new nlobjSearchColumn("statusref"); 
 // deliveriesColumns[5] = new nlobjSearchColumn("shipmethod");
  deliveriesColumns[2] =  new nlobjSearchColumn("formulatext",null,"GROUP").setFormula("(CASE WHEN  {shipaddress1}   IS NOT NULL THEN REPLACE( {shipaddress1}  , ' ', ' ') ELSE NULL END)  || (CASE WHEN  {shipaddress2}   IS NOT NULL THEN  ' ' || REPLACE( {shipaddress2}  , ' ', ' ') ELSE NULL END)  || (CASE WHEN  {shipaddress3}  IS NOT NULL THEN  ' ' || REPLACE( {shipaddress3} , ' ', ' ') ELSE NULL END)  || (CASE WHEN  {shipcity} IS NOT NULL THEN  ' ' || REPLACE( {shipcity}, ' ', ' ') ELSE NULL END)  || (CASE WHEN {shipstate}  IS NOT NULL THEN  ' ' || REPLACE({shipstate} , ' ', ' ') ELSE NULL END)  || (CASE WHEN {shipzip} IS NOT NULL THEN  ' ' || REPLACE({shipzip}, ' ', ' ') ELSE NULL END)");
   ////////////////////////////////////////////////////////////////////////
 /////////////////////customer address
 //////////////////////////////////////////////////////////////////////// 
  
  deliveriesColumns[3] = new nlobjSearchColumn("formulatext" , null ,'GROUP').setFormula("'|'||REPLACE((   (CASE WHEN  {shipaddress1}   IS NOT NULL THEN REPLACE( {shipaddress1}  , ' ', '+') ELSE NULL END)  || (CASE WHEN  {shipaddress2}   IS NOT NULL THEN  '+' || REPLACE( {shipaddress2}  , ' ', '+') ELSE NULL END)  || (CASE WHEN  {shipaddress3}  IS NOT NULL THEN  '+' || REPLACE( {shipaddress3} , ' ', '+') ELSE NULL END)  || (CASE WHEN  {shipcity} IS NOT NULL THEN  '+' || REPLACE( {shipcity}, ' ', '+') ELSE NULL END)  || (CASE WHEN {shipstate}  IS NOT NULL THEN  '+' || REPLACE({shipstate} , ' ', '+') ELSE NULL END)  || (CASE WHEN {shipzip} IS NOT NULL THEN  '+' || REPLACE({shipzip}, ' ', '+') ELSE NULL END)    ), ' ','+')");
 ////////////////////////////////////////////////////////////////////////
 /////////////////////waypoint
 //////////////////////////////////////////////////////////////////////// 
  deliveriesColumns[4] = new nlobjSearchColumn("formulatext", null ,'GROUP').setFormula("(CASE WHEN  {location.address1}   IS NOT NULL THEN REPLACE( {location.address1}  , ' ', '+') ELSE NULL END)  || (CASE WHEN  {location.address2}   IS NOT NULL THEN  '+' || REPLACE( {location.address2}  , ' ', '+') ELSE NULL END)  || (CASE WHEN  {location.address3}  IS NOT NULL THEN  '+' || REPLACE( {location.address3} , ' ', '+') ELSE NULL END)  || (CASE WHEN  {location.city} IS NOT NULL THEN  '+' || REPLACE( {location.city}, ' ', '+') ELSE NULL END)  || (CASE WHEN {location.state}  IS NOT NULL THEN  '+' || REPLACE({location.state} , ' ', '+') ELSE NULL END)  || (CASE WHEN {location.zip} IS NOT NULL THEN  '+' || REPLACE({location.zip}, ' ', '+') ELSE NULL END)"); 
 ////////////////////////////////////////////////////////////////////////
 /////////////////////location address
 ////////////////////////////////////////////////////////////////////////
 
deliveriesColumns[5] =   new nlobjSearchColumn("formulatext",null,"GROUP").setFormula("'$' || (CASE WHEN  {shipaddress1}   IS NOT NULL THEN REPLACE( {shipaddress1}  , ' ', '+') ELSE NULL END)  || (CASE WHEN  {shipcity} IS NOT NULL THEN  '+' || REPLACE( {shipcity}, ' ', '+') ELSE NULL END)  || (CASE WHEN {shipstate}  IS NOT NULL THEN  '+' || REPLACE({shipstate} , ' ', '+') ELSE NULL END)  || (CASE WHEN {shipzip} IS NOT NULL THEN  '+' || REPLACE({shipzip}, ' ', '+') ELSE NULL END)");
   
 ////////////////////////////////////////////////////////////////////////
 /////////////////////routexl address
 ////////////////////////////////////////////////////////////////////////
 

  var deliverySearch = nlapiSearchRecord("itemfulfillment",null,
[
   ["type","anyof","ItemShip"], 
   "AND", 
   ["shipmethod","anyof","2229"], 
   "AND", 
   ["createdfrom.status","anyof","SalesOrd:A","SalesOrd:B","SalesOrd:C","SalesOrd:D","SalesOrd:E","SalesOrd:F","TrnfrOrd:F","TrnfrOrd:E"], 
   "AND", 
   ["status","anyof","ItemShip:C"], 
   "AND", 
   ["formulanumeric: Case when LENGTH({custbodycustbodysavedsignature_ff}) > 0 THEN 1 ELSE 0 END","equalto","0"], 
   "AND", 
   ["trandate","onorafter","daysago60"], 
   "AND", 
   ["mainline","is","T"], 
   "AND", 
   ["formulanumeric: INSTR({user.custentity353}, {locationnohierarchy} )","greaterthan","0"]
], 

deliveriesColumns

);
   nlapiLogExecution('DEBUG', 'deliverySearch.length', deliverySearch.length);
var delCount = 0; if(deliverySearch){ delCount =  deliverySearch.length;}
//var wayPoints = "";
  
  
    ////////////////////start destination location
    var destinationHomeAdrsColumns = new Array();
  destinationHomeAdrsColumns[0] =    new nlobjSearchColumn("formulatext").setFormula("(CASE WHEN  {address1}   IS NOT NULL THEN REPLACE( {address1}  , ' ', '+') ELSE NULL END) || (CASE WHEN  {address2}   IS NOT NULL THEN  '+' || REPLACE( {address2}  , ' ', '+') ELSE NULL END) || (CASE WHEN  {address3}  IS NOT NULL THEN  '+' || REPLACE( {address3} , ' ', '+') ELSE NULL END) || (CASE WHEN  {city} IS NOT NULL THEN  '+' || REPLACE( {city}, ' ', '+') ELSE NULL END) || (CASE WHEN {state}  IS NOT NULL THEN  '+' || REPLACE({state} , ' ', '+') ELSE NULL END) || (CASE WHEN {zip} IS NOT NULL THEN  '+' || REPLACE({zip}, ' ', '+') ELSE NULL END)");
  
  var destinationHomeAdrs = nlapiSearchRecord("location",null,
[
  ["internalid","anyof",parseInt(locationidd)]  
], 
destinationHomeAdrsColumns
);

var homeLocAdrs =   destinationHomeAdrs[0].getValue(destinationHomeAdrsColumns[0]);  if(!destinationHomeAdrs){ destinationHomeAdrs =  '6737+Poss+Road+Ste.+301+Leon+Valley+TX+78238-2298';}
  
  ///////////////////////////end destination location
  
  var ffList = form.addSubList('custpagesublist','inlineeditor','Transactions: ' + delCount);  //inlineeditor
  var carr = new Array();   
         if(deliverySearch){
  for(var i=0; i < deliverySearch.length; i++)
  {
    nlapiLogExecution('DEBUG', 'homeLocAdrs', homeLocAdrs);
    var Dellocation = deliverySearch[i].getValue(deliveriesColumns[0]);
  //  var transdate = deliverySearch[i].getValue(deliveriesColumns[1]);
  //  var ffNum = deliverySearch[i].getValue(deliveriesColumns[2]);
    var cust = deliverySearch[i].getValue(deliveriesColumns[1]);
 //   var ffstatus = deliverySearch[i].getValue(deliveriesColumns[4]);
//    var shipMeth = deliverySearch[i].getValue(deliveriesColumns[5]);
    var shipArs = deliverySearch[i].getValue(deliveriesColumns[2]);
    var waypoint = deliverySearch[i].getValue(deliveriesColumns[3]); 
    var routeXL = deliverySearch[i].getValue(deliveriesColumns[5]); 
   // var rowstring = {'locations':Dellocation, 'trandate':transdate , 'tranids':ffNum, 'entitys':cust,  'statusref':ffstatus, 'shipmethod':shipMeth, 'shipaddress':shipArs, 'waypoints':waypoint,  'locationadrs':homeLocAdrs };
    var rowstring = {'locations':Dellocation, 'entitys':cust,   'shipaddress':shipArs, 'waypoints':waypoint,  'locationadrs':homeLocAdrs, 'routexl':routeXL };
     
    
    carr[i]= rowstring ;
  }
       }
  
       //create the Fields for the Sublist
ffList.addField('include','checkbox', 'Add to Route', null).setDisplayType('entry').setDefaultValue('F');  
ffList.addField('locations','select', 'location', 'location').setDisplayType('disabled'); 
//ffList.addField('tranids','select', 'Transaction', 'transaction').setDisplayType('entry'); 
ffList.addField('entitys', 'select', 'customer', 'customer').setDisplayType('entry');
//ffList.addField('ffstatus', 'text', 'Status', null).setDisplayType('disabled');

ffList.addField('shipaddress', 'text', 'Address', null).setDisplayType('disabled');
ffList.addField('waypoints', 'text', 'waypoint', null).setDisplayType('hidden'); //hidden
ffList.addField('locationadrs', 'text', 'homelocation', null).setDisplayType('hidden'); //hidden
ffList.addField('routexl', 'text', 'routeXL', null).setDisplayType('hidden'); //hidden
   ffList.setLineItemValues( carr);

  
  form.addButton('custpage_createQuote', 'Get Route', 'deliverymapclient()');
 form.addButton('custpage_createQuote', 'Compare', 'planroute()');
  
  form.addButton('custpage_createQuote', 'Check All', 'checkall()'); 
  form.addButton('custpage_createQuote', 'Uncheck All', 'Uncheckall()'); 
  
     response.writePage( form );
  


}