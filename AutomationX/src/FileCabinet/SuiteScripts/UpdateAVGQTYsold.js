function averageqtysold(rec_type, rec_id)  
{
var item = nlapiLoadRecord(rec_type, rec_id);
  
var columns = new Array();
   //  columns[0] = new nlobjSearchColumn("internalid",null,"GROUP");
    //  columns[0] =new nlobjSearchColumn("internalid",null,"GROUP");
   columns[0] = new nlobjSearchColumn("formulanumeric",null,"AVG").setFormula("ABS({transaction.quantity})");

var itemSearch = nlapiSearchRecord("item",null,
[
 ["transaction.type","anyof","SalesOrd","CashSale","WorkOrd"], 
   "AND", 
   ["type","anyof","Assembly","InvtPart"], 
   "AND", 
   ["transaction.trandate","onorafter","daysago90"], 
   "AND", 
   ["transaction.mainline","is","F"], 
   "AND", 
   ["internalidnumber","equalto",rec_id], 
   "AND", 
   ["avg(transaction.quantity)","greaterthan","0"]
], 
columns 
);

  if(itemSearch){

         var itemavgqty = Math.round(itemSearch[0].getValue(columns[0]));
  
  nlapiSubmitField(rec_type , rec_id, 'custitem37', itemavgqty,  false);
}    
}