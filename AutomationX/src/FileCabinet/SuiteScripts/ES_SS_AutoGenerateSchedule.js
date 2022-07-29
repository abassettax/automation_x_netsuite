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
	var frequencyA = parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_a_frequency'));
	if (frequencyA != 1 && frequencyA != 2 && frequencyA != 3 && frequencyA != 4 && frequencyA != 6 && frequencyA != 12) {
		throw {name: 'DATA_ERROR', message: 'Class A Frequency is not correct'};
	}
	var frequencyB = parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_b_frequency'));
	if (frequencyB != 1 && frequencyB != 2 && frequencyB != 3 && frequencyB != 4 && frequencyB != 6 && frequencyB != 12) {
		throw {name: 'DATA_ERROR', message: 'Class B Frequency is not correct'};
	}
	var frequencyC = parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_c_frequency'));
	if (frequencyC != 1 && frequencyC != 2 && frequencyC != 3 && frequencyC != 4 && frequencyC != 6 && frequencyC != 12) {
		throw {name: 'DATA_ERROR', message: 'Class C Frequency is not correct'};
	}
	var maxMonth = 1;
	for (var i = 1; i <= 12; i += 1) {
		if (i % (12 / frequencyA) == 0 && i % (12 / frequencyB) == 0 && i % (12 / frequencyC) == 0) {
			maxMonth = i;
			break;
		}
	}
	nlapiLogExecution('DEBUG', 'maxMonth', maxMonth);
	//var templateRecord = nlapiLoadRecord('', nlapiGetContext().getSetting('SCRIPT', 'custscript_location'));
	var start = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_startdate') || nlapiDateToString(new Date()));

	var locations = nlapiGetContext().getSetting('SCRIPT', 'custscript_location').split(',');
	for (var loc = 0; loc <locations.length; loc += 1) {
		if (nlapiGetContext().getRemainingUsage() < 400) {
			nlapiYieldScript();
		}
		//10 * 3 * 4 = 120
		var classAItems = (function(location){
			return getAllItems('item', [['locationinvtclassification', 'anyof', 1], 'and', ['inventorylocation', 'anyof', location], 'and', ['isinactive', 'is', 'F']]);
		})(locations[loc]);
		var classBItems = (function(location){
			return getAllItems('item', [['locationinvtclassification', 'anyof', 2], 'and', ['inventorylocation', 'anyof', location], 'and', ['isinactive', 'is', 'F']]);
		})(locations[loc]);
		var classCItems = (function(location){
			return getAllItems('item', [['locationinvtclassification', 'anyof', 3], 'and', ['inventorylocation', 'anyof', location], 'and', ['isinactive', 'is', 'F']]);
		})(locations[loc]);
		var templateName = nlapiLookupField('customrecord_es_cycle_schedule',  nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_cycle_schedule_templat'), 'name');
		nlapiLogExecution('DEBUG', 'classAItems', classAItems);
		nlapiLogExecution('DEBUG', 'classAItems.length', classAItems.length);
		nlapiLogExecution('DEBUG', 'classBItems', classBItems);
		nlapiLogExecution('DEBUG', 'classBItems.length', classBItems.length);
		nlapiLogExecution('DEBUG', 'classCItems', classCItems);
		nlapiLogExecution('DEBUG', 'classCItems.length', classCItems.length);
		var output = [];
		var divideAItem = devideby(classAItems, frequencyA, parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_a_number')) || 1);
		var divideBItem = devideby(classBItems, frequencyB, parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_b_number')) || 1);
		var divideCItem = devideby(classCItems, frequencyC, parseInt(nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_class_c_number')) || 1);
		nlapiLogExecution('DEBUG', 'divideAItem', divideAItem);
		nlapiLogExecution('DEBUG', 'divideAItem.length', divideAItem.length);
		nlapiLogExecution('DEBUG', 'divideBItem', divideBItem);
		nlapiLogExecution('DEBUG', 'divideBItem.length', divideBItem.length);
		nlapiLogExecution('DEBUG', 'divideCItem', divideCItem);
		nlapiLogExecution('DEBUG', 'divideCItem.length', divideCItem.length);
		//(4 + 2)* 12 = 76
		for (var i = 0 ; i < 12; i += 1) {
			var thisDate = new Date(start);
			thisDate.setMonth(thisDate.getMonth() + i);
			var temp = [].concat(divideAItem[i % divideAItem.length]).concat(divideBItem[i % divideBItem.length]).concat(divideCItem[i % divideCItem.length]);
			output.push(temp);
			var cycleSchedule = nlapiCopyRecord('customrecord_es_cycle_schedule', nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_cycle_schedule_templat'), {'recordmode':'dynamic'} );
			cycleSchedule.setFieldValue('custrecord_cs_start_date', nlapiDateToString(thisDate));
			cycleSchedule.setFieldValue('custrecord_cs_next_run_date', null);
			cycleSchedule.setFieldValues('custrecord_cs_items', temp);
			cycleSchedule.setFieldValue('custrecord_cs_location', locations[loc]);
			cycleSchedule.setFieldValue('name', templateName + ' - ' + locations[loc] + ' - ' + (i + 1));
			var cycleScheduleId = nlapiSubmitRecord(cycleSchedule, false, true);
			nlapiLogExecution('AUDIT', 'Generate Cycle Schedule', cycleScheduleId);
			nlapiLogExecution('DEBUG', 'Items-' + locations[loc] + ' - ' + (i + 1), temp);
			nlapiLogExecution('DEBUG', 'temp.length', temp.length);
		}
	}
}
/**
 * 
 * @param {string} type 
 * @param {array} filters 
 */
function getAllItems(type, filters) {
	var output = [];
	var index = 0;
	var loop = true;
	var searchSet = nlapiCreateSearch(type, filters).runSearch();
	while (loop) {
		loop = false;
		var results = searchSet.getResults(index * 1000, (index + 1) * 1000);
		for (var i = 0; results && i < results.length; i += 1) {
			output.push(results[i].getId());
		}
		if (results && results.length >= 1000) {
			loop = true;
			index += 1;
		}
	}
	return output;
}
/**
 * 
 * @param {*} items[]
 * @param {number} frequency
 * @param {number} minimun 
 */
function devideby(items, frequency, minimun) {
	var months = parseInt(12 / frequency);
	var monthNumber = Math.max(Math.ceil(items.length / months), minimun);
	var output = [];
	var index = 0;
	for (var i = 0; i < months; i += 1) {
		var temp = [];
		for (var j = 0; j < monthNumber && j + index < items.length; j += 1){
			temp.push(items[j + index]);
		}
		index += monthNumber;
		output.push(temp);
	}
	return output;
}