/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search'],
/**
 * @param {search} search
 */
function (search){
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(context) {
    	
    	var salesorderSearchObj = search.create({
    		   type: "salesorder",
    		   filters:
    		   [
    		      ["type","anyof","SalesOrd"], 
    		      "AND", 
    		      ["trandate","on","1/1/2017"], 
    		      "AND", 
    		      ["mainline","is","F"], 
    		      "AND", 
    		      ["salesteamrole","anyof","-2"]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({name: "tranid", label: "Document Number"}),
    		      search.createColumn({name: "trandate", label: "Date"}),
    		      search.createColumn({name: "postingperiod", label: "Period"}),
    		      search.createColumn({name: "type", label: "Order Type"}),
    		      search.createColumn({name: "custbody_ava_customerentityid", label: "Customer Entityid"}),
    		      search.createColumn({
    		         name: "internalid",
    		         join: "customer",
    		         label: "Customer Internal ID"
    		      }),
    		      search.createColumn({name: "account", label: "Account"}),
    		      search.createColumn({name: "accounttype", label: "Account Type"}),
    		      search.createColumn({name: "statusref", label: "Status"}),
    		      search.createColumn({name: "classnohierarchy", label: "Business Unit"}),
    		      search.createColumn({name: "location", label: "Location"}),
    		      search.createColumn({name: "custbody_lia_customerponumber", label: "Customer PO"}),
    		      search.createColumn({name: "salesrep", label: "Sales Rep"}),
    		      search.createColumn({name: "custcol38", label: "AX 5 Code Dynamic"}),
    		      search.createColumn({
    		         name: "internalid",
    		         join: "item",
    		         label: "Item ID"
    		      }),
    		      search.createColumn({name: "quantity", label: "Sale Quantity"}),
    		      search.createColumn({name: "rate", label: "Item Price"}),
    		      search.createColumn({name: "pricelevel", label: "Price Level"}),
    		      search.createColumn({name: "contributionprimary", label: "Primary Sales Rep Contribution %"}),
    		      search.createColumn({name: "excludecommission", label: "Exclude Commissions"}),
    		      search.createColumn({name: "salesteammember", label: "Sales Team Member"}),
    		      search.createColumn({name: "quantitycommitted", label: "Quantity Committed"}),
    		      search.createColumn({name: "salesteamrole", label: "Sales Team Role"}),
    		      search.createColumn({name: "costestimate", label: "Est. Extended Cost (Line)"}),
    		      search.createColumn({name: "estgrossprofit", label: "Est. Gross Profit (Line)"}),
    		      search.createColumn({name: "taxline", label: "Tax Line"}),
    		      search.createColumn({name: 'isprimary', label: "Primary"})
    		   ]
    		});
    	var results = salesorderSearchObj.run().getRange({
    		start : 0,
    		end : 10
    	});
    	
    }
    
    var stopper = 0;


    return {
        execute: execute
    };
    
    		
    		
    
    
});
   
