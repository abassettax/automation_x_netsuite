/**
 * @copyright Copyright (c) 2008-2019 Elim Solutions Inc.
 * 2875 14th Ave, Suite 201, Markham, ON, Canada<br/>
 * All Rights Reserved.<br/>
 * <br/>
 * This software is the confidential and proprietary information of
 * Elim Solutions ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Elim Solutions.
 *
 * @author Fan Lu
 * @date 23 Aug 2019
 * @version 1.0.0.0
 * @module Scheduled Script
 * @description This Scheduled script is used to generate single schedule for one year
 */
/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	var now = new Date();
	var start = nlapiDateToString(now);
	var classADate = nlapiDateToString(nlapiAddMonths(now, -parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_a_span'))));
	var classBDate = nlapiDateToString(nlapiAddMonths(now, -parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_b_span'))));
	var classCDate = nlapiDateToString(nlapiAddMonths(now, -parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_c_span'))));
	var locations = nlapiGetContext().getSetting('SCRIPT', 'custscript_location_new').split(/[ ,;\t]+/);
	var column1 = new nlobjSearchColumn('internalid', null, 'GROUP');
	var column2 = new nlobjSearchColumn('formuladate', null, 'MAX');
	column2.setFormula('CASE {custrecord_pim_item.custrecord_pim_location} WHEN {inventorylocation} THEN {custrecord_pim_item.custrecord_pim_lastcountdate} ELSE NULL END');
	column2.setSort();
	/**
	 * 
	 * @param {string} type 
	 * @param {array} filters 
	 */
	var getAllItems = function(type, filters, columns) {
		var output = [];
		var index = 0;
		var loop = true;
		var searchSet = nlapiCreateSearch(type, filters, columns).runSearch();
		while (loop) {
			loop = false;
			var results = searchSet.getResults(index * 1000, (index + 1) * 1000);
			for (var i = 0; results && i < results.length; i += 1) {
				output.push(results[i].getValue(column1));
			}
			if (results && results.length >= 1000) {
				loop = true;
				index += 1;
			}
		}
		return output;
	};
	for (var loc = 0; loc <locations.length; loc += 1) {
		if (nlapiGetContext().getRemainingUsage() < 400) {
			nlapiYieldScript();
		}
		var template =  nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_cycle_schedule_tem_new');
		var templateName = nlapiLookupField('customrecord_es_cycle_schedule',  template, 'name');
		var filters = [ ['locationinvtclassification', 'anyof', [1, 2, 3]],
			//'and', ['type', 'anyof', 'InvtPart'],
			'and', ['inventorylocation', 'anyof', locations[loc]],
			'and', ['isinactive', 'is', 'F'], 'and',
			[['max(formuladate: CASE {custrecord_pim_item.custrecord_pim_location} WHEN {inventorylocation} THEN {custrecord_pim_item.custrecord_pim_lastcountdate} ELSE NULL END)', 'isempty', ''], 'OR',
				['max(formuladate: CASE WHEN {custrecord_pim_item.custrecord_pim_location} = {inventorylocation} AND {locationinvtclassification} = \'A\' THEN {custrecord_pim_item.custrecord_pim_lastcountdate} ELSE NULL END)', 'onorbefore', classADate], 'OR',
				['max(formuladate: CASE WHEN {custrecord_pim_item.custrecord_pim_location} = {inventorylocation} AND {locationinvtclassification} = \'B\' THEN {custrecord_pim_item.custrecord_pim_lastcountdate} ELSE NULL END)', 'onorbefore',classBDate], 'OR',
				['max(formuladate: CASE WHEN {custrecord_pim_item.custrecord_pim_location} = {inventorylocation} AND {locationinvtclassification} = \'C\' THEN {custrecord_pim_item.custrecord_pim_lastcountdate} ELSE NULL END)', 'onorbefore',classCDate] 
			]];
		nlapiLogExecution('DEBUG', 'filters', JSON.stringify(filters));
		var temp = getAllItems('item', filters, [column1, column2]);
		if (temp.length > 0) {
			nlapiLogExecution('DEBUG', 'title', temp);
			var cycleSchedule = nlapiCopyRecord('customrecord_es_cycle_schedule', template, {'recordmode':'dynamic'} );
			cycleSchedule.setFieldValue('custrecord_cs_start_date', start);
			cycleSchedule.setFieldValue('custrecord_cs_next_run_date', null);
			cycleSchedule.setFieldValues('custrecord_cs_items', temp);
			cycleSchedule.setFieldValue('custrecord_cs_location', locations[loc]);
			cycleSchedule.setFieldValue('name', templateName + ' - ' + locations[loc] + ' - ' + start);
			nlapiSubmitRecord(cycleSchedule, false, true);
		}
	}
}

