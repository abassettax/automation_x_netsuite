/**
* Copyright (c) 2013 Trajectory Inc.
* 76 Richmond St. East, Suite 400, Toronto, ON, Canada, M5C 1P1
* www.trajectoryinc.com
* All Rights Reserved.
*/

/**
* @System: COREL
* @Company: Trajectory Inc. / Kuspide Canada Inc.
* @CreationDate: 20130116
* @DocumentationUrl: https://sites.google.com/a/trajectoryinc.com/pnc/classes/tjinc_pncnop_main-js
* @NamingStandard: TJINC_NSJ-1-2
*/


function TJINC_ATXNPO_FieldChange(s_type, s_name, i_linennum) {
    'use strict';
    nlapiLogExecution('AUDIT', 'TJINC_ATXNPO_FieldChange', '---Started---');
    var i_itemCount, i_expenseCount, j, i_locationid_line, i_locationid, i;
    if (s_name.toString() === 'location' && i_linennum === null) {
        nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Location has changed!');
        i_locationid = nlapiGetFieldValue('location') === null || isNaN(nlapiGetFieldValue('location')) ? -1 : parseInt(nlapiGetFieldValue('location'), 10);
        nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Location ID :' + i_locationid.toString());
        i_itemCount = nlapiGetLineItemCount('item') === null || isNaN(nlapiGetLineItemCount('item')) ? -1 : parseInt(nlapiGetLineItemCount('item'), 10);
        for (i = 1; i <= i_itemCount; i += 1) {
            nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Processing ITEM on line :' + i.toString());
            i_locationid_line = nlapiGetLineItemValue('item', 'location', i) === null || isNaN(nlapiGetLineItemValue('item', 'location', i)) ? 0 : parseInt(nlapiGetLineItemValue('item', 'location', i), 10);
            nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Location on the line :' + i_locationid_line.toString());
            if (i_locationid !== i_locationid_line) {
                nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Updating Location on the item line: ' + i.toString());
                nlapiSetLineItemValue('item', 'location', i, i_locationid);
            }
        }

        i_expenseCount = nlapiGetLineItemCount('expense') === null || isNaN(nlapiGetLineItemCount('expense')) ? -1 : parseInt(nlapiGetLineItemCount('expense'), 10);
        for (j = 1; j <= i_expenseCount; j += 1) {
            nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Processing EXPENSE on line :' + j.toString());
            i_locationid_line = nlapiGetLineItemValue('expense', 'location', j) === null || isNaN(nlapiGetLineItemValue('expense', 'location', j)) ? 0 : parseInt(nlapiGetLineItemValue('expense', 'location', j), 10);
            nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Location on the line :' + i_locationid_line.toString());
            if (i_locationid !== i_locationid_line) {
                nlapiLogExecution('DEBUG', 'TJINC_ATXNPO_FieldChange', 'Updating Location on the expense line: ' + j.toString());
                nlapiSetLineItemValue('expense', 'location', j, i_locationid);
            }
        }
    }
    nlapiLogExecution('AUDIT', 'TJINC_ATXNPO_FieldChange', '---Finished---');
}

function TJINC_ATXNPPO_ValidateInsert(s_type) {
    'use strict';
    nlapiLogExecution('AUDIT', 'TJINC_ATXNPPO_ValidateInsert', '---Started---');
    nlapiLogExecution('DEBUG', 'TJINC_ATXNPPO_ValidateInsert', s_type);
    var i_locationid_line, i_locationid;
    if (s_type.toString() === 'item' || s_type.toString() === 'expense') {
        nlapiLogExecution('DEBUG', 'TJINC_ATXNPPO_ValidateInsert', 'Working on the item');
        i_locationid = nlapiGetFieldValue('location') === null || isNaN(nlapiGetFieldValue('location')) ? -1 : parseInt(nlapiGetFieldValue('location'), 10);
        nlapiLogExecution('DEBUG', 'TJINC_ATXNPPO_ValidateInsert', 'Location ID :' + i_locationid.toString());
        i_locationid_line = nlapiGetCurrentLineItemValue(s_type, 'location') === null || isNaN(nlapiGetCurrentLineItemValue(s_type, 'location')) ? 0 : parseInt(nlapiGetCurrentLineItemValue(s_type, 'location'), 10);
        nlapiLogExecution('DEBUG', 'TJINC_ATXNPPO_ValidateInsert', 'Location on the line :' + i_locationid_line.toString());
        if (i_locationid !== i_locationid_line) {
            nlapiLogExecution('DEBUG', 'TJINC_ATXNPPO_ValidateInsert', 'Updating Location on the line!');
            nlapiSetCurrentLineItemValue(s_type, 'location', i_locationid, false, true);
        }
    }
    nlapiLogExecution('AUDIT', 'TJINC_ATXNPPO_ValidateInsert', '---Finished---');
    return true;
}
