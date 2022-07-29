function resetonehourholdlift()
{
    var invsearchcolumns = new Array();
  invsearchcolumns[0] = new nlobjSearchColumn("internalid",null, null);

var searchresults = nlapiSearchRecord("customer",null,
[
   ["custentity327","anyof","1"]
], 
invsearchcolumns
);
var custid ="";
  
    for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
custid = searchresults[i].getValue(invsearchcolumns[0]);
nlapiSubmitField("customer", custid, "custentity327", 4);

        }

}