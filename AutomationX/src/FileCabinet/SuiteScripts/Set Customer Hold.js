function AXSetHold()
{

  //// configuration Search https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=4899&saverun=T&whence=

  var configsearchresults = nlapiSearchRecord('customrecord460', 4899, null, null );

  
  var addDaysForProducerApproval =   parseInt(configsearchresults[0].getValue("custrecord168",null,null)); //ADDITIONAL DAYS FOR PRODUCERS INVOICE APPROVAL
  var GeneralHoldDays = parseInt(configsearchresults[0].getValue("custrecord166",null,null)); //GENERAL HOLD (DAYS PAST DUE)
  var ProducerSoftHoldDays= parseInt(configsearchresults[0].getValue("custrecord165",null,null)); //PRODUCER SOFT HOLD (DAYS PAST DUE)
  var ProducerHardHoldDays= parseInt(configsearchresults[0].getValue("custrecord167",null,null));//PRODUCER HARD HOLD (DAYS PAST DUE)
  var MarketCodesForSoftHold= configsearchresults[0].getValue("custrecord169",null,null);  //MARKET CODES FOR SOFT HOLD
  MarketCodesForSoftHold =  MarketCodesForSoftHold.replace(" ", "")
  var MarketCodesForSoftHoldArray = new Array();
  MarketCodesForSoftHoldArray = MarketCodesForSoftHold.split(','); 
  //  nlapiLogExecution('AUDIT', 'MarketCodesForSoftHold', MarketCodesForSoftHold);
   
   //// End search

// Invoice/Customer Search  //custbody170 is Transmission Date field, custentity154 is Customer Market Code(s)
  var invsearchcolumns = new Array();
  invsearchcolumns[0] = new nlobjSearchColumn("internalid","customerMain","GROUP");
  invsearchcolumns[1] =  new nlobjSearchColumn("formulanumeric",null,"MAX").setFormula("TO_NUMBER((CASE WHEN  {custbody170} IS NULL THEN TO_CHAR({daysoverdue}) ELSE TO_CHAR(({daysoverdue} - ( {custbody170}-{trandate})))  END))");
  invsearchcolumns[2] = new nlobjSearchColumn("custentity154","customerMain","GROUP");

  //NTS: AX Hold Search 1-15-18
  //https://422523.app.netsuite.com/app/common/search/searchresults.nl?searchid=4898&whence=
  var searchresults = nlapiSearchRecord('transaction', 4898, null, invsearchcolumns );
  var custid ="";
  var MaxDaysOverdue ="";
  var CustMarketCodes = "";
   var  searchresultsarray = new Array();
 
  nlapiLogExecution('AUDIT', 'searchresults', JSON.stringify(searchresults)); 
  for ( var i = 0; searchresults != null && i < searchresults.length; i++ ){

	  custid = searchresults[i].getValue(invsearchcolumns[0]);
    MaxDaysOverdue =parseInt(searchresults[i].getValue(invsearchcolumns[1]));
    CustMarketCodes = searchresults[i].getValue(invsearchcolumns[2]);
    searchresultsarray.push(custid);
              
    if( MarketCodesForSoftHoldArray.indexOf(CustMarketCodes)!=-1  ){
      if(MaxDaysOverdue >= ProducerHardHoldDays){   
        nlapiSubmitField("customer", custid, "custentity327", 4);   
      } else if(MaxDaysOverdue >= ProducerSoftHoldDays){ 
        nlapiSubmitField("customer", custid, "custentity327", 3);  
      } else{  
        nlapiSubmitField("customer", custid, "custentity327", 5);
      }
    }
    if( MarketCodesForSoftHoldArray.indexOf(CustMarketCodes)==-1  ){
      if(MaxDaysOverdue >= GeneralHoldDays){  
        nlapiSubmitField("customer", custid, "custentity327", 4);  
      } else{ 
        nlapiSubmitField("customer", custid, "custentity327", 5);   
      }
        }
      //nlapiLogExecution('AUDIT', 'MaxDaysOverdue', MaxDaysOverdue); 


  }
  
 ///////// check for customers on hold who will be off hold.

var customerSearch = nlapiSearchRecord("customer",null,
[
  ["isinactive","is","F"], 
  "AND", 
  ["custentity327","anyof","4"]
], 
[
   new nlobjSearchColumn("internalid",null,null)
]
);
  var custonhold = "";
nlapiLogExecution('AUDIT', 'searchresultsarray', JSON.stringify(searchresultsarray)); 
  for ( var f = 0; customerSearch != null && f < customerSearch.length; f++ )
 		{
custonhold = customerSearch[f].getValue("internalid",null,null);
if(custonhold &&  searchresultsarray)
  {
if(searchresultsarray.indexOf(custonhold)==-1  ){ nlapiSubmitField("customer", custonhold, "custentity327", 5); nlapiLogExecution('AUDIT', 'custonhold', custonhold); }
  }
        }
  //////////////////////////////////////////

}

function AXSetHold2() {

  var customerSearch = nlapiSearchRecord("customer",null,
    [
      ["isinactive","is","F"], 
      "AND", 
      [[["daysoverdue","greaterthan","25"],"AND",["custentity327","anyof","5"]],"OR",[["daysoverdue","lessthanorequalto","25"],"AND",["custentity327","anyof","4"]]], 
      "AND", 
      ["custentity327","noneof","8","9"]
    ], 
    [
      new nlobjSearchColumn("custentity327").setSort(false),
      new nlobjSearchColumn("internalid").setSort(false), 
      new nlobjSearchColumn("daysoverdue"), 
      new nlobjSearchColumn("overduebalance"),
    ]
  );
  nlapiLogExecution('AUDIT', 'customerSearch', JSON.stringify(customerSearch));
  var holdCustomers = [];
  var offHoldCustomers = [];
  for ( var f = 0; customerSearch != null && f < customerSearch.length; f++ ){
      var custonhold = customerSearch[f].getValue("custentity327");
      var custid = customerSearch[f].getValue("internalid");     
      if(custonhold == '4'){
        //on hold customers should be off hold based off of filters
        offHoldCustomers.push(custid);
      } else {
        //off hold customers should be on hold based off of filters
        holdCustomers.push(custid);
      }
  }
  nlapiLogExecution('AUDIT', 'holdCustomers', JSON.stringify(holdCustomers));
  nlapiLogExecution('AUDIT', 'offHoldCustomers', JSON.stringify(offHoldCustomers));
  for ( var f = 0; f < holdCustomers.length; f++ ){
    var custid = holdCustomers[f];
    nlapiSubmitField("customer", custid, "custentity327", 4);
  }
  for ( var f = 0; f < offHoldCustomers.length; f++ ){
    var custid = offHoldCustomers[f];
    nlapiSubmitField("customer", custid, "custentity327", 5);
  }
}

//Hour Hold Lift   1  
//Day Hold Lift   2  
//Soft Hold   3  
//On Hold   4  
//Off Hold   5  
//Credit Limit Soft Hold   6 - DELETED
//Credit Limit Hold 7 - DELETED
//Disable Hold  8
//Forced Hold   9

