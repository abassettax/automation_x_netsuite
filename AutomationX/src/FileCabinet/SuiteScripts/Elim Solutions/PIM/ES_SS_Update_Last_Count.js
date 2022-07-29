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
 * @date 16 Sep 2019
 * @version 1.0.0.0
 * @module Scheduled Script
 * @description This Scheduled script is used to Set last Count Date
 */
/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	var icRecordId = nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_inventory_cycle');
	//log.debug({title: 'icRecordId', details: icRecordId});
	if (icRecordId) {
		var icRecord = nlapiLoadRecord('customrecord_es_inv_cycle', nlapiGetContext().getSetting('SCRIPT', 'custscript_es_pim_inventory_cycle'));
		if (icRecord.getFieldValue('custrecord_ic_status') == 9) { //7 approvedx processed
			var items = icRecord.getFieldValues('custrecord_ic_items');
			for (var i = 0; i < items.length; i += 1) {
				if (nlapiGetContext().getRemainingUsage() < 100) {
					nlapiYieldScript();
				}
				var results = nlapiSearchRecord('customrecord_es_pi_last_count_date', null, [['custrecord_pim_item', 'anyof', items[i]], 'and', ['custrecord_pim_location', 'anyof', icRecord.getFieldValue('custrecord_ic_location')]]);
				var lastDateRecord;
				if (results && results[0]) {
					lastDateRecord = nlapiLoadRecord('customrecord_es_pi_last_count_date', results[0].getId());
				} else {
					lastDateRecord = nlapiCreateRecord('customrecord_es_pi_last_count_date');
					lastDateRecord.setFieldValue('custrecord_pim_item', items[i]);
					lastDateRecord.setFieldValue('custrecord_pim_location', icRecord.getFieldValue('custrecord_ic_location'));
				}
				lastDateRecord.setFieldValue('custrecord_pim_lastcountdate', nlapiDateToString(new Date()));
				nlapiSubmitRecord(lastDateRecord);
				//log.debug({title: 'lastDateRecord updated', details: new Date()});
			}
		}
	}
}