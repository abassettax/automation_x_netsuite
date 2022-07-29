function displayreleasenotesSavedsearch(request, response)
{
var recid = request.getParameter('frank');
var ReleaseNotes = nlapiLookupField('purchaseorder', recid, 'custbody45');  
var content = "";
content += "<table> <tr> <td bgcolor=white>" + ReleaseNotes + "</td></tr></table> " ;
 
response.write(content);
 }