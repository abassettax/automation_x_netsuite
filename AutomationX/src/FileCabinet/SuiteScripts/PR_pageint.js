function PR_PageInt(type) {
    // if (type == 'edit') {
        var userRole = nlapiGetRole();
        // alert(userRole);
        var allowedRoles = [3,1052,1115,1078,1083,1090];    //admin, purch, purch man, inv db, sol arch, admin lim
        // alert(allowedRoles.indexOf(parseInt(userRole)));
        if (allowedRoles.indexOf(parseInt(userRole)) == -1) {
            //TODO: change field display types of most editable fields
            nlapiDisableField('custrecord214', true);   //Processing Status
            nlapiDisableField('custrecord315', true);   //Low Demand Item
            nlapiDisableField('custrecord349', true);   //Approval Status
            nlapiDisableField('custrecord350', true);   //Approved By
            nlapiDisableField('custrecord351', true);   //Processed By
            nlapiDisableField('custrecord352', true);   //Assigned to Sourcing
        }
    // }
}