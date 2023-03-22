////////////////////////////////////////////////
function transformToQuote() {
  var oppId = nlapiGetRecordId();
  // alert('opp id: ' + oppId);
  var quote = nlapiTransformRecord('opportunity', oppId, 'estimate', {'custbody125' : 15});
  // alert(JSON.stringify(quote));
  var quoteId = nlapiSubmitRecord(quote, true);
  // alert('new quote: ' + quoteId);
  
  var response = 'https://422523.app.netsuite.com/app/accounting/transactions/estimate.nl?id=' + quoteId + '';
  window.open(response, "_blank");

  window.location = window.location.href;
  location.reload();
}  