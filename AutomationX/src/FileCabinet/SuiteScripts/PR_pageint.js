function PR_PageInt(type) {
    // if (type == 'edit') {
    var userRole = nlapiGetRole();
    // alert(userRole);
    var allowedRoles = [3, 1052, 1115, 1078, 1083, 1090];    //admin, purch, purch man, inv db, sol arch, admin lim
    // alert(allowedRoles.indexOf(parseInt(userRole)));
    if (allowedRoles.indexOf(parseInt(userRole)) == -1) {
        //TODO: change field display types of most editable fields
        // nlapiDisableField('custrecord214', true);   //Processing Status
        nlapiDisableField('custrecord315', true);   //Low Demand Item
        nlapiDisableField('custrecord349', true);   //Approval Status
        nlapiDisableField('custrecord350', true);   //Approved By
        nlapiDisableField('custrecord351', true);   //Processed By
        nlapiDisableField('custrecord352', true);   //Assigned to Sourcing
        nlapiDisableField('custrecord359', true);   //Approval Required
        nlapiDisableField('owner', true);           //Owner
        nlapiDisableField('custrecord239', true);   //For Salesorder Process
    }
    // }
}
function PR_valfield(type, name) {
    var procStat = nlapiGetFieldValue('custrecord214');
    var relatedTransaction = nlapiGetFieldValue('custrecord215')
    var userRole = nlapiGetRole();
    // alert(userRole);
    var allowedRoles = [3];    //[3, 1052, 1115, 1078, 1083, 1090] admin, purch, purch man, inv db, sol arch, admin lim
    // alert(allowedRoles.indexOf(parseInt(userRole)));
    //TODO: lock down all field changes if related transaction
    if (relatedTransaction != '' && allowedRoles.indexOf(parseInt(userRole)) == -1) {
        alert('You cannot change the values for a PR that has already been processed into a transaction.');
        return false;
    }
    if (name == 'custrecord214') {
        if (allowedRoles.indexOf(parseInt(userRole)) == -1) {
            if (procStat != '') {
                alert('Your role is only allowed to change the processing status to blank for pending PRs. Please verify PR status and try again.');
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else if (name == 'custrecord187') {
        //TODO: add logic for checking Do Not Purchase field on item
        var item = nlapiGetFieldValue('custrecord187');
        var doNotPurchase = nlapiLookupField('item', item , 'custitem122' );
        if (doNotPurchase == 'T' || doNotPurchase == true) {
            alert('The item entered is marked as Do Not Purchase. Please use a different item or reach out to sourcing for an alternate.');
            return false;
        }
    } else {
        return true;
    }
}