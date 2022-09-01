function purchaseRequestAfterSubmit(type) {
   var recid = nlapiGetRecordId();
   //if (type == 'create') 
   //{ 
   //  if( !nlapiGetFieldValue('custrecord223') ){   nlapiSubmitField('customrecord463', nlapiGetRecordId() , 'custrecord221', ''); }
   nlapiLogExecution('debug', 'nlapiGetRecordId()', recid);

   var customrecord463Search = nlapiSearchRecord("customrecord463", null,
      [
         ["id", "equalto", nlapiGetRecordId()],
         "AND",
         ["custrecord214", "anyof", "@NONE@"]
      ],
      [
         new nlobjSearchColumn("internalid", "CUSTRECORD187", null),
         new nlobjSearchColumn("internalid", "CUSTRECORD192", null)
      ]
   );
   if (customrecord463Search) {
      try {
         var itemid = customrecord463Search[0].getValue("internalid", "CUSTRECORD187", null);
         var locId = customrecord463Search[0].getValue("internalid", "CUSTRECORD192", null);
   
   
         nlapiLogExecution('debug', 'locId', locId);
         nlapiLogExecution('debug', 'itemid', itemid);
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
         var locationPrefStockLevel;
         if (itemSearch.length > 0) {
            var locationPrefStockLevel = itemSearch[0].getValue('locationpreferredstocklevel');
         }
   
         if (locationPrefStockLevel) { nlapiSetFieldValue('custrecord237', locationPrefStockLevel); }
   
         // nlapiLogExecution('debug','nlapiGetRecordId()', nlapiGetRecordId());
         //}
      } catch (e) {
         nlapiLogExecution('error', 'failed setting preferred stock level', 'rec id: ' + recid);
      }
      
   }
   return true;

}