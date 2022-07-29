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
 * GeneralDescription: This script is designed to source a Item's Quantity
 * Committed for a specific location and place it on the Item Receipt. Author:
 * Darren Hill CreationDate: 20120918 LastModificationDescription: Completed
 * testing LastModificationAuthor: Darren Hill LastModificationDate: 20120918
 */

function TJINC_BeforeLoad(s_type, o_form) {
	"use strict";
	var o_filters, o_columns, o_searchresults, saveprint, print, printitemlabels, script, o_lookup_fields, o_lookup_columns, popUpScript, popUpField, i_recordId;
	i_recordid = nlapiGetRecordId();
	if(i_recordid !== undefined && i_recordid !== null && !isNaN(parseInt(i_recordid, 10))) {
		o_filters = [];
		o_filters.push(new nlobjSearchFilter("custrecord_echosign_parent_record", "custrecord_echosign_agreement", "is", [nlapiGetRecordId()]));
		o_filters.push(new nlobjSearchFilter("custrecord_echosign_parent_type", "custrecord_echosign_agreement", "is", ["itemfulfillment"]));
		o_filters.push(new nlobjSearchFilter("custrecord_echosign_sign_type", "custrecord_echosign_agreement", "anyof", [2]));
		o_columns = [];
		o_columns.push(new nlobjSearchColumn("id"));
		o_columns.push(new nlobjSearchColumn("custrecord_echosign_file"));
		o_columns.push(new nlobjSearchColumn("custrecord_echosign_file_size"));
		o_searchresults = nlapiSearchRecord("customrecord_echosign_document", null, o_filters, o_columns);
		// This ItemFulfillment has an agreement, swap out the print button for a
		// new one.
		if (o_searchresults !== null && o_searchresults.length > 0) {
			// Get the button
			saveprint = o_form.getButton('saveprint');
			// Make sure that the button is not null
			if (saveprint !== null) {
				// Hide the button in the UI
				saveprint.setVisible(false);
			}
			// Get the button
			print = o_form.getButton('print');
			// Make sure that the button is not null
			if (print !== null) {
				// Hide the button in the UI
				print.setVisible(false);
			}
			// Get the button
			printitemlabels = o_form.getButton('printitemlabels');
			// Make sure that the button is not null
			if (printitemlabels !== null) {
				// Hide the button in the UI
				printitemlabels.setVisible(false);
			}

			o_lookup_fields = ['url'];
			o_lookup_columns = nlapiLookupField('file', o_searchresults[0].getValue(o_columns[1]), o_lookup_fields);

			popUpScript = '';
			popUpScript += '<SCRIPT language="JavaScript" type="text/javascript">';
			popUpScript += 'function PopUp(){ window.open("' + o_lookup_columns.url + '");return false; }';
			popUpScript += '</SCRIPT>';

			popUpField = o_form.addField('custpage_popupfield', 'inlinehtml', 'hideeditbutton', null, null);
			popUpField.setDefaultValue(popUpScript);

			o_form.addButton('custpage_custombutton', 'Packing Slip', 'PopUp()');
		}
	}
}
