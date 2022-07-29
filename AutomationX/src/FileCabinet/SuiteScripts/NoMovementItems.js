function nomovementitems()  
{

var columns = new Array();

     columns[0] = new nlobjSearchColumn("internalid",null,"GROUP");
    columns[1] =  new nlobjSearchColumn("custitem35",null,"GROUP");
    columns[2] =  new nlobjSearchColumn("displayname",null,"GROUP"); 
    columns[3] =  new nlobjSearchColumn("itemid",null,"GROUP"); 
    columns[4] =  new nlobjSearchColumn("inventorylocation",null,"GROUP");
    columns[5] =  new nlobjSearchColumn("locationpreferredstocklevel",null,"GROUP");
    columns[6] =  new nlobjSearchColumn("locationquantityonhand",null,"GROUP");
    columns[7] =  new nlobjSearchColumn("locationquantityavailable",null,"GROUP"); 
    columns[8] =  new nlobjSearchColumn("trandate","transaction","MAX"); 
    columns[9] =  new nlobjSearchColumn("trandate","transaction","MAX"); 
    columns[10] =  new nlobjSearchColumn("location","transaction","GROUP"); 
    columns[11] =  new nlobjSearchColumn("custitem_tjinc_monthsonhand",null,"AVG"); 
    columns[12] =  new nlobjSearchColumn("custitem37",null,"AVG");
    columns[13] =  new nlobjSearchColumn("locationtotalvalue",null,"GROUP");
var itemSearch = nlapiSearchRecord("item",null,
[
   ["quantityavailable","greaterthan","0"], 
   "AND", 
   ["transaction.type","anyof","Build","SalesOrd","CashSale","CustInvc","ItemRcpt","WorkOrd","ItemShip"], 
   "AND", 
   ["isinactive","is","F"], 
   "AND", 
   ["vendor","anyof","@ALL@"], 
   "AND", 
   ["custitem46","noneof","2","3"], 
   "AND", 
   ["transaction.mainline","is","F"], 
   "AND", 
   ["locationquantityavailable","greaterthan","0"], 
   "AND", 
   ["transaction.trandate","onorafter","daysago90"], 
   "AND", 
   ["formulanumeric: case when {transaction.location} = {inventorylocation} then 1 else 0 end","equalto","1"], 
   "AND", 
    ["max(transaction.trandate)","on","daysago46","daysago45"]
],

  columns

);

  if(itemSearch){
          for (i = 0; i < itemSearch.length; i = i + 1) {
            var itemSearchs = itemSearch[i];	
	var itemid = itemSearch[i].getValue(columns[0]); 
    var location =  itemSearch[i].getValue(columns[4]); 
    var lasttransactiondate =  itemSearch[i].getValue(columns[8]); 
    var fivecode = itemSearch[i].getValue(columns[1]); 
    var itemname = itemSearch[i].getValue(columns[3]); 
    var assignedto =  24240; 
    var tasktitle = "Overstock Item: " + fivecode + " " + itemname + " " + location;
     var MOH = itemSearch[i].getValue(columns[11]); 
     var locAva = itemSearch[i].getValue(columns[7]); 
           
var record = nlapiCreateRecord( 'task'); //
   record.setFieldValue( 'customform', 125);
   record.setFieldValue( 'title', tasktitle);
   record.setFieldValue( 'custevent56', itemid);
   record.setFieldValue( 'custevent58', lasttransactiondate);  
   record.setFieldValue( 'assigned', assignedto);
   record.setFieldValue( 'custevent59', MOH);          
   record.setFieldValue( 'custevent60', locAva);
    record.setFieldValue( 'custevent57', location);
// nlapiSubmitRecord(record, false);   
            
            
            
//nlapiSubmitRecord(record, doSourcing, ignoreMandatoryFields);
            
              // nlapiLogExecution('DEBUG', 'item id', itemid);


          } 
  }
}