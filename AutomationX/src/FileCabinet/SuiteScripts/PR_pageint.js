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
    }
    // }
}
function PR_valfield(type, name) {

    //TODO: lock down all field changes if related transaction
    if (name == 'custrecord214') {
        var procStat = nlapiGetFieldValue('custrecord214');
        var relatedTransaction = nlapiGetFieldValue('custrecord215')
        var userRole = nlapiGetRole();
        // alert(userRole);
        var allowedRoles = [3];    //[3, 1052, 1115, 1078, 1083, 1090] admin, purch, purch man, inv db, sol arch, admin lim
        // alert(allowedRoles.indexOf(parseInt(userRole)));
        if (allowedRoles.indexOf(parseInt(userRole)) == -1) {
            if (relatedTransaction != '') {
                alert('You cannot change the processing status for a PR that has already been processed into a transaction.');
                return false;
            } else if (procStat != '') {
                alert('Your role is only allowed to change the processing status to blank for pending PRs. Please verify PR status and try again.');
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        return true;
    }
}