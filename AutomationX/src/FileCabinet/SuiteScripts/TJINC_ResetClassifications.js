function TJINC_resetClassification() {

var columns = new Array();
     columns[0] = new nlobjSearchColumn("internalid",null,"GROUP");

var itemSearch = nlapiSearchRecord("item",null,
[
   ["transaction.type","anyof","Build","CustInvc","CashSale","SalesOrd"], 
   "AND", 
   [["custitem45","noneof","@NONE@"],"OR",["custitem61","noneof","@NONE@"],"OR",["custitem23","noneof","@NONE@"]],
     "AND", 
   ["type","anyof","Assembly","InvtPart"], 
   "AND",
   ["max(transaction.trandate)","onorbefore","daysago121"]
], 
columns 
);

for(x=0; itemSearch != null && x < itemSearch.length; x++)
 		{
         var itemid = itemSearch[x].getValue(columns[0]);
      

        try {
            nlapiSubmitField('inventoryitem', itemid, 'custitem45', null,  false);  // revenue
            nlapiSubmitField('inventoryitem', itemid, 'custitem61', null,  false);  // activity
            nlapiSubmitField('inventoryitem', itemid, 'custitem23', null,  false);  // spend

             nlapiLogExecution('debug', 'resetClassification_Scheduled', 'inventoryitem: ' + itemid);
        } catch (ex1) {
            try {
              nlapiSubmitField('assemblyitem', itemid, 'custitem45', null,  false);
              nlapiSubmitField('assemblyitem', itemid, 'custitem61', null,  false);
              nlapiSubmitField('assemblyitem', itemid, 'custitem23', null,  false);
              
                  nlapiLogExecution('debug', 'resetClassification_Scheduled', 'assemblyitem: ' + itemid);
            } catch (ex2) {
                try {
                  nlapiSubmitField('kititem', itemid, 'custitem45', null,  false);
                  nlapiSubmitField('kititem', itemid, 'custitem61', null,  false);
                  nlapiSubmitField('kititem', itemid, 'custitem23', null,  false);

                } catch (ex3) {
                    nlapiLogExecution('ERROR', 'resetClassification_Scheduled', 'Element: ' + itemid);
                    
                }}}

}
  
  /////////set demand and avg usage to 0
  var columnsdemand = new Array();
     columnsdemand[0] = new nlobjSearchColumn("internalid",null,"GROUP");
  var itemSearchdemand = nlapiSearchRecord("item",null,
[
   ["transaction.type","anyof","Build","CustInvc","CashSale","SalesOrd"], 
   "AND", 
   [["custitem_tjinc_averagedemand","greaterthan","0"],"OR",["custitem_tjinc_averagedemandtrend","greaterthan","0"]],
     "AND", 
   ["type","anyof","Assembly","InvtPart"], 
   "AND", 
   ["max(transaction.trandate)","onorbefore","startoflastrollingquarter"]
], 
columnsdemand
);
  
for(x=0; itemSearchdemand != null && x < itemSearchdemand.length; x++)
 		{
         var itemid = itemSearchdemand[x].getValue(columnsdemand[0]);
  
       try {
            nlapiSubmitField('inventoryitem', itemid, 'custitem_tjinc_averagedemand', null,  false);  // 
            nlapiSubmitField('inventoryitem', itemid, 'custitem_tjinc_averagedemandtrend', null,  false);  // 
         

             nlapiLogExecution('debug', 'resetClassification_Scheduled', 'inventoryitem demands: ' + itemid);
        } catch (ex1) {
            try {
              nlapiSubmitField('assemblyitem', itemid, 'custicustitem_tjinc_averagedemandtem45', null,  false);
              nlapiSubmitField('assemblyitem', itemid, 'custitem_tjinc_averagedemandtrend', null,  false);
             
              
                  nlapiLogExecution('debug', 'resetClassification_Scheduled', 'assemblyitem: ' + itemid);
            } catch (ex2) {
                try {
                  nlapiSubmitField('kititem', itemid, 'custitem_tjinc_averagedemand', null,  false);
                  nlapiSubmitField('kititem', itemid, 'custitem_tjinc_averagedemandtrend', null,  false);
                 

                } catch (ex3) {
                    nlapiLogExecution('ERROR', 'resetClassification_Scheduled', 'Element: ' + itemid);
                    
                }}}
  
        }
  //////// set Months on hand to 99 for items with no sales
   var columnsMOH = new Array();
     columnsMOH[0] = new nlobjSearchColumn("internalid",null,"GROUP");
  
  var itemSearchMOH = nlapiSearchRecord("item",null,
[
   ["transaction.type","anyof","Build","CustInvc","CashSale","SalesOrd"], 
   "AND", 
   ["quantityonhand","greaterthan","0"], 
   "AND", 
   ["custitem_tjinc_monthsonhand","notequalto","99"], 
     "AND", 
   ["type","anyof","Assembly","InvtPart"], 
   "AND", 
   ["max(transaction.trandate)","onorbefore","startoflastrollingquarter"]
], 
columnsMOH
);
 
  
for(x=0; itemSearchMOH != null && x < itemSearchMOH.length; x++)
 		{
  var itemid = itemSearchMOH[x].getValue(columnsMOH[0]);
    var ninenine = 99;
       try {
            nlapiSubmitField('inventoryitem', itemid, 'custitem_tjinc_monthsonhand', ninenine,  false);  // 
          
             nlapiLogExecution('debug', 'resetClassification_Scheduled', 'inventoryitem demandsMOH99: ' + itemid);
        } catch (ex1) {
            try {
              nlapiSubmitField('assemblyitem', itemid, 'custitem_tjinc_monthsonhand', ninenine,  false);
              
                  nlapiLogExecution('debug', 'resetClassification_Scheduled', 'assemblyitem: ' + itemid);
            } catch (ex2) {
                try {
                  nlapiSubmitField('kititem', itemid, 'custitem_tjinc_monthsonhand', ninenine,  false);
                 
                } catch (ex3) {
                    nlapiLogExecution('ERROR', 'resetClassification_Scheduled', 'Element: ' + itemid);
                    
                }}}
        }

}