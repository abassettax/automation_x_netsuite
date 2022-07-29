/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(["require", "exports", "N/https", "N/record", "N/search", "N/error", "N/email", "N/render", "N/file", "N/runtime"], 
	function (require, exports, https, record, search, error, email, render, file, runtime) {
	"use strict";
	return {
    	execute: function(context) { 
		
		var categorySearch = search.create({
			type: search.Type.SITE_CATEGORY,
    		columns: [
    			'itemid'
    		]
		});	
    	
		var results = categorySearch.run().getRange({start: 0, end: 500});
		
		}
	}
});