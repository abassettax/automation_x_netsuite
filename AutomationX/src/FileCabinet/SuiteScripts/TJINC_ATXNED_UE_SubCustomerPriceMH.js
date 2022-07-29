/**
 * Copyright (c) 2014 Trajectory Inc. 
 * 2 Berkeley Street, Unit 205, Toronto, ON, Canada, M5A 4J5 
 * www.trajectoryinc.com 
 * All Rights Reserved. 
 */

/**
 * @System: Automation X
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: 20140417
 * @DocumentationUrl: https://docs.google.com/a/trajectoryinc.com/document/d/1IHOQ8EQcVo_UEvIzZ8Wlhgc-kmggz0fY7pFg6Vgh6gs/edit#
 * @ModuleDocumentationUrl: https://drive.google.com/a/trajectoryinc.com/?tab=mo#folders/0B8cSTh0NiCPUNTRhYzZkODEtMzU3MS00YTZmLTk5ODctMGI5YzJmMjgwMmQ5
 * @NamingStandard: TJINC_NSJ-1-3-2
 */

var b_ATXNED_log = true;
var s__ATXNED_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0';
var s__ATXNED_Author = '12091';

// https://docs.google.com/a/trajectoryinc.com/document/d/1IHOQ8EQcVo_UEvIzZ8Wlhgc-kmggz0fY7pFg6Vgh6gs/edit#heading=h.d5nm9ipvq8a0
function TJINC_ATXNED_UpdateSubCustomers(pID , Ctype, s_type)
{
	if (!b_ATXNED_log){ b_ATXNED_log = (navigator.userAgent == s__ATXNED_agent); }
	if (b_ATXNED_log){ nlapiLogExecution('DEBUG', 'TJINC_ATXNED_UpdateSubCustomers', 'IN'+Ctype);}
	 
	if(  s_type != 'eeedit' && Ctype == 'customer'){

		var a_filters = [], a_columns = [], o_parentCustomer = null, o_activeItems = {},o_activeItems_b = {},o_activeItems_c = {};
nlapiLogExecution('DEBUG', 'Ctype, pID',Ctype +'-' + pID);
		o_parentCustomer = nlapiLoadRecord(Ctype, pID); 
		if (b_ATXNED_log){ nlapiLogExecution('DEBUG', 'TJINC_ATXNED_UpdateSubCustomers', 'Parent Customer ' + o_parentCustomer.id ); }

		a_filters.push(new nlobjSearchFilter('parent', null, 'is', o_parentCustomer.id ));
		a_filters.push(new nlobjSearchFilter('parent', null, 'noneof', '@NONE@' )); 
      	a_filters.push(new nlobjSearchFilter('isjob', null, 'is', 'F' )); 
      
		a_columns.push(new nlobjSearchColumn('internalid'));
		var a_searchResults = nlapiSearchRecord('customer', null, a_filters, a_columns);

		if (a_searchResults !== null && a_searchResults.length > 0){  

			var  a_groupPricing = [],a_itemPricing =[],a_itemPricingId = [],a_filters = [], a_columns = [],a_filters_b = [], a_columns_b = [],a_filters_c = [], a_columns_c = [];

			i_priceLevel = o_parentCustomer.getFieldValue('pricelevel');
			for( var a = 1; a <= o_parentCustomer.getLineItemCount('grouppricing') ; a++){
				a_groupPricing.push({
					'group':o_parentCustomer.getLineItemValue('grouppricing', 'group', a),
					'level':o_parentCustomer.getLineItemValue('grouppricing', 'level', a)
				});
			}
           
			for( var a = 1; a <= o_parentCustomer.getLineItemCount('itempricing') ; a++){
				a_itemPricingId.push(o_parentCustomer.getLineItemValue('itempricing', 'item', a));
				a_itemPricing.push({
					'item':o_parentCustomer.getLineItemValue('itempricing', 'item', a),
					'level':o_parentCustomer.getLineItemValue('itempricing', 'level', a),
					'item_display':o_parentCustomer.getLineItemValue('itempricing', 'item_display', a),
					'price':o_parentCustomer.getLineItemValue('itempricing', 'price', a),
				});
			} nlapiLogExecution('DEBUG', 'item array', a_itemPricingId.length);

         /////////////////
          var a_itemPricingId_A =  a_itemPricingId.slice(0,1000);
          var a_itemPricingId_b = a_itemPricingId.slice(1000,2000);
          var a_itemPricingId_c = 0;
          
          if(a_itemPricingId.length > 2000 )  {a_itemPricingId_c =   a_itemPricingId.slice(2000,3000);}
          
         nlapiLogExecution('DEBUG', 'item a_itemPricingId_A', a_itemPricingId_A.length);
          nlapiLogExecution('DEBUG', 'item a_itemPricingId_b', a_itemPricingId_b.length);
          if(a_itemPricingId_A)
            {
                       a_filters.push(new nlobjSearchFilter('internalid', null, 'anyof', a_itemPricingId_A ));
						a_filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F' ));
            			a_columns.push(new nlobjSearchColumn('isinactive'));
						var a_searchActItems = nlapiSearchRecord('item', null, a_filters, a_columns);

			if(a_searchActItems != null){
				for(var i = 0; i < a_searchActItems.length ; i++){
					o_activeItems[(a_searchActItems[i].getId())] = {'itemid':(a_searchActItems[i].getId())};
				}
			}
        }nlapiLogExecution('DEBUG', 'o_activeItems1',o_activeItems.length);
          /////////////
          if(a_itemPricingId_b && a_itemPricingId_b != 0)
            {
                        a_filters_b.push(new nlobjSearchFilter('internalid', null, 'anyof', a_itemPricingId_b ));
						a_filters_b.push(new nlobjSearchFilter('isinactive', null, 'is', 'F' ));
            			a_columns.push(new nlobjSearchColumn('isinactive'));
						var a_searchActItems_b = nlapiSearchRecord('item', null, a_filters_b, a_columns_b);
                         nlapiLogExecution('DEBUG', 'u',u);
			if(a_searchActItems_b != null){
				for(var u = 0; u < a_searchActItems_b.length ; u++){
                 // nlapiLogExecution('DEBUG', 'u',u);
					o_activeItems_b[(a_searchActItems_b[u].getId())] = {'itemid':(a_searchActItems_b[u].getId())};
				}
			}
        } 
          ///////////////
        nlapiLogExecution('DEBUG', 'a_itemPricingId_c',a_itemPricingId_c.length);
                    if(a_itemPricingId_c && a_itemPricingId_c != 0)
                     {
                        a_filters_c.push(new nlobjSearchFilter('internalid', null, 'anyof', a_itemPricingId_c ));
						a_filters_c.push(new nlobjSearchFilter('isinactive', null, 'is', 'F' ));
            			a_columns.push(new nlobjSearchColumn('isinactive'));
						var a_searchActItems_c = nlapiSearchRecord('item', null, a_filters_c, a_columns_c);
			if(a_searchActItems_c != null){
				for(var u = 0; u < a_itemPricingId_b.length ; u++){
					o_activeItems_c[(a_searchActItems_c[u].getId())] = {'itemid':(a_searchActItems_c[u].getId())};
				}
			}
        }
          
          
          /////////
          nlapiLogExecution('DEBUG', 'o_activeItems',o_activeItems.length);

			for ( var i = 0; i < a_searchResults.length; i++) {
				var remainingUnits = nlapiGetContext().getRemainingUsage();
              nlapiLogExecution('DEBUG', 'remainingUnits', remainingUnits);
				if (remainingUnits < 80) {
					//exit if few units left
					nlapiSendEmail(s__ATXNED_Author,  nlapiGetUser(), 'System Error updating Customers', 'Unable to update Financial data on Customer '+o_parentCustomer.id+ '. Too many sub-customers.', null, null, null);
					if (b_ATXNED_log){nlapiLogExecution('DEBUG', 'TJINC_ATXNED_UpdateSubCustomers', 'Few usage units left, unable to update Financial data on Customer '+o_parentCustomer.id);}
					break;
				}
				else {
                   nlapiLogExecution('DEBUG', 'childID', a_searchResults[i].id);
					var o_childCustomer = nlapiLoadRecord('customer', a_searchResults[i].id); 
					i_inactCount =1;
					o_childCustomer.setFieldValue('pricelevel', i_priceLevel );
					
					for ( var a = 1; a <= o_childCustomer.getLineItemCount('itempricing'); a++) {
						o_childCustomer.removeLineItem('itempricing', a);
						a--;
					}
					for ( var a = 1; a <= o_childCustomer.getLineItemCount('grouppricing'); a++) {
						o_childCustomer.removeLineItem('grouppricing', a);
						a--;
					}
					for ( var a = 0; a < a_groupPricing.length ; a++) {
						o_childCustomer.setLineItemValue('grouppricing', 'group', (a+1), a_groupPricing[a].group);
						o_childCustomer.setLineItemValue('grouppricing', 'level', (a+1), a_groupPricing[a].level);
					}
                 // nlapiLogExecution('DEBUG', 'items updated', a_itemPricing.length);
					for ( var a = 0; a < a_itemPricing.length; a++) {
						if (o_activeItems[(a_itemPricing[a].item)] != null || o_activeItems_b[(a_itemPricing[a].item)]!= null|| o_activeItems_c[(a_itemPricing[a].item)]!= null){
							o_childCustomer.setLineItemValue('itempricing', 'item', i_inactCount, a_itemPricing[a].item);
							o_childCustomer.setLineItemValue('itempricing', 'level', i_inactCount, a_itemPricing[a].level);
							o_childCustomer.setLineItemValue('itempricing', 'item_display', i_inactCount, a_itemPricing[a].item_display);
							o_childCustomer.setLineItemValue('itempricing', 'price', i_inactCount, a_itemPricing[a].price);
							i_inactCount++;
                           // nlapiLogExecution('DEBUG', 'items updated', i_inactCount);
						}
					}

					var i_submitedRecordId = nlapiSubmitRecord(o_childCustomer, true, true);
					nlapiLogExecution('DEBUG', 'TJINC_ATXNED_UpdateSubCustomers', 'Updated sub-customer: ' + i_submitedRecordId);
				}
			}
		}  
	}
	if (b_ATXNED_log){ nlapiLogExecution('DEBUG', 'TJINC_ATXNED_UpdateSubCustomers', 'OUT');}
}


