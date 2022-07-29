function SavedSearchCleanup()
{


var search = nlapiLoadSearch('savedsearch', 'customsearch5917');
var results= search.runSearch();
nlapiLogExecution('debug', 'results.length', results.length ); 



}