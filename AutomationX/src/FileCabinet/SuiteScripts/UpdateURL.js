function UpdateURL(catId, pad){
var dupRecords = nlapiLoadSearch('Item', '1965');
var resultSet = dupRecords.runSearch();

resultSet.forEachResult(function(searchResult)
	{
var InterID=(searchResult.getValue('InternalID')); 
var loadCategory = nlapiLoadRecord("inventoryitem", InterID);  
var newurl= new Date().getUTCMilliseconds();
newurl=InterID+newurl;
loadCategory.setFieldValue('urlcomponent',newurl); 
loadCategory.setFieldValue('metataghtml',"<meta name=\"robots\" content=\"noindex\">"); 
nlapiSubmitRecord(loadCategory , true);		
	return true;                // return true to keep iterating move to end
	});		
nlapiYieldScript();
  
var dupRecords1 = nlapiLoadSearch('Item', '2973');
var resultSet1 = dupRecords1.runSearch();

resultSet1.forEachResult(function(searchResult1)
	{
var InterID=(searchResult1.getValue('InternalID')); 
var loadCategory = nlapiLoadRecord("inventoryitem", InterID);  
var newurl= new Date().getUTCMilliseconds();
newurl=InterID+newurl;
loadCategory.setFieldValue('urlcomponent',newurl); 
loadCategory.setFieldValue('metataghtml',"<meta name=\"robots\" content=\"noindex\">"); 
nlapiSubmitRecord(loadCategory , true);		
	return true;                // return true to keep iterating move to end
	});		
nlapiYieldScript();  
  
var dupRecords2 = nlapiLoadSearch('Item', '2972');
var resultSet2 = dupRecords2.runSearch();  
  resultSet2.forEachResult(function(searchResult2)
	{
var InterID=(searchResult2.getValue('InternalID')); 
var loadCategory = nlapiLoadRecord("inventoryitem", InterID);  
var newurl= new Date().getUTCMilliseconds();
newurl=InterID+newurl;
loadCategory.setFieldValue('urlcomponent',newurl); 
loadCategory.setFieldValue('metataghtml',"<meta name=\"robots\" content=\"noindex\">"); 
nlapiSubmitRecord(loadCategory , true);		
	return true;                // return true to keep iterating move to end
	});		
nlapiYieldScript();  
  
var dupRecords3 = nlapiLoadSearch('Item', '2974');
var resultSet3 = dupRecords2.runSearch();  
  resultSet3.forEachResult(function(searchResult3)
	{
var InterID=(searchResult3.getValue('InternalID')); 
var loadCategory = nlapiLoadRecord("inventoryitem", InterID);  
var newurl= new Date().getUTCMilliseconds();
newurl=InterID+newurl;
loadCategory.setFieldValue('urlcomponent',newurl); 
loadCategory.setFieldValue('metataghtml',"<meta name=\"robots\" content=\"noindex\">"); 
nlapiSubmitRecord(loadCategory , true);		
	return true;                // return true to keep iterating move to end
	});		
 
  
  
}