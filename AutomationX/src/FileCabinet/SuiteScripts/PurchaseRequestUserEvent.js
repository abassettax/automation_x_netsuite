function purchaseRequestBeforeSubmit(type) {
   nlapiLogExecution('debug', 'type', type);

   var currentRecord = nlapiGetNewRecord();
   nlapiLogExecution('debug', 'currentRecord', JSON.stringify(currentRecord));

   var recid = nlapiGetRecordId();
   //if (type == 'create') 
   //{ 
   //  if( !nlapiGetFieldValue('custrecord223') ){   nlapiSubmitField('customrecord463', nlapiGetRecordId() , 'custrecord221', ''); }
   nlapiLogExecution('debug', 'nlapiGetRecordId()', recid);

   // var customrecord463Search = nlapiSearchRecord("customrecord463", null,
   //    [
   //       ["id", "equalto", nlapiGetRecordId()],
   //       "AND",
   //       ["custrecord214", "anyof", "@NONE@"]
   //    ],
   //    [
   //       new nlobjSearchColumn("internalid", "CUSTRECORD187", null),
   //       new nlobjSearchColumn("internalid", "CUSTRECORD192", null),
   //       new nlobjSearchColumn("custrecord189", null, null),
   //       new nlobjSearchColumn("custrecord221", null, null)
   //    ]
   // );
   // if (customrecord463Search) {
      try {
         var itemid = currentRecord.getFieldValue("custrecord187");
         var locId = currentRecord.getFieldValue("custrecord192");
         var qty = currentRecord.getFieldValue("custrecord189");
         var fromTransaction = currentRecord.getFieldValue("custrecord221");
   
   
         nlapiLogExecution('debug', 'locId', locId);
         nlapiLogExecution('debug', 'itemid', itemid);
         nlapiLogExecution('debug', 'qty', qty);
         nlapiLogExecution('debug', 'fromTransaction', fromTransaction);
         var itemSearch = nlapiSearchRecord("item", null,
            [
               ["internalidnumber", "equalto", itemid],
               "AND",
               ["inventorylocation", "anyof", locId]
            ],
            [
               new nlobjSearchColumn("locationpreferredstocklevel")
            ]
         );
         nlapiLogExecution('debug','itemSearch', JSON.stringify(itemSearch));
         var locationPrefStockLevel;
         if (itemSearch && itemSearch.length > 0) {
            var locationPrefStockLevel = itemSearch[0].getValue('locationpreferredstocklevel');
         }
   
         if (locationPrefStockLevel) { 
            currentRecord.setFieldValue('custrecord237', locationPrefStockLevel);
            nlapiSubmitRecord(currentRecord, true);
         }

         if (fromTransaction == '' && type == 'create') {
            //add logic that flags PRs if they exceed the 3 month run rate for the item at the specified location
            var itemSalesSearch = nlapiSearchRecord("transaction", null,
            [
               ["type","anyof","CustInvc","CashSale","Build"], 
               "AND", 
               ["item","anyof",itemid], 
               "AND",
               ["location","anyof",locId], 
               "AND", 
               ["trandate","onorafter","monthsago3"]
            ],
            [
               new nlobjSearchColumn("quantity")
            ]
            );
            //search is coming back with nulls/undefined, need to sort out
            nlapiLogExecution('debug','itemSalesSearch', JSON.stringify(itemSalesSearch));
            var threeMonthRate = 0;
            if (itemSalesSearch && itemSalesSearch.length > 0) {
               for (var i = 0; i < itemSalesSearch.length; i++) {
                  threeMonthRate += +itemSalesSearch[i].getValue("quantity");
               }
               nlapiLogExecution('debug','threeMonthRate vs quantity', 'threeMonthRate: ' + threeMonthRate + ' | quantity: ' + qty);
               if (qty > threeMonthRate) {
                  nlapiLogExecution('debug','if statement', 'setting to true');
                  currentRecord.setFieldValue('custrecord315', 'T');
                  // nlapiSubmitRecord(currentRecord, true);
               }
            } else {
               nlapiLogExecution('debug','else statement', 'setting to true');
               //should be 0 results
               currentRecord.setFieldValue('custrecord315', 'T');
               nlapiLogExecution('debug','else statement', 'field set');
               // nlapiSubmitRecord(currentRecord, true);
            }
         }
      } catch (e) {
         nlapiLogExecution('error', 'failed setting preferred stock level', 'rec id: ' + recid);
      }
      
   // }
   return true;

}