/**
* Copyright (c) 2011 Trajectory Inc. 
* 165 John St. 3rd Floor, Toronto, ON, Canada, M5T 1X3 
* www.trajectoryinc.com 
* All Rights Reserved. 
*/

/** 
* @System: Netsuite - Production
* @Author: Darren Hill
* @Company: Trajectory Inc. / Kuspide Canada Inc. 
* @CreationDate: 2012/03/16
* @GeneralDescription: This script is to enforce Swish Data specific Time Sheet rules.
* @LastModificationDate: 2012/03/22
* @LastModificationAuthor: Darren Hill
* @LastModificationDescription: Creation
* @NamingStandard: TJINC_NSJ-1-1
* @Version 1.0
*/

/*
 * @Function: TJINC_OnSave
 * @Purpose: This function loads 
 * @Parameters: Type (default) Defaults record Type
 *              Name (default) the field that is being updated
 *              linenum (default) the line index of the lineitem
 * @Returns: N/A
 */
function InventorySummary(request,response) {
	var itemId     = request.getParameter('itemId')==null     || isNaN(request.getParameter('itemId'))     ? -1 : parseInt( request.getParameter('itemId') );
	var locationId = request.getParameter('locationId')==null || isNaN(request.getParameter('locationId')) ? -1 : parseInt( request.getParameter('locationId') );
	
	var itemName     = request.getParameter('itemName');
	var locationName = request.getParameter('locationName');
	
	if(itemId==-1 && itemName!=null){
		var searchItems = nlapiSearchGlobal( itemName );
		if(searchItems.length!=null && searchItems.length>0){
			itemId = searchItems[0].getId();
		}
	}
	
	if(locationId==-1 && locationName!=null){	
		var searchLocations = nlapiSearchRecord('location', null, new nlobjSearchFilter('name', null, 'is', locationName), null);
		if(searchLocations.length!=null && searchLocations.length>0){
			locationId = searchLocations[0].getId();
		}
	}
	
	nlapiLogExecution('DEBUG', 'InventorySummary', "Incoming request for ItemId: " + itemId );
	
	var html = "";
	
	if(itemId!=-1){	
		var filters = [];
		filters.push ( new nlobjSearchFilter('internalIdNumber', null, 'equalto', itemId) );
		var items = nlapiSearchRecord('item', null, filters, null);
		
		if(items==null || items.length<1){
			html += '<html>';
			html += '<body>'
			html += 'Sorry, the item you are looking for does not exist!';
			html += '</body>';
			html += '</html>';
		}
		else{
			var recordType = items[0].getRecordType();
			
			if(recordType!='inventoryitem'){
				html += '<html>';
				html += '<body>'
				html += 'Sorry, this is only available for Inventory Items!';
				html += '</body>';
				html += '</html>';
			}
			else{
				var locationOnHand = 0;
				var totalOnHand = 0;
				var locationCommitted = 0;
				var totalCommitted = 0;
				var locationReorderPoint = 0;
				var totalReorderPoint = 0;
				var locationAvailable = 0;
				var totalAvailable = 0;
				var locationBackOrdered = 0;
				var totalBackOrdered = 0;
				var locationStockValue = 0.0;
				var totalStockValue = 0.0;
				var locationOnOrder = 0.0;
				var totalOnOrder = 0.0;
				
				
				//Get Location Information
				var item = nlapiLoadRecord(recordType, itemId);
				var INVProfile    = item.getFieldValue('custitem43');
				var LeadTime      = item.getFieldValue('leadtime');
				
				
				var ActivityClassID = item.getFieldValue('custitem23')==null || isNaN(item.getFieldValue('custitem23')) ? -1 : parseInt(item.getFieldValue('custitem23'));
				var ActivityClass   = nlapiLookupField('customlist57', ActivityClassID, 'name');
				if(ActivityClass==null)
					ActivityClass = "-";
				
				var RevenueClassID = item.getFieldValue('custitem45')==null || isNaN(item.getFieldValue('custitem45')) ? -1 : parseInt(item.getFieldValue('custitem45'));
				var RevenueClass   = nlapiLookupField('customlist57', RevenueClassID, 'name');
				if(RevenueClass==null)
					RevenueClass = "-";
				
				var SourceID = item.getFieldValue('custitem46')==null || isNaN(item.getFieldValue('custitem46')) ? -1 : parseInt(item.getFieldValue('custitem46'));
				var Source   = nlapiLookupField('customlist80', SourceID, 'name');
				if(Source==null)
					Source = "-";
				
				var locationCount = item.getLineItemCount('locations');
				
				for (var i = 1; i <= locationCount; i++)
				{
					var tempOnHand       = item.getLineItemValue('locations', 'quantityonhand', i)==null    || isNaN(item.getLineItemValue('locations', 'quantityonhand', i))    ? 0 : parseInt( item.getLineItemValue('locations', 'quantityonhand',    i) );
					var tempCommitted    = item.getLineItemValue('locations', 'quantitycommitted', i)==null || isNaN(item.getLineItemValue('locations', 'quantitycommitted', i)) ? 0 : parseInt( item.getLineItemValue('locations', 'quantitycommitted', i) );
					var tempReorderPoint = item.getLineItemValue('locations', 'reorderpoint', i)==null || isNaN(item.getLineItemValue('locations', 'reorderpoint', i)) ? 0 : parseInt( item.getLineItemValue('locations', 'reorderpoint', i) );
					var tempAvailable    = item.getLineItemValue('locations', 'quantityavailable', i)==null || isNaN(item.getLineItemValue('locations', 'quantityavailable', i)) ? 0 : parseInt( item.getLineItemValue('locations', 'quantityavailable', i) );
					var tempBackOrdered  = item.getLineItemValue('locations', 'quantitybackordered', i)==null || isNaN(item.getLineItemValue('locations', 'quantitybackordered', i)) ? 0 : parseInt( item.getLineItemValue('locations', 'quantitybackordered', i) );
					var tempStockValue   = item.getLineItemValue('locations', 'onhandvaluemli', i)==null || isNaN(item.getLineItemValue('locations', 'onhandvaluemli', i)) ? 0 : parseFloat( item.getLineItemValue('locations', 'onhandvaluemli', i) );
					var tempOnOrder		 = item.getLineItemValue('locations', 'quantityonorder', i)==null || isNaN(item.getLineItemValue('locations', 'quantityonorder', i)) ? 0 : parseFloat( item.getLineItemValue('locations', 'quantityonorder', i) );
					
					if(parseInt(item.getLineItemValue('locations', 'locationid', i)) == locationId){
						locationOnHand = tempOnHand;
						locationCommitted = tempCommitted;
						locationReorderPoint = tempReorderPoint;
						locationAvailable = tempAvailable;
						locationBackOrdered = tempBackOrdered;
						locationStockValue = tempStockValue;
						locationOnOrder = tempOnOrder;
					}
					totalOnHand    += tempOnHand;
					totalCommitted += tempCommitted;
					totalReorderPoint += tempReorderPoint;
					totalAvailable += tempAvailable;
					totalBackOrdered += tempBackOrdered;
					totalStockValue += tempStockValue;
					totalOnOrder += tempOnOrder;
				}
				
				var r_totalunitssold      = item.getFieldValue('custitem_tjinc_totalunitssold');
				var r_averagedemand       = item.getFieldValue('custitem_tjinc_averagedemand');
				var r_averagedemandtrend  = item.getFieldValue('custitem_tjinc_averagedemandtrend');
				var r_monthsonhand        = item.getFieldValue('custitem_tjinc_monthsonhand');
				
			html += '<html>';
				html += '<body>'
					html += '<table cellspacing="2" cellpadding="2" style="text-align:right;font-size:small;">';
						html += '<tr>';
							html += '<td></td>';
							html += '<td>'+nlapiLookupField('location', locationId, 'name').replace("A: ", "")+'</td>';
							html += '<td>All Warehouses</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>On Hand</td>';
							html += '<td>'+locationOnHand+'</td>';
							html += '<td>'+totalOnHand+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Committed/Staged</td>';
							html += '<td>'+locationCommitted+'</td>';
							html += '<td>'+totalCommitted+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Available</td>';
							html += '<td>'+locationAvailable+'</td>';
							html += '<td>'+totalAvailable+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>On P/O</td>';
							html += '<td>'+locationOnOrder+'</td>';
							html += '<td>'+totalOnOrder+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>On B/O</td>';
							html += '<td>'+locationBackOrdered+'</td>';
							html += '<td>'+totalBackOrdered+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>3 Mon Units</td>';
							html += '<td>-</td>';
							html += '<td>'+r_totalunitssold+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>3 Mon Demand</td>';
							html += '<td>-</td>';
							html += '<td>'+r_averagedemand+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>3 Mon Trend %</td>';
							html += '<td>-</td>'
						html += '<td '
						if(r_averagedemandtrend>0)
							html += 'style="color:Green">+'+r_averagedemandtrend+'%</td>';
						else
							html += 'style="color:Red">-'+r_averagedemandtrend+'%</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>INV Profile</td>';
							html += '<td></td>';
							html += '<td>'+INVProfile+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Classifications</td>';
							html += '<td></td>';
							html += '<td>'+ActivityClass+'/'+RevenueClass+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Months On Hand</td>';
							html += '<td>-</td>';
							html += '<td>'+r_monthsonhand+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Lead Time</td>';
							html += '<td></td>';
							html += '<td>'+LeadTime+' days</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Reorder Point</td>';
							html += '<td>'+locationReorderPoint+'</td>';
							html += '<td>'+totalReorderPoint+' avg</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Stock Value</td>';
							html += '<td>$'+nlapiFormatCurrency(locationStockValue)+'</td>';
							html += '<td>$'+nlapiFormatCurrency(totalStockValue)+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>YTD Fill Ratio %</td>';
							html += '<td>-</td>';
							html += '<td>-</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td>Source</td>';
							html += '<td></td>';
							html += '<td>'+Source+'</td>';
						html += '</tr>';
					html += '</table>';
				html += '</body>';
			html += '</html>';
			}
		}
	}
	response.write( html );
	//prefix header with Custom-Header. See nlobjResponse.setHeader(name, value)
	response.setHeader('Custom-Header-Demo', 'Demo');
}