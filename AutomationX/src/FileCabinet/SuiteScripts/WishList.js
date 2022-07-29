
var customWishList = 'custentity_itemswishlist';

function ViewWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var catalogue = params.getParameter('accountnbr');

    var addToCartHtmlUrl = "http://www.automation-x.com/site/wl-files/addtocart.htm";
	var removeItemUrl = "https://forms.na3.netsuite.com/app/site/hosting/scriptlet.nl?script=37&deploy=1&compid=422523&h=6c8b282483233d41d889";
	var clearWishListUrl = "https://forms.na3.netsuite.com/app/site/hosting/scriptlet.nl?script=38&deploy=1&compid=422523&h=4fcb2c95a43a49e8ac83";

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}

	var itemsWL = customer.getFieldValue(customWishList);
	var html = "<html>";
	if(itemsWL == null || itemsWL == "")
	{
		html = html + "<body><table><tr><td ><label>There are no items in your WishList</label></td></tr>";
		html = html + "<tr><td>&nbsp;</td></tr>"
	}
	else
	{
        html = html + "<head>";
        html = html + '<style media="all" type="text/css">@import "http://www.automation-x.com/site/wl-files/default.css";</style>';
        html = html + "</head>";
        
        html = html + "<script language='javascript'>";
		html = html + "var itemsCart = new Array();";
		html = html + "function send(){var _multi = '';for (var i=0;i<itemsCart.length;i++){var _itm = itemsCart[i];if(document.getElementById('chk_'+_itm.id.replace('qty_','')).checked){_multi += _itm.id.replace('qty_','')+','+_itm.qty+';';}}if(_multi==''){alert('None of the items where selected');}else{window.parent.location='" + addToCartHtmlUrl + "?account="+catalogue+"&multi=' + _multi;}}";
		html = html + "function popItemX_ID(parid){for(var i=0;i<itemsCart.length;i++){if (itemsCart[i].id==parid){itemsCart.splice(i,1);}}}";
		html = html + "function qtyChanged(id){popItemX_ID(id);val=document.getElementById(id).value;if(val!=''){itemsCart[itemsCart.length]={id:id,qty:val};}}";
		html = html + "function Redirect(item){window.parent.location = 'http://shopping.na3.netsuite.com/s.nl/c." + catalogue + "/it.A/id.' + item + '/.f';}";
		html = html + "function RemoveItem(item){window.location = '" + removeItemUrl + "&idCustomer=" + idCustomer + "&idItem=' + item + '&accountnbr=" + catalogue + "';}";
		html = html + "function ClearWishList(){window.location.href = '" + clearWishListUrl + "&accountnbr=" + catalogue + "&idCustomer=" + idCustomer + "';}";
		html = html + "</script>";

		var itemsWLArray = new Array();
		itemsWLArray = itemsWL.split(";");

		html = html + "<body><table class='tablesorter' width='100%' border='0' cellpadding='0' cellspacing='0' id='tableitems'><thead><tr>";
    	html = html + "<th width='150'>Name</th>";
    	html = html + "<th height='30'>Description</th>";
    	html = html + "<th width='70'>Price</th>";
    	html = html + "<th width='70'>Qty</th>";
    	html = html + "<th width='70'>&nbsp;</th>";
		html = html + "<th width='44'>&nbsp;</th></tr></thead>";
        html = html + "<tbody>";

        var count = 0;
    	for(var i = 0; i < itemsWLArray.length - 1; i++)
		{
            var error = false;
			var item = itemsWLArray[i];
			var itemRecord;
			try
			{
				itemRecord = nlapiLoadRecord('inventoryitem', item);
			}
			catch(SSS_RECORD_TYPE_MISMATCH)
			{
                try
                {
                    itemRecord = nlapiLoadRecord('noninventoryitem', item);
                }
                catch(SSS_RECORD_TYPE_MISMATCH)
                {
                    try
                    {
                        itemRecord = nlapiLoadRecord('assemblyitem', item);
                    }
                    catch(SSS_RECORD_TYPE_MISMATCH)
                    {
                        try
                        {
                            itemRecord = nlapiLoadRecord('kititem', item);
                        }
                        catch(SSS_RECORD_TYPE_MISMATCH)
                        {
                            error = true;
                        }
                    }
                }
			}
            if(!error)
            {
                if(count % 2 == 0)
                {
                    classname = "even";
                }
                else
                {
                    classname = "odd";
                }
                var itemName = itemRecord.getFieldValue('storedisplayname');
                if(itemName == null)
                {
                    itemName = itemRecord.getFieldValue('itemid');
                }
                html = html + "<tr class='"+classname+"'><td height='25' ><label><a target='_blank' href='http://shopping.na3.netsuite.com/s.nl/c." + catalogue + "/it.A/id." + item + "/.f'>" + itemName + "</a></label></td>";
                var itemDescription = itemRecord.getFieldValue('salesdescription');
                if(itemDescription == null)
                {
                    itemDescription = "";
                }
                html = html + "<td >" + itemDescription + "</td>";
                var price = itemRecord.getLineItemValue('price', 'price_1_', 1);
                if(price == null)
                {
                    price = "";
                }
                else
                {
                    price = "$" + price;
                }
                html = html + "<td>" + price + "</td>";
                html = html + "<td><input type='text' style='width:40px;' value='1' id='qty_" + item + "' name='qty_" + item +  "' onKeyUp='qtyChanged(this.id)' /></td>";
                html = html + "<td><input type='checkbox' id='chk_" + item + "' name='chk_" + item +  "' /></td>";
                html = html + "<td><a href='javascript:RemoveItem(" + item + ")'>Remove</a></td>";
                
                count++;
            }
		}
        html = html + "<tr><td colspan='6'>&nbsp;</td></tr>";
        html = html + "<tr><td colspan='4'>&nbsp;</td>";
        html = html + "<td align='left'><a href='javascript:ClearWishList()'>Clear WishList</a></td>";
        html = html + "<td align='right'><a href='javascript:send()'>Add to cart</a></td>";
      	html = html + "</tr></tbody></table>";
	}
	html = html + "</body></html>";

	html = html + "<script language='javascript'>";
	html = html + "var itemsWL='"+itemsWL+"';itemsArray = itemsWL.split(';');for(var i=0;i<itemsArray.length-1;i++){var id=itemsArray[i].split(',')[0];qtyChanged('qty_'+id);}";
	html = html + "</script>";

	response.write(html);
}

function AddToWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var idItem = params.getParameter('idItem');
	var url = params.getParameter('url');
	while(url.indexOf("*") != -1)
	{
		url = url.replace("*","&");
	}

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}

	if(customer.getFieldValue('lastname') == null)
	{
		customer.setFieldValue('lastname',' ');
	}

	var itemsWL = customer.getFieldValue(customWishList);
	if(itemsWL == null)
	{
		itemsWL = idItem + ";";
		customer.setFieldValue(customWishList, itemsWL);
		nlapiSubmitRecord(customer, false, true);
	}
	else
	{
		var exists = false;
		var itemsArray = new Array();
		itemsArray = itemsWL.split(';');
		for(var i = 0; i < itemsArray.length - 1; i++)
		{
			var itemID = itemsArray[i];
			if(itemID == idItem)
			{
				exists = true;
			}
		}
		if(!exists)
		{
			itemsWL = itemsWL + idItem + ";";
			customer.setFieldValue(customWishList, itemsWL);
			nlapiSubmitRecord(customer, false, true);
		}
	}
	var html = "<html><script language='javascript'>";
	html = html + "function Redirect(){window.parent.location = '" + url + "';}";
	html = html + "</script>";
	html = html + "<body onLoad='Redirect()'></body></html>";
	response.write( html );
}

function RemoveFromWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var idItem = params.getParameter('idItem');
	var catalogue = params.getParameter('accountnbr');

	var viewWishListUrl = "'http://www.automation-x.com/My-WishList'";

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}

	var itemsWL = customer.getFieldValue(customWishList);
	var itemsArray = new Array();
	itemsArray = itemsWL.split(';');
	var newItems = "";
	for(var i = 0; i < itemsArray.length - 1; i++)
	{
		var itemID = itemsArray[i];
		if(itemID != idItem)
		{
			newItems = newItems + itemsArray[i] + ";";
		}
	}
	customer.setFieldValue(customWishList, newItems);
	nlapiSubmitRecord(customer, false, true);

	var html = "<html><script language='javascript'>";
	html = html + "function Redirect(){window.parent.location = " + viewWishListUrl + ";}";
	html = html + "</script>";
	html = html + "<body onLoad='Redirect()'></body></html>";
	response.write( html );
	response.setHeader('Custom-Header-Demo', 'Demo');
}

function ClearWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var catalogue = params.getParameter('accountnbr');

	var viewWishListUrl = "'http://www.automation-x.com/My-WishList'";

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}

	customer.setFieldValue(customWishList, null);
	nlapiSubmitRecord(customer, false, true);

	var html = "<html><script language='javascript'>";
	html = html + "function Redirect(){window.parent.location = " + viewWishListUrl + ";}";
	html = html + "</script>";
	html = html + "<body onLoad='Redirect()'></body></html>";
	response.write( html );
	response.setHeader('Custom-Header-Demo', 'Demo');
}
