/**
 * Copyright (c) 2013 Trajectory Inc.
 * 76 Richmond St. East, Suite 400, Toronto, ON, Canada, M5C 1P1
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: [Name of the system which is part this class, and the url for the
 *          documentation]
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: 20130201
 * @DocumentationUrl: [Url of the page that has the general description of the
 *                    functionality]
 * @NamingStandard: TJINC_NSJ-1-2
 */

function TJINC_GetLatestAgreement() {
    "use strict";
    var o_filters = [], agreementID = -1, agreements = null;
    o_filters.push(new nlobjSearchFilter("custrecord_echosign_parent_record", null, "is", [ nlapiGetRecordId() ]));
    agreements = nlapiSearchRecord("customrecord_echosign_agreement", null, o_filters, null);
    if (agreements !== null && agreements.length > 0) {
        agreementID = parseInt(agreements[agreements.length - 1].id, 10);
    }
    return agreementID;
}

function TJINC_AfterSubmit(s_type) {
    "use strict";
    nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', "--START--");
    var url_servlet, o_filters, response, body, getID, agreementID, signers;
    // Run script only on the Sales Group Walk In form
    if (parseInt(nlapiGetFieldValue('customform'), 10) === 273 && nlapiGetFieldValue('custbody_tjinc_create_pos_agreement') === 'T' && (s_type == 'create' || s_type == 'edit' || s_type == 'xedit')) {
        nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', "Asking EchoSign Suitelet for new agreement");
        // Check if an agreement already exists
        // agreementID = TJINC_GetExistingAgreement();
        // if (agreementID === -1) {
        // Build URL
        url_servlet = nlapiResolveURL('SUITELET', 67, 1, true);
        url_servlet += "&recordtype=salesorder&recordid=" + nlapiGetRecordId();

        // Make a call to URL
        response = nlapiRequestURL(url_servlet, null, null);
        body = response.getBody();
        getID = /&id=(\d*)/i;
        // Grab agreement ID from the response
        agreementID = parseInt(body.match(getID)[1], 10);
        // }

        if (agreementID > 0) {
            nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', "EchoSign Suitelet returned agreement id: " + agreementID.toString());
            // Set Host Signing for the First Signer to TRUE
            nlapiSubmitField('customrecord_echosign_agreement', agreementID, 'custrecord_celigo_host_agreement_signer', 'T');
            // Find the SIGNER record and set the Recipient to
            // ws@automation-x.com
            o_filters = [];
            o_filters.push(new nlobjSearchFilter("custrecord_echosign_agree", null, "anyof", [ agreementID ]));
            signers = nlapiSearchRecord("customrecord_echosign_signer", null, o_filters, null);
            if (signers !== null && signers.length > 0) {
                nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', "Found the EchoSign Signer Record");
                nlapiSubmitField(signers[0].getRecordType(), signers[0].getId(), 'custrecord_echosign_email', 'ws@automation-x.com');
            }
        }

        nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', "Resetting the Create POS flag to false");
        nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_tjinc_create_pos_agreement', 'F');
    }
    nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', "--END--");
}

function TJINC_BeforeLoad(s_type, o_form) {
    "use strict";
    var agreementID = -1, button = null;
    // Run script only on the Sales Group Walk In form
    if ((s_type == 'edit' || s_type == 'xedit') && nlapiGetFieldValue('custbody65') === 'T') {
        // Should HIDE EchoSign's 'Send for signature' button
        agreementID = TJINC_GetLatestAgreement();
        if (agreementID !== -1) {
            // Get the button
            button = o_form.addButton('custpage_custombutton', 'Obtain Signature', "javascript:void window.open('/app/common/custom/custrecordentry.nl?rectype=89&id=" + agreementID + "','1360255050611','width=700,height=700,toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=0,left=0,top=0');return false;");
        }
    }
}