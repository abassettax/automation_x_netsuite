function sweepdocusignfiles()
{
var columns = new Array();
 columns[0]=new nlobjSearchColumn("internalid",null,null);
 columns[1]=new nlobjSearchColumn("internalid","file",null);
 columns[2]=new nlobjSearchColumn("formulatext",null,null).setFormula("{recordType}");
  
var transactionSearch = nlapiSearchRecord("transaction",null,
[
   ["file.folder","anyof","3630067"], 
   "AND", 
   ["mainline","is","T"]
], 
columns
);
  
  for ( var i = 0; transactionSearch != null && i < transactionSearch.length; i++ )
  {

var tranid = transactionSearch[i].getValue(columns[0]);
var fileid = transactionSearch[i].getValue(columns[1]);
var trantype = transactionSearch[i].getValue(columns[2]);
    
nlapiDetachRecord('file', fileid, trantype, tranid);
  }
}