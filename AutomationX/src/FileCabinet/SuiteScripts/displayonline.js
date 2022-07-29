function walkCat(catId, pad){
//var loadCategory = nlapiLoadRecord("inventoryitem", "14958149");  
///////////////
var dupRecords = nlapiLoadSearch('Item', '1965');

var resultSet = dupRecords.runSearch();

resultSet.forEachResult(function(searchResult)
	{
var InterID=(searchResult.getValue('InternalID')); 
var loadCategory = nlapiLoadRecord("inventoryitem", InterID);  
loadCategory.setFieldValue('isonline','T'); 
nlapiSubmitRecord(loadCategory , true);		
	return true;                // return true to keep iterating move to end
	});		
	
}