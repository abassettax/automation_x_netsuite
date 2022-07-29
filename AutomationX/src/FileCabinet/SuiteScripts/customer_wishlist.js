function onStart(request, response)
{
	if ( request.getMethod() == "GET" )
	{
		var customerId = request.getParameter("customerId");
		var listResults = SearchCustomerList(customerId);
		
		if(customerId != "invalid")
		{
			CreateWriteCustomerListFunction(listResults);
		}
		else
		{
			CreateLoginMessage();
		}
	}
	else if(request.getMethod() == "POST")
	{
		response.write("bye world");
	}
}

function SearchCustomerList(customerId)
{
	var filters = new Array();
	var columns = new Array();
	var results = new Array();
	
	filters.push(new nlobjSearchFilter("isinactive", null, "is", "F"));
        filters.push(new nlobjSearchFilter("custrecord_customer", null, "is", customerId));
	
	columns.push(new nlobjSearchColumn("custrecord_sort_order"));
	columns.push(new nlobjSearchColumn("custrecord_item"));
	columns.push(new nlobjSearchColumn("custrecord_item_display_name"));
	columns.push(new nlobjSearchColumn("custrecord_item_description"));
	columns.push(new nlobjSearchColumn("custrecord_item_price"));
	columns.push(new nlobjSearchColumn("custrecord_customer"));
	columns.push(new nlobjSearchColumn("custrecord_quantity"));

	var searchResults = nlapiSearchRecord("customrecord_customer_store", null, filters, columns);
	
	var count = searchResults == null ? 0 : searchResults.length;
	
	var sortOrderArray = new Array();
	
	for (i=0; i < count; i++)
	{
		sortOrderArray.push(searchResults[i].getValue("custrecord_sort_order"));
	}
	
	sortOrderArray = sortOrderArray.sort(function(a,b){return a - b});
	sortOrderArray = sortOrderArray.reverse();
	var x = 0;
	
	while(results.length < (count*4))
	{
		for (i=0; i < count; i++)
		{
			if(searchResults[i].getValue("custrecord_sort_order") == sortOrderArray[x])
			{
				var tempName = searchResults[i].getText("custrecord_item");
				var itemName = tempName.replace(/"/g, '&quot;');
				
				var tempDisplayName = searchResults[i].getValue("custrecord_item_display_name") + "";
				var itemDisplayName = tempDisplayName.replace(/"/g, '&quot;');
				
				if(itemDisplayName != "")
				{
					itemName = itemDisplayName;
				}
					
				var tempDesc = searchResults[i].getValue("custrecord_item_description");
				var itemDesc = tempDesc.replace(/"/g, '&quot;');
				
				results.push("<a id='"+ searchResults[i].getValue("custrecord_sort_order") +"' href='http://www.automation-x.com/s.nl/c.422523/n.1/it.A/id." + searchResults[i].getValue("custrecord_item") + "/.f' target='_blank'><b>" + itemName + "</B></a><br />"+ itemDesc +"");
				results.push("Retrieving...<iframe src='http://www.automation-x.com/s.nl/c.422523/n.1/it.A/id." + searchResults[i].getValue("custrecord_item") + "/.f?passPrice=" + searchResults[i].getValue("custrecord_item") + "' id='parent" + searchResults[i].getValue("custrecord_item") + "' width=1 height=1 style='visibility:hidden;'></iframe>");
				results.push(searchResults[i].getValue("custrecord_item"));
				results.push("<a id="+ searchResults[i].getValue("custrecord_item") +" href='https://checkout.na3.netsuite.com/app/site/backend/additemtocart.nl?c=422523&qtyadd=1&buyid=multi&multi="+searchResults[i].getValue("custrecord_item")+",1'>Add</a>");

			}
		}
		
		x++;
	}

	return results;
}

function sortfunction(a, b)
{
	return (a - b)
}


function GetCustomerPriceLevel(customerId)
{
	var filters = new Array();
	var columns = new Array();
	var results = new Array();
	
        filters.push(new nlobjSearchFilter("internalid", null, "is", customerId));
	 filters.push(new nlobjSearchFilter("pricelevel", null, "noneof", "basePrice"));
	
	columns.push(new nlobjSearchColumn("pricelevel"));

	var searchResults = nlapiSearchRecord("customer", null, filters, columns);

        searchResults;

	var count = searchResults == null ? 0 : searchResults.length;
	
	for (i=0; i < count; i++)
	{

		results.push(searchResults[i].getText("pricelevel"));
	
	}

	return results[0].substr(0,2)*.01;
}

function GetItemURLComponent(itemId)
{
	var filters = new Array();
	var columns = new Array();
	var results = new Array();
	
        filters.push(new nlobjSearchFilter("internalid", null, "is", itemId));
	
	columns.push(new nlobjSearchColumn("urlcomponent"));

	var searchResults = nlapiSearchRecord("item", null, filters, columns);

        searchResults;

	var count = searchResults == null ? 0 : searchResults.length;
	
	for (i=0; i < count; i++)
	{

		results.push(searchResults[i].getValue("urlcomponent"));
	
	}

	return results;
}

function CreateWriteCustomerListFunction(listResults)
{
	//response.write("<script type=\"text/javascript\">") 
	response.write("function WriteCustomerList() \n");
	response.write("{ \n");
	response.write("	var listResults = new Array(); \n");
	response.write("	\n");
	
	for(i=0; i<listResults.length; i++)
	{
		response.write("	listResults.push(\"" + listResults[i] + "\"); \n");
	}
	
	response.write("	\n");
	
	response.write("	document.write(\"<table cellpadding=3 id=rowColors>\"); \n");
	response.write("	document.write(\"	<tr class=row1>\"); \n");
	response.write("	document.write(\"		<td width=900><b>Name</B></td>\"); \n");
	response.write("	document.write(\"		<td width=100 align=center><b>Price</B>\"); \n");
	response.write("	document.write(\"		<td width=60 align=center><b>Quantity</B>\"); \n");
	response.write("	document.write(\"	</tr>\"); \n");
	response.write("	\n");	
	
	response.write("	if(listResults.length== 0){document.write(\"No Items Available\")};\n");
	
	response.write("	for(i = listResults.length-1; i > 0; i-=4) \n");
	response.write("	{ \n");
	response.write("		document.write(\"	<tr class='row\" + i%2 +\"'>\"); \n");
	response.write("		document.write(\"		<td>\" + listResults[i-3] + \"</td>\"); \n");
	response.write("		document.write(\"		<td  id=\" + listResults[i-1] + \" align=center>\" + listResults[i-2] + \"</td>\"); \n");
	response.write("		document.write(\"		<td align=center><input type='text' size=2 value=0 onblur='ModifyAddItemLink(\" + listResults[i-1] + \",this.value);'></td>\"); \n");
	response.write("		document.write(\"	</tr>\"); \n");
	response.write("		 \n");
	response.write("	} \n");
	
	response.write("	\n");
	response.write("	document.write(\"	<tr>\"); \n");
	response.write("	document.write(\"		<td>&nbsp;</td>\"); \n");
	response.write("	document.write(\"		<td>&nbsp;</td>\"); \n");
	response.write("	document.write(\"		<td align='center'><a onclick='MultiAdd();'><img src='http://www.automation-x.com/images/WLaddtocart.gif' border=0></a></td>\"); \n");
	response.write("	document.write(\"	</tr>\"); \n");
	response.write("	 \n");
	response.write("	\n");	

	response.write("	document.write(\"</table>\");AlternateRowColors(); \n");

	response.write("\n");
	response.write("} \n");
	
	//response.write("<script>");
}

function CreateLoginMessage(listResults)
{
	//response.write("<script type=\"text/javascript\">") 
	response.write("function WriteCustomerList() \n");
	response.write("{ \n");

	
	response.write("	\n");
	
	response.write("	document.getElementById('listResults').innerHTML = \"<table cellpadding=4 width=100%> <trwidth=100%>  <tdwidth=100%> <br><font size=3>Please </font> <a href='https://checkout.na3.netsuite.com/s.nl?c=422523&sc=4&login=T'><font size=3> Click Here </a>  <font size=3>to login to your account before proceeding to your store.</font> </td> </tr> <tr width=100%> <td width=100%> <br><!--<img align=center border='1'src='http://www.automation-x.com/site/ContactUS/aboutus1.jpg'> <br><br> <br><br>--> </td> </tr> </table>  \" \n");
	
	response.write("\n");
	response.write("} \n");
	
	//response.write("<script>");
}