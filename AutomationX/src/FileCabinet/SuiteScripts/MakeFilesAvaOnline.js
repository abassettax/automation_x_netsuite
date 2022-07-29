function updateFilesToViewOnline()
{
var searchresults = nlapiSearchRecord('item', 5593, null, null ); 
  
for ( var x = 0; searchresults != null && x < searchresults.length ; x++ )
 		{
	var searchresult = searchresults[x];	
    var filename =  searchresult.getValue("custitem16",null,"GROUP");
  nlapiLogExecution('debug','FilesUpdated', x );
          
var fileSearch = nlapiSearchRecord("file",null,
[
   ["internalidnumber","equalto",filename]
], 
[
   new nlobjSearchColumn("name").setSort(false), 
   new nlobjSearchColumn("folder"), 
   new nlobjSearchColumn("documentsize"), 
   new nlobjSearchColumn("url"), 
   new nlobjSearchColumn("created"), 
   new nlobjSearchColumn("modified"), 
   new nlobjSearchColumn("filetype")
]
);
          
	var fileSearchs = fileSearch[0];	
	var fileid = fileSearchs.getId( );
var oldName =fileSearchs.getValue("name",null,null);
var newname =  oldName.replace("MMM2", "");  //'MMM2';  //

 var file = nlapiLoadFile(fileid);
       //  file.setIsOnline(true);
          file.setName(newname)

           nlapiSubmitFile(file);

        }
  
}