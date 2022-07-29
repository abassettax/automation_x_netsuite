/**
* Copyright (c) [year] Trajectory Inc. 
* 76 Richmond Street East, Suite 4000 Toronto, ON Canada M5C 1P1
* www.trajectoryinc.com 
* All Rights Reserved. 
*/

/** 
* @System: Netsuite - https://sites.google.com/a/trajectoryinc.com/atx/
* @Company: Trajectory Inc. / Kuspide Canada Inc. 
* @CreationDate: 20120918
* @DocumentationUrl: https://sites.google.com/a/trajectoryinc.com/atx/classes/tjinc_atxnir_updatecommited-js
* @NamingStandard: TJINC_NSJ-1-2
*/

/**
* GeneralDescription: This script is designed to source a Item's Quantity Committed for a specific location
* and place it on the Item Receipt.
* Author: Darren Hill
* CreationDate: 20120918 
* LastModificationDescription: Completed testing 
* LastModificationAuthor: Darren Hill
* LastModificationDate: 20120918 
*/
var o_InventoryTypes = {"Assembly": "assemblyitem", "Description": "description", "Discount": "discountitem", "InvtPart": "inventoryitem", "Group": "itemgroup", "Kit": "kititem", "Markup": "markupitem", "NonInvtPart": "noninventoryitem", "OthCharge": "otherchargepurchaseitem", "Payment": "paymentitem", "Service": "serviceitem", "Subtotal": "subtotalitem"};

function getItemQuantityCommited(i_itemid_in, i_locationid_in, s_itemtype_in) {
	"use strict";
	nlapiLogExecution('AUDIT', 'TJINC_GetItemQuantityCommited', "---Started---");
	i_locationid_in = i_locationid_in === null || isNaN(i_locationid_in) ? 0 : parseInt(i_locationid_in, 10);
	nlapiLogExecution('DEBUG', 'TJINC_GetItemQuantityCommited', "looking up Item " + i_itemid_in.toString() + " at location " + i_locationid_in.toString());
	var o_item, i_locationCount, i_commited, i, i_locationid;
	o_item = nlapiLoadRecord(s_itemtype_in, i_itemid_in);
	i_locationCount = o_item.getLineItemCount('locations') === null || isNaN(o_item.getLineItemCount('locations')) ? 0 : parseInt(o_item.getLineItemCount('locations'), 10);
	i_commited = 0;
	i = 1;
	for (i = 1; i <= i_locationCount; i += 1) {
		i_locationid = o_item.getLineItemValue('locations', 'location', i) === null || isNaN(o_item.getLineItemValue('locations', 'location', i)) ? 0 : parseInt(o_item.getLineItemValue('locations', 'location', i), 10);
		if (i_locationid === i_locationid_in) {
			i_commited = o_item.getLineItemValue('locations', 'quantitycommitted', i) === null || isNaN(o_item.getLineItemValue('locations', 'quantitycommitted', i)) ? 0 : parseInt(o_item.getLineItemValue('locations', 'quantitycommitted', i), 10);
		}
	}
	nlapiLogExecution('AUDIT', 'TJINC_GetItemQuantityCommited', "---Finished---");
	return i_commited;
}

function TJINC_BeforeLoad() {
	"use strict";
	nlapiLogExecution('AUDIT', 'TJINC_BeforeLoad (edit/xedit/view)', "---Started---");
	var i_itemCount, i, i_itemid, i_locationid, r_locationQtyCommited, s_itemType;
	i_itemCount = nlapiGetLineItemCount('item') === null || isNaN(nlapiGetLineItemCount('item')) ? 0 : parseInt(nlapiGetLineItemCount('item'), 10);
	i = 1;
	for (i = 1; i <= i_itemCount; i += 1) {
		i_itemid = nlapiGetLineItemValue('item', 'item', i) === null     || isNaN(nlapiGetLineItemValue('item', 'item', i))     ? 0 : parseInt(nlapiGetLineItemValue('item', 'item', i), 10);
		i_locationid = nlapiGetLineItemValue('item', 'location', i) === null || isNaN(nlapiGetLineItemValue('item', 'location', i)) ? 0 : parseInt(nlapiGetLineItemValue('item', 'location', i), 10);
		s_itemType = nlapiGetLineItemValue('item', 'itemtype', i);
		if(s_itemType==='Assembly' || s_itemType==='InvtPart' || s_itemType==='Group' || s_itemType==='Kit'){
			r_locationQtyCommited = getItemQuantityCommited(i_itemid, i_locationid, o_InventoryTypes[s_itemType]);
		}else{
			r_locationQtyCommited = 0;
		}
		nlapiLogExecution('DEBUG', 'Setting Qty Commited', "---Started---");
		nlapiSetLineItemValue('item', 'custcol_tjinc_qtycommitedlocation', i, r_locationQtyCommited);
		nlapiGetLineItemField('item', 'custcol_tjinc_qtycommitedlocation', i).setDisplayType('disabled');
	}
	nlapiLogExecution('AUDIT', 'TJINC_BeforeLoad (edit/xedit/view)', "---Finished---");
}