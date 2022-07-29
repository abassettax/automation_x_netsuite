/**
 * Company           Fred Pope
 * Description       Scheduled Script that will 
 * Spec              
 * @NApiVersion 2.x
 * @NScriptType scheduledscript
 **/

define(["require", "exports", "N/https", "N/record", "N/search", "N/error", "N/email", "N/render", "N/file", "N/runtime", "./moment"],
	function (require, exports, https, record, search, error, email, render, file, runtime, moment) {
		"use strict";
		return {
			execute: function (context) {

				// The Purchase Order

				var poSearch = search.load({
					type: record.Type.PURCHASE_ORDER,
					id: "customsearch6182"
				})

				var poSearchResults = poSearch.run().getRange({
					start: 0,
					end: 200
				});
				// Varible to set if email needs to be sent. 
				var toSend = 0;

				for (var i = 0; i < poSearchResults.length; i++) {

					var purchaseOrderId = parseInt(poSearchResults[i].id);

					log.debug('Purchase Order', purchaseOrderId);

					// Whose sending it
					var empId = 37203;

					var purchaseOrder = record.load({
						type: record.Type.PURCHASE_ORDER,
						id: purchaseOrderId
					});

					var recipientEmail = purchaseOrder.getValue('custbody_po_follow_up');

					var vendor = record.load({
						type: record.Type.VENDOR,
						id: purchaseOrder.getValue('entity')
					});

					var employeeSender = record.load({
						type: record.Type.EMPLOYEE,
						id: 38922
					})


					var nextDate = new Date(purchaseOrder.getValue('custbody71'));

					log.debug("NextDate", nextDate);

					var moDate = '';

					if (nextDate.getDay() == 4) { //if day of week is thursday, set next action to Tuesday
						moDate = moment(nextDate).add(5, 'days').format("M/D/YYYY")
					} else if (nextDate.getDay() == 5) { //if day of week if Friday, set next action to Tuesday
						moDate = moment(nextDate).add(4, 'days').format("M/D/YYYY")
					}
					else { //Set next action two days out
						moDate = moment(nextDate).add(2, 'days').format("M/D/YYYY")
					}

					/*   
					 * 
		   * Old Script without weekend offset                                                   	    		
					 var moDate = moment(nextDate).add(2,'days').format("M/D/YYYY");
					 log.debug("New Next Date", moDate);
					 
					 */

					log.debug("New Next Date", moDate);

					var parts = moDate.split('/');
					var month = parseInt(parts[0]) - 1;
					var day = parts[1];
					var year = parseInt(parts[2]);
					log.debug("Year", year);

					var new_date = new Date(year, month, day);
					log.debug("New Date", new_date);
					purchaseOrder.setValue('custbody71', new_date);

					var releaseNotes = purchaseOrder.getValue('custbody45');
					releaseNotes = releaseNotes + '\n Emailed Vendor';

					purchaseOrder.setValue('custbody45', releaseNotes);

					purchaseOrder.save();
					// log.debug("NewNextDate", newNextDate);

					// Confirmed Status purchaseOrder.getValue('custbody6') == 2

					var releaseNoteComment = '';

					// email template 569
					// Status Unconfirmed

					var poMatStatus = purchaseOrder.getValue('custbody6');

					toSend = 0;
					switch (poMatStatus) {

						// Status Unconfirmed
						case '1':
							try {
								var mergeResult = render.mergeEmail({
									templateId: 575,
									entity: employeeSender,
									recipient: employeeSender,
									transactionId: purchaseOrderId
								});
							} catch (e) {
								log.debug("Merge Exception", e)
							}
							releaseNoteComment = "Order Confirmation Email Sent";
							toSend = 1;
							break;

						// Status Confirmed
						case '2':
							try {
								var mergeResult = render.mergeEmail({
									templateId: 576,
									entity: employeeSender,
									recipient: employeeSender,
									transactionId: purchaseOrderId
								});
							} catch (e) {
								log.debug("Merge Exception", e)
							}
							releaseNoteComment = "Order Ship Date Request Email Sent";
							toSend = 1;
							break;

						// Status Confirmed Ship Dates Pending
						case '8':
							// email template 569
							try {
								var mergeResult = render.mergeEmail({
									templateId: 576,
									entity: employeeSender,
									recipient: employeeSender,
									transactionId: purchaseOrderId
								});
							} catch (e) {
								log.debug("Merge Exception", e)
							}
							releaseNoteComment = "Order Ship Date Request Email Sent";
							toSend = 1;
							log.debug('Purchase Order', purchaseOrderId + " Line 62");
							break;
						// Status Inbound
						case '3':
							// Check to see if PO has been received. If the PO has been received. Set to status to 34. 




							// If the PO has tracking, track the order and set to Scheduled. 
							break;
					}

					if (toSend == 1) {
						// log.debug("MergeResult", myMergeResult);
						try {
							var transactionPdfObject = render.transaction({
								entityId: purchaseOrderId,
								printMode: render.PrintMode.PDF
							});
							log.debug("PurchaseOrderRendered", purchaseOrderId)
						}
						catch (ee) {
							log.debug("Render Exception", ee)
						}

						var emailSender = empId; //purchaseOrder.getValue('employee');
						log.debug("Email Sender", emailSender);

						// TODO: If the employee is not defined should we get deduce it from the from email address?

						var emailSubject = mergeResult.subject;
						var emailBody = mergeResult.body;

						try {
							email.send({
								// recipients: vendor.getValue('email'),
								recipients: vendor.getValue('email'),
								//cc: ['fred@fredpope.com', 'cori.gianniny@automation-x.com'],
								replyTo: 'purchasing@automation-x.com',
								author: emailSender,
								subject: emailSubject,
								body: emailBody,
								attachments: [transactionPdfObject]
							});
							// Set the Release Notes	
							var releaseNote = record.create({
								type: 'customrecord_mgn_po_release_notes',
								isDynamic: true
							});

							releaseNote.setValue('custrecord_release_notes_purchase_order', purchaseOrderId);
							releaseNote.setValue('custrecord_release_notes_type', 2)
							releaseNote.setValue('custrecord_release_notes_comments', releaseNoteComment);
							releaseNote.save();

							log.debug("Email Send Complete", purchaseOrderId);
						} catch (e) {
							log.debug("Email Send Error", e);
						}
					}
				}
				log.debug("Script Status", "Completed");

				return true;
			}
		}
	});