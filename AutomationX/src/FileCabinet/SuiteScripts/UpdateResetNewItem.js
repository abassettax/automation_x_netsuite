function ResetTempItems(rec_type, rec_id)  
{
  
var inventoryitemSearch = nlapiSearchRecord("inventoryitem",null,
[
   ["type","anyof","InvtPart"], 
   "AND", 
  [[["displayname","contains","IN USE"],"AND",["displayname","doesnotcontain","IN USE - SOLD"]],"OR",  [["displayname","contains","-I.U."],"AND",["displayname","doesnotcontain","-I.U-S"]]],  
   "AND", 
   ["type","anyof","InvtPart"], 
   "AND", 
   ["max(transaction.trandate)","onorbefore","daysago180"],
    "AND",
 ["sum(formulanumeric: CASE WHEN {transaction.type} = 'salesorder' OR  {transaction.type} = 'purchaseorder' THEN 1 ELSE 0 END)","lessthan","1"]
], 
[
   new nlobjSearchColumn("internalid",null,"GROUP"), 
   new nlobjSearchColumn("displayname",null,"GROUP"), 
   new nlobjSearchColumn("trandate","transaction","MAX")
   //new nlobjSearchColumn("trandate","transaction","GROUP")
]
);
 
//nlapiLogExecution('DEBUG','Start', "Start");
for(y =0; inventoryitemSearch != null && y< inventoryitemSearch.length; y++)
 		{
var searchlength = inventoryitemSearch.length;
var UpdateItem = inventoryitemSearch[y];
var UpdateItemid = UpdateItem.getValue("internalid",null,"GROUP");
var trandates = UpdateItem.getValue("trandate","transaction","MAX");
nlapiLogExecution('DEBUG','Item Count', searchlength);
nlapiLogExecution('DEBUG','ItemID', UpdateItemid + ' ' +trandates);
  var resetdesc = "Please Enter Item Descritption here. \n-Manufacturer Name, \n-Product (what it is), \n-Brand/Model (if appropriate), \n-Manufacturer Part Number, \n-List of important technical information/descriptions. Example: Antanna Yagi 890-960MHz 6.5dB 200W N Female 2' Lead.";
        
nlapiSubmitField('inventoryitem' , UpdateItemid, ['custitem66', 'cost', 'custitem66', 'displayname',"custitem1", 'salesdescription', 'cost', 'isonline' ,'custitem71', 'storedisplayname','urlcomponent'], ["F", 0,"F" ,"NEW ITEM" , "" ,resetdesc, 0 , 'F','F', "" , ""]); 

         // nlapiSubmitField('inventoryitem', UpdateItemid, ['custitem66','cost','custitem66', 'displayname',"custitem1", 'salesdescription', 'cost', 'isonline' , 'custitem71', 'storedisplayname', 'urlcomponent'], [0,'T',"T", shortwebdesc, salesd]);
          
          var rec = nlapiLoadRecord('inventoryitem',UpdateItemid);
           rec.setLineItemValue('price', 'price_1_', 1, 0);
          nlapiSubmitRecord(rec,true);
          
        }
 
}