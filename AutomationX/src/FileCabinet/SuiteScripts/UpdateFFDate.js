function movefullfilmentdate( type )
{
  //https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=4844  saved search
 // if ( type == 'scheduled' && type != 'skipped' ) return; //Only runs from schedualer
var context = nlapiGetContext();
var deployId = context.getDeploymentId();
var deployIdNum = parseInt( deployId.slice(-1));
var sorting = "false";  
//  nlapiLogExecution('AUDIT', 'deployIdNum', deployIdNum);
  if( deployIdNum%2==0){sorting = 'true';}
  //  nlapiLogExecution('AUDIT', 'sorting', sorting);

     nlapiLogExecution('DEBUG', 'Start', ' Fulfillment Move 10-2017');
  
var newTranMoveDate = new Date();
var dd = newTranMoveDate.getDate();
var mm = newTranMoveDate.getMonth()+1;
var y = newTranMoveDate.getFullYear();
var NewtranDate =  mm  + '/'+1+ '/'+ y;
  
var columnsA = new Array();
  columnsA[0] =  new nlobjSearchColumn('internalid', 'fulfillingTransaction',"GROUP");
  columnsA[1] =  new nlobjSearchColumn("credithold","customer","GROUP");
  columnsA[2] =  new nlobjSearchColumn("internalid","customerMain","GROUP").setSort(sorting);
  columnsA[3] =  new nlobjSearchColumn("number",null ,"GROUP");  
var searchresults = nlapiSearchRecord('transaction', null, 
                                      [
   ["type","anyof","SalesOrd"], 
   "AND", 
   ["fulfillingtransaction.trandate","within","lastmonth"], 
   "AND", 
   ["status","anyof","SalesOrd:F","SalesOrd:E"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["taxline","is","F"], 
   "AND", 
   ["shipping","is","F"], 
   "AND", 
   ["formulanumeric: {quantityshiprecv}+{quantitypacked}+{quantitypicked}","notlessthanorequalto","0"], 
   "AND", 
   ["formulanumeric: CASE WHEN {quantitybilled} > 0 THEN  {quantitybilled}-{quantityshiprecv} ELSE NULL END","notequalto","0"], 
   "AND", 
   ["fulfillingtransaction.internalidnumber","isnotempty",""], 
   "AND", 
//   ["custbody68","noneof","20"], 
 //  "AND", 
   ["fulfillingtransaction.status","anyof","ItemShip:A","ItemShip:B", "ItemShip:C"],
     "AND", 
   ["numbertext","isnot","SO251503"]
], columnsA ); 
  // results from saved search Fulfillment Move 10-2017  //nlapiLogExecution('', 'start', ' Fulfillment Move 10-2017');
  // 
for ( var y = 0; searchresults != null && y < searchresults.length;y++ )
 		{
	//var searchresult = searchresults[ y ];	
var docNum =  searchresults[y].getValue(columnsA[3]); 
	var iid =  searchresults[y].getValue(columnsA[0]); 
  
// var ishold =searchresults[y].getValue(columnsA[1]);         
//  var isholdtext = searchresults[y].getText(columnsA[1]);        
//  var custid = searchresults[y].getValue(columnsA[2]);          
//  nlapiLogExecution('DEBUG', 'custids', custid +' '+ isholdtext);
//if(isholdtext != "OFF" && custid)
//  {
// nlapiLogExecution('DEBUG', 'custidsloop', custid);
// nlapiSubmitField('customer', custid , 'creditholdoverride', 'OFF');
// nlapiLogExecution('AUDIT', 'custid', custid + ' ' + ishold + ' ' + isholdtext);
// nlapiLogExecution('AUDIT', 'FFID', iid);
// nlapiSubmitField('itemfulfillment', iid , 'trandate', NewtranDate);
// nlapiSubmitField('customer', custid , 'creditholdoverride', ishold);
//  }
//else

  if(iid){  nlapiLogExecution('DEBUG', 'start ', docNum + '  Fulfillment Move 10-2017   '); nlapiSubmitField('itemfulfillment', iid , 'trandate', NewtranDate);  }

		}
   nlapiLogExecution('DEBUG', 'end', 'End Fulfillment Move 10-2017');

////////////////////////////////////////////////////////
  var columns  = new Array();
  columns[0] =  new nlobjSearchColumn("internalid").setSort(sorting);
  columns[1] =  new nlobjSearchColumn("credithold","customer",null);
  columns[2] =  new nlobjSearchColumn("internalid","customerMain",null);
  columns[3] =  new nlobjSearchColumn("number",null ,null);
var searchresultss = nlapiSearchRecord('transaction', null, 
[
   ["type","anyof","ItemShip"], 
   "AND", 
   ["mainline","is","T"], 
   "AND", 
   ["status","anyof","ItemShip:B","ItemShip:A"], 
   "AND", 
   [["trandate","onorafter","daysago180","daysago180"],"AND",["trandate","before","startofthismonth"]]
], columns ); // results from saved search Fulfillment Move 10-2017 Pick pack
  
   nlapiLogExecution('DEBUG', 'start', ' Fulfillment Move 10-2017 Pick pack');
  
 for ( var i = 0; searchresultss != null && i < searchresultss.length; i++ )
 		{
		var iids =  searchresultss[i].getValue(columns[0]);
              var docNumA =  searchresultss[i].getValue(columns[3]);
//   var ishold =searchresultss[i].getValue(columns[1]);
//   var isholdtext = searchresultss[i].getText(columns[1]);
//   var custid = searchresultss[i].getValue(columns[2]);
//   nlapiLogExecution('DEBUG', 'custid', custid);
//   if(isholdtext != "OFF" && custid !="" && 1==2)
//   {
//   nlapiSubmitField('customer', custid , 'creditholdoverride', 'OFF');
//   nlapiLogExecution('DEBUG', 'holdstatus', custid + ' ' + ishold + ' ' + isholdtext);
//   nlapiSubmitField('itemfulfillment', iids , 'trandate', NewtranDate);
//   nlapiSubmitField('customer', custid , 'creditholdoverride', "OFF");
//   }
//else {

if(iids){nlapiLogExecution('DEBUG', 'start ', docNumA + '  Fulfillment Move 10-2017 Pick pack ' );  nlapiSubmitField('itemfulfillment', iids , 'trandate', NewtranDate);}

		}
     nlapiLogExecution('DEBUG', 'end', ' End Fulfillment Move 10-2017 Pick pack');
  }

