/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Mar 2014     jasdeep
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type) {

	if (type != 'create' && nlapiGetRecordId()) {
		var Items = {};
		Items['ItemIds'] = [];
		Items['Details'] = {};

		var recId = nlapiGetRecordId();
		nlapiLogExecution('DEBUG', recId, 'RecId=' + recId + ',' + 'Start - Units Remaining = ' + nlapiGetContext().getRemainingUsage());
		var rec = nlapiLoadRecord('purchaseorder', recId);

		var itemCount = rec.getLineItemCount('item');

		for ( var lineNum = 1; lineNum <= itemCount; lineNum++) {

			if (rec.getLineItemValue('item', 'itemtype', lineNum) === 'InvtPart') {

				var itemId = rec.getLineItemValue('item', 'item', lineNum);
				var qtyOrdered = rec.getLineItemValue('item', 'quantity', lineNum);

				Items['ItemIds'].push(itemId);

				if (!Items['Details'].hasOwnProperty(itemId)) {
					Items['Details'][itemId] = [];
				}
				Items['Details'][itemId].push({
					'lineNum' : lineNum,
					'qtyOrdered' : qtyOrdered
				});
			}
		}

		if (Items['ItemIds'].length > 0) {

			var searchResults = searchItem(Items['ItemIds']);

			if (searchResults) {

				for ( var i = 0; searchResults != null && i < searchResults.length; i++) {

					var item = searchResults[i];
					var itemId = item.getValue('internalid');

					for ( var j = 0; j < Items['Details'][itemId].length; j++) {

						var qtyOrdered = Items['Details'][itemId][j]['qtyOrdered'];
						var qtyAvailable = item.getValue('quantityavailable');
						var qtyBckOrd = item.getValue('quantitybackordered');
						var avgDemand = item.getValue('custitem_tjinc_averagedemand');

						var mohAfterPO = getMOHAfterPO(qtyOrdered, qtyAvailable, qtyBckOrd, avgDemand);

						if(mohAfterPO){
						var lineNum = Items['Details'][itemId][j]['lineNum'];
						nlapiSetLineItemValue('item', 'custcol47', lineNum, mohAfterPO);
						}
					}
				}
			}
		}
		nlapiLogExecution('DEBUG', recId, 'RecId=' + recId + ',' + 'End - Units Remaining = ' + nlapiGetContext().getRemainingUsage());
	}

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLine(type) {

	nlapiLogExecution('DEBUG', 'clientValidateLine', 'Start - Units Remaining = ' + nlapiGetContext().getRemainingUsage());

	var itemId = nlapiGetCurrentLineItemValue(type, 'item');

	if (itemId) {
		var itemIds = [];
		itemIds.push(itemId);

		if (nlapiLookupField('item', itemId, 'type') === 'InvtPart') {

			var searchResults = searchItem(itemIds);

			if (searchResults) {

				for ( var i = 0; searchResults != null && i < searchResults.length; i++) {

					var item = searchResults[i];

					var qtyOrdered = nlapiGetCurrentLineItemValue(type, 'quantity');
					var qtyAvailable = item.getValue('quantityavailable');
					var qtyBckOrd = item.getValue('quantitybackordered');
					var avgDemand = item.getValue('custitem_tjinc_averagedemand');

					var mohAfterPO = getMOHAfterPO(qtyOrdered, qtyAvailable, qtyBckOrd, avgDemand);

					if(mohAfterPO){
					nlapiSetCurrentLineItemValue(type, 'custcol47', mohAfterPO);
					}
				}
			}
		}
	}
	nlapiLogExecution('DEBUG', 'clientValidateLine', 'End - Units Remaining = ' + nlapiGetContext().getRemainingUsage());
	return true;
}

function searchItem(itemIdList) {

	var filters = [];
	var columns = [];

	filters.push(new nlobjSearchFilter('internalid', null, 'anyof', itemIdList));
	columns.push(new nlobjSearchColumn('internalid'));
	columns.push(new nlobjSearchColumn('quantityavailable'));
	columns.push(new nlobjSearchColumn('quantitybackordered'));
	columns.push(new nlobjSearchColumn('custitem_tjinc_averagedemand'));

	var search = nlapiSearchRecord('item', null, filters, columns);

	return search;

}

function getMOHAfterPO(qtyOrdered, qtyAvailable, qtyBckOrd, avgDemand) {

	var result = null;

	qtyOrdered = parseInt(qtyOrdered, 10);
	qtyAvailable = parseInt(qtyAvailable, 10);
	qtyBckOrd = parseInt(qtyBckOrd, 10);
	avgDemand = parseFloat(avgDemand).toFixed(1);

	if (avgDemand != 0 && avgDemand) {

		if (!qtyBckOrd) {
			qtyBckOrd = 0;
		}
		if (!qtyAvailable) {
			qtyAvailable = 0;
		}

		result = (qtyAvailable - qtyBckOrd + qtyOrdered) / avgDemand;
		result = parseFloat(result).toFixed(1);
	}

	if (isNaN(result))
		result = null;

	return result;
}