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
 * @module User Event Script
 * @description This User Event script is used to Trigger Schedule Script
 */
/**
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventAfterSubmit(type) {
	if (type == 'edit' || type == 'xedit') {
		if (nlapiGetOldRecord().getFieldValue('custrecord_ic_status') != 9 && nlapiGetNewRecord().getFieldValue('custrecord_ic_status') == 9) {
			nlapiScheduleScript('customscript_es_ss_update_last_count', null, {custscript_es_pim_inventory_cycle: nlapiGetRecordId()});
		}
	}
}