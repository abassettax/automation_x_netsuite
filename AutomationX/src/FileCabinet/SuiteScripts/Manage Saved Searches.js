function ModifySavedSearch()
{

//// search IT:SCRIPT: Saved_Search_Management -- https://422523.app.netsuite.com/app/common/search/search.nl?cu=T&e=T&id=5929
   var SearchColumns = new Array();
     SearchColumns[0] = new nlobjSearchColumn("custrecord298",null,null).setSort(false);
     SearchColumns[1] = new nlobjSearchColumn("custrecord295",null,null); // Search ID
     SearchColumns[2] = new nlobjSearchColumn("custrecord296",null,null); //Search Type   
     SearchColumns[3] = new nlobjSearchColumn("custrecord297",null,null); // processed 
     SearchColumns[4] = new nlobjSearchColumn("internalid",null,null); // record id  
  
var SavedSearchManagement = nlapiSearchRecord("customrecord670",null,
[
   ["isinactive","is","F"], 
   "AND", 
   ["custrecord297","is","F"]//, 
  // "AND", 
  // ["internalidnumber","lessthan","10"]
], 
SearchColumns
);
    for(i=0; SavedSearchManagement != null && i < SavedSearchManagement.length; i++)
 		{
            try
    {
var searchId = SavedSearchManagement[i].getValue(SearchColumns[1]);
var searchType = SavedSearchManagement[i].getValue(SearchColumns[2]);
var searchTitle = SavedSearchManagement[i].getValue(SearchColumns[0]);
var recordId = SavedSearchManagement[i].getValue(SearchColumns[4]);

      //      nlapiLogExecution('debug', 'searchId ', searchId);
      //      nlapiLogExecution('debug', 'searchType ', searchType);
      //      nlapiLogExecution('debug', 'searchTitle ', searchTitle);
      //      nlapiLogExecution('debug', 'recordId ', recordId);
          
var thissearch = nlapiLoadSearch(null, searchId ); ////////all items in stock
thissearch.setIsPublic(false);
thissearch.saveSearch(searchTitle, searchId);
var rec = nlapiLoadRecord('customrecord670', recordId);
          rec.setFieldValue('custrecord297', "T"  );
         rec.setFieldValue('isinactive', "T"  );
nlapiSubmitRecord(rec);
    }
        catch (Exception){ nlapiLogExecution('debug', 'searchId Error ', searchId + '  Exception ' + Exception );}  //catch(error){    }
        }

}