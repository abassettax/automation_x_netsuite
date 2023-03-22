function printPickingSlip() {
    var recId = nlapiGetRecordId();
    // alert('This function is not yet complete. Testing rec id: ' + recId);
    var printURL = 'https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2484&deploy=1&recid='+recId;
    window.open(printURL,'_blank');
}