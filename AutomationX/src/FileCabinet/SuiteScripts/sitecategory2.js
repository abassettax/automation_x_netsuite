function walkCat2(catId, pad){
//var loadCategory = nlapiLoadRecord("sitecategory", "14958149");   //--- Load the site category record-jf
var loadCategory = nlapiLoadRecord("sitecategory", "17263707");  
///////////////
var dupRecords = nlapiLoadSearch('Item', '1951');   //load saved search-jf

var resultSet = dupRecords.runSearch();   //run saved search-jf
resultSet.forEachResult(function(searchResult)
	{
	var InterID=(searchResult.getValue('InternalID'));   // process the search result-jf
/////////////////////////
var LINEINX=loadCategory.getLineItemCount('presentationitem'); //Create the Index value-jf
loadCategory.insertLineItem("presentationitem",LINEINX); 
loadCategory.setLineItemValue("presentationitem", "presentationitem", LINEINX, InterID+'INVTITEM');  //--- Sets the line value.-jf
///////

	return true;                // return true to keep iterating -jf
	});	
nlapiSubmitRecord(loadCategory , true);				
}