function email( type )
{

//search columns
var columns = [
		new nlobjSearchColumn('custrecord20')
	,	new nlobjSearchColumn('custrecord_item')
//	,	new nlobjSearchColumn('custrecord_item_description') //comes back null, while salesdescription join comes back invalid
];
//search filters
var filters = [
		new nlobjSearchFilter('isinactive', null, 'is', 'F')
	,	new nlobjSearchFilter('custrecord_customer', null, 'is', '6194')
];
//creates search
var searchresults = nlapiSearchRecord('customrecord_customer_store', null, filters, columns); 

//create email
var author = '18040';
var recipient =  "jason.feucht@automation-x.com";
var sub = "Automation-X Reorder Items";
var cc = "jason.feucht@automation-x.com";
//now we create the body of the email
var total=" ";
   for (var i = 0; i < searchresults.length; i++)
   {
      //access the values this time using the name and summary type
      var fivecode= searchresults[i].getValue('custrecord20');
      var item=searchresults[i].getText('custrecord_item');
//    var desc=searchresults[i].getText('custrecord_item_description'); //comes back null, while salesdescription join comes back invalid
	  var quantity=" ";	  
//	  var total=total+"<tr><td>"+fivecode+"</td><td>"+item+"</td><td>"+desc+"</td><td>"+quantity+"</td></tr>";//desc isnt working
  	  var total=total+"<tr><td>"+fivecode+"</td><td>"+item+"</td><td>"+quantity+"</td></tr>";
	  }
//format table
	  //var body = "<table border=\"1\"><tr><th>5 code</th><th>Item</th><th>Description</th><th>Quantity</th></tr>"+total+"</table>";//includes non working  description
	  var body = "<table border=\"1\"><tr><th>5 code</th><th>Item</th><th>Quantity</th></tr>"+total+"</table>";
//send email
nlapiSendEmail(author, recipient, sub, body, cc);

}