/**
 * Copyright (c) [year] Trajectory Inc. 
 * 76 Richmond St. East, Suite 400, Toronto, ON, Canada, M5C 1P1 
 * www.trajectoryinc.com 
 * All Rights Reserved. 
 */

/**
 * @System: [Name of the system which is part this class, and the url for the documentation]
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: [yyyyMMdd]
 * @DocumentationUrl: [Url of the page that has the general description of the functionality]
 * @NamingStandard: TJINC_NSJ-1-2
 */

/* exported UpdateCustomerCreditStatus */

function UpdateCustomerCreditStatus(s_type) {
    'use strict';
    nlapiLogExecution('AUDIT', 'UpdateCustomerCreditStatus', '--START-- (type = ' + s_type + ')');
    var search, columns, resultSet;

    
    // Take all customers off Soft-Hold
    nlapiLogExecution('DEBUG', 'Updating Customer', 'Reset Soft-Hold');
    search = nlapiLoadSearch('customer', 'customsearch_tjinc_reset_cust_hold');
    columns = search.getColumns();
    resultSet = search.runSearch();

    resultSet.forEachResult(function(searchResult) {
        nlapiLogExecution('DEBUG', 'Resetting Soft-hold Customer', 'Customer ID: ' + searchResult.getValue(columns[0]));
        nlapiSubmitField('customer', searchResult.getValue(columns[0]), 'custentity_tjinc_soft_hold', 'F', true);
        return true;
    });    
    
    
    // Set appropriate customers on Soft-Hold
    nlapiLogExecution('DEBUG', 'Updating Customer', 'Setting Soft-Hold');
    search = nlapiLoadSearch('salesorder', 'customsearch_updatecreditstatus');
    columns = search.getColumns();
    resultSet = search.runSearch();

    resultSet.forEachResult(function(searchResult) {
        nlapiLogExecution('DEBUG', 'Setting soft-hold Customer', 'Customer ID: ' + searchResult.getValue(columns[0]));
        nlapiSubmitField('customer', searchResult.getValue(columns[0]), 'custentity_tjinc_soft_hold', 'T', true);
        //nlapiSubmitField('customer', searchResult.getValue(columns[0]), 'creditholdoverride', 'ON', true);
        return true;
    });
    nlapiLogExecution('AUDIT', 'UpdateCustomerCreditStatus', '--END-- (type = ' + s_type + ')');
}