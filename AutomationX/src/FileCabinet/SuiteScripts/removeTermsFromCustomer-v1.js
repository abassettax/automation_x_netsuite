function updateTerms() {


    try {

        nlapiLogExecution('DEBUG', '****************** START UPDATING TERMS', new Date());

        var customerSearch = nlapiSearchRecord("customer", null,
            [
                ["isinactive", "is", "F"],
                "AND",
                ["terms", "noneof", "@NONE@"],
                "AND",
                ["access", "is", "T"],
                "AND",
                ["internalid", "noneof", "2246", "6764", "9813", "17691", "19818", "32487", "34441", "40700", "44021", "44226", "36851"]
            ],
            [
                new nlobjSearchColumn("entityid"),
                new nlobjSearchColumn("internalid").setSort(false)
            ]
        );
nlapiLogExecution('AUDIT', 'internalId', internalId);
      nlapiLogExecution('DEBUG', 'SearchCustomer internalId', customerSearch.length);
      
        for (var i = 0; customerSearch != null && i < customerSearch.length; i++) {

            var searchresult = customerSearch[i];
            var internalId = searchresult.getId();
            nlapiLogExecution('DEBUG', 'SearchCustomer internalId', i + ' - ' +  internalId);
            var record = nlapiLoadRecord('customer', internalId);
            // var access = record.getFieldValue('giveaccess');
            // nlapiLogExecution('DEBUG', 'access', access);
            //if (access == 'T') {
                record.setFieldValue('terms', '');
                var id = nlapiSubmitRecord(record);
            //}

            if (nlapiGetContext().getRemainingUsage() < 100) {
                nlapiLogExecution('DEBUG', 'USAGE LOW', nlapiGetContext().getRemainingUsage());
                nlapiYieldScript();
                nlapiLogExecution('DEBUG', 'nlapiYieldScript', 'nlapiYieldScript');
            }


        }

        nlapiLogExecution('DEBUG', '****************** FINISH UPDATING TERMS', new Date());

    } catch (e) {
        nlapiLogExecution("ERROR", "catch", e);
    }

}