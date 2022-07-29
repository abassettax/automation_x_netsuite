/* -------------------------------------------------------------------------------------------------------
*	
Function:	Total Profit of all Line Items.

Functionality:
Calculates the Total Profit when each line item is added . Profit = Profit for each line item added.
And Total Profit would be profit when each line item profit is added up.
Profit is calculated as Amount * Quantity

Deployment:
The script can be deployed on Estimate .

Event triggering the script:
It can be called at the add / modify of line item.(Validate Line function)

Custom Fields:
+------------------------------------------------------------------------------------------------------+
| S. No.|		Id			|	  Type			|	Level	|		Description							
+------------------------------------------------------------------------------------------------------+
| (1)	|	_totalprofit	|	Currency		|	Body	|	It displays the Total Profit when each line item is added.	
																					
Create above custom fields with their id and type as mentioned in table.
*-----------------------------------------------------------------------------------------------------------
*/

function calculateTotalProfit()
{
	var amount;
	var quantity;
	var totProfit;
	var cost;
	var totalProfit=0;
	
	if(nlapiGetLineItemCount('item')==0)
	{
		nlapiSetFieldValue('custbody_totalprofit','');
	}
	
	for ( i = 1; i <= nlapiGetLineItemCount('item'); i++)
	{
		amount = nlapiGetLineItemValue('item','amount',i);
		quantity = nlapiGetLineItemValue('item','quantity',i);
		cost = nlapiGetLineItemValue('item','custcol_purchase_price',i);
	
		totProfit = ((amount * quantity) - (cost * quantity)) ;
		totalProfit = totalProfit+totProfit;
		nlapiSetFieldValue('custbody_totalprofit',totalProfit);
	}
	return true;
}