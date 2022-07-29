/**  
 * @NApiVersion 2.0  
 * @NScriptType Suitelet  
 */

define(['N/ui/serverWidget', 'N/record', 'N/email'],
	function (serverWidget, record, email) {

		function onRequest(context) {
			if (context.request.method == 'GET') {
				var form = serverWidget.createForm({
					title: 'Automation X',
				});

				var purchaseOrderId = context.request.parameters.po;
				var purchaseOrder = record.load({
					type: record.Type.PURCHASE_ORDER,
					id: purchaseOrderId
				});

				var docgroup = form.addFieldGroup({ id: 'docgroup', label: 'Purchase Order : ' + purchaseOrder.getValue('tranid') });
				docgroup.isSingleColumn = true;

				var vendor = record.load({
					type: record.Type.VENDOR,
					id: purchaseOrder.getValue('entity')
				});

				log.debug('ShipDate', purchaseOrder.getValue('shipdate'));

				var htmlHeadera = form.addField({
					id: 'custpage_head',
					type: serverWidget.FieldType.INLINEHTML,
					label: ' ',
					container: 'docgroup'
				}).defaultValue = "<img src='https://422523.app.netsuite.com/core/media/media.nl?id=47664&c=422523&h=d8894ae58301c49f67e8'/>";

				var htmlHeader = form.addField({
					id: 'custpage_header',
					type: serverWidget.FieldType.INLINEHTML,
					label: ' ',
					container: 'docgroup'
				}).defaultValue = "<link rel='stylesheet' src='https://www.fredpope.com/css/styles.css'><p style='font-size:20px'>Please help us by updating the status of our order with you.</p><br><br>";

				var pricingSelect = form.addField({
					id: 'pricing_acknlowledged',
					type: serverWidget.FieldType.SELECT,
					label: 'Confirmed Pricing',
					container: 'docgroup'
				});

				pricingSelect.addSelectOption({
					value: '',
					text: ''
				});

				pricingSelect.addSelectOption({
					value: 'Yes',
					text: 'Yes'
				});

				pricingSelect.addSelectOption({
					value: 'No',
					text: 'No'
				});

				var acknowledgementdate = form.addField({
					id: 'acknowledgement_date',
					type: serverWidget.FieldType.DATE,
					label: 'Acknowledgement Date',
					value: purchaseOrder.getValue('shipdate'),
					container: 'docgroup'
				});

				var scheduledShipDate = form.addField({
					id: 'scheduled_ship_date',
					type: serverWidget.FieldType.DATE,
					label: 'Scheduled Shipment Date',
					container: 'docgroup'
				});

				var document = form.addField({
					id: 'file_upload',
					type: serverWidget.FieldType.FILE,
					label: 'Document',
				});

				var actualShipDate = form.addField({
					id: 'actual_ship_date',
					type: serverWidget.FieldType.DATE,
					label: 'Actual Shipment Date',
					value: purchaseOrder.getValue('shipdate'),
					container: 'docgroup'
				});

				scheduledShipDate.defaultValue = purchaseOrder.getValue('shipdate');

				var tracking = form.addField({
					id: 'tracking',
					type: serverWidget.FieldType.TEXT,
					label: 'Tracking Number',
					value: purchaseOrderId,
					container: 'docgroup'
				});

				var purchaseOrderReference = form.addField({
					id: 'po',
					type: serverWidget.FieldType.TEXT,
					label: 'PO NUMBER',
					container: 'docgroup'
				});

				var sumbitterEmail = form.addField({
					id: 'sumbitter_email',
					type: serverWidget.FieldType.EMAIL,
					label: 'Your Email',
					container: 'docgroup'
				});

				sumbitterEmail.defaultValue = vendor.getValue('email');

				var comments = form.addField({
					id: 'comments',
					type: serverWidget.FieldType.TEXTAREA,
					label: 'Comments',
					container: 'docgroup'
				});

				// comments.defaultValue = purchaseOrder.getValue('custbody34'); 
				purchaseOrderReference.defaultValue = purchaseOrderId;
				purchaseOrderReference.updateDisplayType({
					displayType: serverWidget.FieldDisplayType.HIDDEN
				});

				form.addSubmitButton({
					label: 'Submit',
					container: 'docgroup'

				});

				context.response.writePage(form);
			} else if (context.request.method == 'POST') {

				log.debug('Request', context.request.parameters);

				var request = context.request;

				var purchaseOrderId = context.request.parameters.po;
				var purchaseOrder = record.load({
					type: record.Type.PURCHASE_ORDER,
					id: purchaseOrderId
				});

				//var email = 

				var existingComments = purchaseOrder.getValue('custbody34') + '\n';

				purchaseOrder.setValue('custbody34', request.parameters.comments);
				var existingTrack = purchaseOrder.getValue('custbody197');
				purchaseOrder.setValue('custbody197', existingTrack + ' ' + request.parameters.tracking);

				var submitterVendor = purchaseOrder.getValue('entity');
				var subVendor = record.load({
					type: record.Type.VENDOR,
					id: submitterVendor
				});

				var statusRecord = record.create({
					type: 'customrecord_purchase_order_status',
					isDynamic: true
				})

				// statusRecord.setValue('custrecord_postatus_submitter_email', request.parameters.submitter_email);

				// log.console('request.parameters.acknowledgement_date');

				statusRecord.setValue('custrecord_postatus_purchase_order', purchaseOrderId);
				statusRecord.setValue('custrecord_postatus_tracking', request.parameters.tracking);
				statusRecord.setValue('custrecord_postatus_pricing_acknowledged', request.parameters.pricing_acknowledged);
				statusRecord.setValue('custrecord_postatus_comments', request.parameters.comments);
				statusRecord.setValue('custrecord_po_status_submitter_email', request.parameters.submitter_email);

				if (request.parameters.acknowledgement_date != '') {
					var preAckDate = request.parameters.acknowledgement_date;
					var parts = preAckDate.split('/');
					var month = parseInt(parts[0]) - 1;
					var day = parts[1];
					var year = parseInt(parts[2]);
					var ackDate = new Date(year, month, day);
					statusRecord.setValue('custrecord_postatus_acknowledgement_date', ackDate);
					purchaseOrder.setValue('custbody6', 8)
				}

				if (request.parameters.scheduled_ship_date != '') {
					var spreAckDate = request.parameters.scheduled_ship_date;
					var sparts = spreAckDate.split('/');
					var smonth = parseInt(sparts[0]) - 1;
					var sday = sparts[1];
					var syear = parseInt(sparts[2]);
					var sackDate = new Date(syear, smonth, sday);
					statusRecord.setValue('custrecord_postatus_scheduled_shipdate', sackDate);
					purchaseOrder.setValue('shipdate', sackDate);
					purchaseOrder.setValue('custbody6', 2)
				}

				if (request.parameters.actual_ship_date != '') {
					var apreAckDate = request.parameters.actual_ship_date;
					var aparts = apreAckDate.split('/');
					var amonth = parseInt(aparts[0]) - 1;
					var aday = aparts[1];
					var ayear = parseInt(aparts[2]);
					var aackDate = new Date(ayear, amonth, aday);
					statusRecord.setValue('custrecord_postatus_ship_date', aackDate);
					purchaseOrder.setValue('shipdate', aackDate);
					purchaseOrder.setValue('custbody6', 3)
				}

				var now = new Date();
				var hours = now.getHours();
				var day = now.getDate();
				var month = now.getMonth();
				var year = now.getFullYear();

				var next_date = new Date(year, month, day);
				next_date.setDate(next_date.getDate() + 2);
				purchaseOrder.setValue('custbody71', next_date);
				purchaseOrder.save();

				if (request.files['file_upload']) {
					var file1 = request.files['file_upload'];
					file1.folder = 5746838;
					var fileId = file1.save();

					statusRecord.setValue('custrecord_postatus_file', fileId);
					record.attach({
						record: {
							type: 'file',
							id: fileId
						},
						to: {
							type: record.Type.PURCHASE_ORDER,
							id: purchaseOrderId
						}
					});
				}

				// statusRecord.setValue('custrecord_postatus_file', );

				statusRecord.save();

				try {
					email.send({
						// recipients: vendor.getValue('email'),
						recipients: "fred@fredpope.com",
						author: 38922,
						subject: "PO Updated",
						body: purchaseOrderId,
					});
					log.debug("Email Send Complete", purchaseOrderId);
				} catch (e) {
					log.debug("Email Send Error", e);
				}

				var respform = serverWidget.createForm({
					title: 'Automation X',
				});

				var docgroup = respform.addFieldGroup({ id: 'docgroup', label: 'Purchase Order Status Information' });
				docgroup.isSingleColumn = true;

				var htmlHeadera = respform.addField({
					id: 'custpage_head',
					type: serverWidget.FieldType.INLINEHTML,
					label: ' ',
					container: 'docgroup'
				}).defaultValue = "<img src='https://422523.app.netsuite.com/core/media/media.nl?id=47664&c=422523&h=d8894ae58301c49f67e8'/>";

				var htmlHeader = respform.addField({
					id: 'custpage_header',
					type: serverWidget.FieldType.INLINEHTML,
					label: ' ',
					container: 'docgroup'
				}).defaultValue = "<link rel='stylesheet' src='https://www.fredpope.com/css/styles.css'><p style='font-size:20px'>Thank you for your help!</p><br><br>";

				context.response.writePage(respform);

			}

		}
		return {
			onRequest: onRequest
		}
	}); 