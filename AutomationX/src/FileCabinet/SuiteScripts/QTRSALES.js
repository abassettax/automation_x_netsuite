////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function qtrsales( type )
{
  var columns = new Array();
columns[0] = new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN  {trandate} ELSE {saleseffectivedate} end),'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM')  THEN {netamountnotax}  ELSE 0 END)-(CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN  {trandate} ELSE {saleseffectivedate} end),'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-6),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-4),'YYYYMM')  THEN {netamountnotax} ELSE 0 END)"); //QTR over QTR Change
  
columns[1] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN  {trandate} ELSE {saleseffectivedate} end),'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM')  THEN {netamountnotax}  ELSE 0 END)");  // LRQ
  
columns[2] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN  {trandate} ELSE {saleseffectivedate} end),'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-6),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-4),'YYYYMM')  THEN {netamountnotax} ELSE 0 END)");  //PRQ
  
columns[3] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN  {trandate} ELSE {saleseffectivedate} end),'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM')  THEN {netamountnotax} ELSE 0 END)");  //SRQLY
  
columns[4] =    new nlobjSearchColumn("internalid","customer","GROUP");
  
columns[5] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN  {trandate} ELSE {saleseffectivedate} end),'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-6),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM')  THEN {netamountnotax} ELSE 0 END)");  // LRH
  
var SalesSearch = nlapiCreateSearch("transaction",
[
   ["mainline","is","T"], 
   "AND", 
   ["type","anyof","CashSale","CustInvc","CustCred","CashRfnd"], 
   "AND", 
      ["saleseffectivedate","onorafter","daysago600"], 
   "AND", 
   ["customer.isinactive","is","F"]//, 
 //  "AND", 
 //  ["customer.internalid","anyof","1011"]
], 

columns
);
 
  var updatedrec = 0;
  
  try
    {
      LOOPMARKER = nlapiGetContext().getSetting('SCRIPT','custscript_loop_marker');
      LOOPMARKER = (LOOPMARKER!=null && LOOPMARKER!=undefined)? parseInt(LOOPMARKER) : 0 
  
var searchResults = SalesSearch.runSearch();
    //   nlapiLogExecution('debug', 'searchcount', SalesSearch.length  );
  var resultIndex = LOOPMARKER; 
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
do 
{
  
  		//var searchresults = nlapiSearchRecord('transaction',2326, null, null ); // saved search

resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
 // increase pointer
    resultIndex = resultIndex + resultStep;
//nlapiLogExecution('debug', 'resultSet', resultSet.length  );  
  
for ( var i = LOOPMARKER; resultSet != null && i < resultSet.length ; i++ )
 		{
//nlapiLogExecution('debug', 'resultSet[i].getValue(columns[4])', resultSet[i].getValue(columns[4]) );
	var cusrec  = resultSet[i].getValue(columns[4]);
	var qtrsaleschange = resultSet[i].getValue(columns[0]);
    var rollinghalf = resultSet[i].getValue(columns[5]);
    var rollingqtr =  resultSet[i].getValue(columns[1]);//custentity264 
    var prevrollingqtr =  resultSet[i].getValue(columns[2]);                                         //custentity263 
    var samerollingqtrLY =  resultSet[i].getValue(columns[3]);                                           //custentity262 
 updatedrec++;

	//nlapiLogExecution('debug', 'sales', qtrsaleschange );

//-------------------------------------------------------------------------------------------------
if(cusrec)
  {
    nlapiSubmitField('customer' , cusrec,['custentity257','custentity258','custentity264' ,'custentity263', 'custentity262'  ], [qtrsaleschange,rollinghalf ,rollingqtr , prevrollingqtr , samerollingqtrLY]);

  }

//----------------------------------------------------------------------------------------------------
		}
 
} while (resultSet.length > 0)
        }//endtry
  catch(error)
    {
      var params = new Array();
     params['custscript_loop_marker'] = parseInt(i)+1;
     nlapiLogExecution('debug','params in catch', params );

       var status = nlapiScheduleScript(nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId(),params);
    }
      nlapiLogExecution('debug','Done', 'DONE' );
      nlapiLogExecution('debug', 'recordcount', updatedrec  );
}