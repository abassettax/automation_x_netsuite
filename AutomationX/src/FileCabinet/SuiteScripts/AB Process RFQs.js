/**
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/log", "N/record", "N/render", "N/https", "N/search", "N/format", "N/runtime", "N/ui/serverWidget", "N/email"],
    function (require, exports, log, record, render, https, search, format, runtime, serverWidget, email) {
        Object.defineProperty(exports, "__esModule", { value: true });
        
        var FORM = {
            title: 'Process RFQs'
        };

        var ITEMSUBLIST = {
            id: 'custpagesublist',
            label: 'RFQs'
        };

        exports.onRequest = function (context) {
            var requestRouter = {};
            requestRouter[https.Method.GET] = getHandler;
            requestRouter[https.Method.POST] = postHandler;
            var form = requestRouter[context.request.method] ? requestRouter[context.request.method](context) : null;
            if (form !== null) {
                context.response.writePage(form);
            }
        };

        var getHandler = function (context) {
            var vendorId = -1;
            if (context.request.parameters.vendor) {
                vendorId = +context.request.parameters.vendor;
            }
            
            var rfqResults = getRFQs(vendorId);

            var form = serverWidget.createForm({ title: FORM.title });

            var poList = form.addSublist({ id: ITEMSUBLIST.id, label: rfqResults.length + " " + ITEMSUBLIST.label, type: serverWidget.SublistType.LIST });
            poList.addMarkAllButtons();
            REQUEST_FIELDS.forEach(function (stockRequestField) {
                poList.addField(stockRequestField.config).updateDisplayType({ displayType: stockRequestField.displayType });
            });

            FORM_BUTTONS.forEach(function (formButton) {
                form.addButton(formButton);
            });
            
            form.addField({ id: 'custpage_filtervendorid', type: serverWidget.FieldType.SELECT, label: 'Filter By Vendor', source: 'vendor' });

            form.addSubmitButton({
                label: 'Email Vendors'
            });

            form.clientScriptModulePath = './AB Process RFQs CS.js';

            log.debug({
                title: 'rfqResults',
                details: JSON.stringify(rfqResults)
            });
            rfqResults.forEach(function (rfqResult, index) {
                poList.setSublistValue({ id: 'line', value: parseFloat(index + 1).toFixed(), line: index });
                poList.setSublistValue({ id: 'id', value: rfqResult.id, line: index });
                poList.setSublistValue({ id: 'idtext', value: rfqResult.idtext, line: index });
                poList.setSublistValue({ id: 'item', value: rfqResult.item, line: index });
                poList.setSublistValue({ id: 'qty', value: rfqResult.qty, line: index });         
                poList.setSublistValue({ id: 'vendor', value: rfqResult.vendor, line: index });
                if (rfqResult.vendoremail != '') {
                    poList.setSublistValue({ id: 'vendoremail', value: rfqResult.vendoremail, line: index });
                }
                poList.setSublistValue({ id: 'created', value: rfqResult.created, line: index });
                poList.setSublistValue({ id: 'deadline', value: rfqResult.deadline, line: index });
                if (rfqResult.notes != '') {
                    if (rfqResult.notes.length > 4000) {
                        rfqResult.notes = rfqResult.notes.substring(0, 3999);
                    }
                    poList.setSublistValue({ id: 'notes', value: rfqResult.notes, line: index });
                }
                poList.setSublistValue({ id: 'urgent', value: rfqResult.urgent, line: index });
            });
            return form;
        };

        var postHandler = function (context) {
            //get selected lines, group by email address. send email. for each, create a parent RFQ record and link back to all children. 
            var emails = [];
            var rfqsToEmail = [];
            for (var i = 0, lineCount = +context.request.getLineCount({ group: ITEMSUBLIST.id }); i < lineCount; i = i + 1) {
                //check if line is selected
                var process = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'process', line: i });
                if (process == 'T') {
                    var vendorEmail = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'vendoremail', line: i });
                    var rfqId = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'id', line: i });
                    var item = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'item', line: i });
                    var qty = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'qty', line: i });
                    var deadline = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'deadline', line: i });
                    var emailIndex = emails.indexOf(vendorEmail);
                    log.debug({
                        title: 'post emailIndex',
                        details: emailIndex
                    });
                    if (emailIndex == -1) {
                        emails.push(vendorEmail);
                        rfqsToEmail.push({
                            email: vendorEmail,
                            deadline: deadline,
                            items: [{
                                item: item,
                                qty: qty,
                                deadline: deadline
                            }],
                            items2: [item],
                            rfqs: [rfqId]
                        });
                    } else {
                        var currDeadline = rfqsToEmail[emailIndex].deadline;
                        var formattedDeadline = format.parse({
                            value: deadline,
                            type: format.Type.DATE
                        });
                        var formattedCurrDeadline = format.parse({
                            value: currDeadline,
                            type: format.Type.DATE
                        });
                        if (formattedDeadline < formattedCurrDeadline) {
                            rfqsToEmail[emailIndex].deadline = deadline;
                        }
                        var itemIndex = rfqsToEmail[emailIndex].items2.indexOf(item);
                        if (itemIndex == -1) {
                            rfqsToEmail[emailIndex].items.push({
                                item: item,
                                qty: qty,
                                deadline: deadline
                            });
                            rfqsToEmail[emailIndex].rfqs.push(rfqId);
                            rfqsToEmail[emailIndex].items2.push(item);
                        } else {
                            rfqsToEmail[emailIndex].items[itemIndex].qty = parseInt(rfqsToEmail[emailIndex].items[itemIndex].qty) + parseInt(qty);
                            var currDeadline2 = rfqsToEmail[emailIndex].items[itemIndex].deadline;
                            var formattedCurrDeadline2 = format.parse({
                                value: currDeadline2,
                                type: format.Type.DATE
                            });
                            if (formattedDeadline < formattedCurrDeadline2) {
                                rfqsToEmail[emailIndex].items[itemIndex].deadline = deadline;
                            }
                            rfqsToEmail[emailIndex].rfqs.push(rfqId);
                        }
                        
                    }
                }
            }
            log.debug({
                title: 'post rfqsToEmail',
                details: JSON.stringify(rfqsToEmail)
            });

            //create RFQ record, link back to children
            var userId = runtime.getCurrentUser().id;
                log.debug({
                    title: 'post userId',
                    details: userId
                });
            var rfqRecord = record.create({
                type: 'customrecord1507',
                isDynamic: true
            });
            rfqRecord.setValue({ fieldId: 'owner', value: userId });
            var rfqId = rfqRecord.save();
            for (var i = 0; i < rfqsToEmail.length; i = i + 1) {
                var rfqDetIds = rfqsToEmail[i].rfqs;
                for (var j = 0; j < rfqDetIds.length; j++) {
                    var rfqDetId = rfqDetIds[j];
                    record.submitFields({
                        type: 'customrecord1506',
                        id: rfqDetId,
                        values: {
                            custrecord370: 2,
                            custrecord360: rfqId
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields : true
                        }
                    });
                }
            }

            for (var i = 0; i < rfqsToEmail.length; i = i + 1) {
                var emailSubject = ' **Request for Quote** Automation-X Corporation: RFQ # ' + rfqId;
                log.debug({
                    title: 'post emailSubject',
                    details: emailSubject
                });

                var vendorEmail = rfqsToEmail[i].email;
                var deadline = rfqsToEmail[i].deadline;
                var itemData = rfqsToEmail[i].items;

                var emailBody = '<font size="2"><b><font color="#ff0000"></font></b></font><br /><br /><b>Automation-X Corporation: RFQ # '+rfqId+'</b><br /><br />';                   
                emailBody += '<font size="3">Please review the items below and reply to this email with quotes for each by <b>'+deadline+'</b> to verify this RFQ was received and processed. Please include quantity pricing and discounts if volume discounts are available.</font><br /><br />';
                
                for (var j = 0; j < itemData.length; j++) {
                    var item = itemData[j].item;
                    var qty = itemData[j].qty;
                    var deadline = itemData[j].deadline;
                    emailBody += '<p align="center"><font size="3"><font face="Calibri">Item Name: '+item+'<br />Quantity: '+qty+'<br />Deadline: '+deadline+'<br /><br /></font></font></p>';
                }

                emailBody += '<p align="center"><font size="3"><font face="Calibri"><b>Please reply directly to this email</b></font></font></p>';
                
                log.debug({
                    title: 'post emailBody',
                    details: emailBody
                });
                //author 50623 is rfq@automation-x.com
                // vendorEmail = 'andrew.bassett@automation-x.com'
                email.send({
                    author: 50623,
                    recipients: vendorEmail,
                    subject: emailSubject,
                    body: emailBody
                });
                log.debug({
                    title: 'post email sent',
                    details: rfqId
                });
            }

            // Reload the current page.
            context.response.sendRedirect({
                type: https.RedirectType.SUITELET,
                identifier: runtime.getCurrentScript().id,
                id: runtime.getCurrentScript().deploymentId
            });
            return null;
        };

        
        // region Form Elements
        var FORM_BUTTONS = [];
        // FORM_BUTTONS.push({ id: 'custpage_clear_btn', label: 'Clear All Lines', functionName: 'clearalllines' });
        FORM_BUTTONS.push({ id: 'custpage_reset', label: 'Reset', functionName: 'reset' });

        // sublist fields
        var REQUEST_FIELDS = [];
        REQUEST_FIELDS.push({ value: '', config: { id: 'line', type: serverWidget.FieldType.TEXT, label: 'Line ID'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'process', type: serverWidget.FieldType.CHECKBOX, label: 'Email'}, displayType: serverWidget.FieldDisplayType.ENTRY });
        REQUEST_FIELDS.push({ value: '', config: { id: 'id', type: serverWidget.FieldType.SELECT, label: 'RFQ Detail', source: 'customrecord1506' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        REQUEST_FIELDS.push({ value: '', config: { id: 'idtext', type: serverWidget.FieldType.TEXT, label: 'RFQ Detail', source: 'customrecord1506' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'item', type: serverWidget.FieldType.TEXT, label: 'Item', source: 'item' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'qty', type: serverWidget.FieldType.INTEGER, label: 'Qty' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'vendor', type: serverWidget.FieldType.TEXT, label: 'Vendor', source: 'vendor' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'vendoremail', type: serverWidget.FieldType.TEXTAREA, label: 'Vendor Email' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        REQUEST_FIELDS.push({ value: '', config: { id: 'created', type: serverWidget.FieldType.TEXT, label: 'Date Created' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'deadline', type: serverWidget.FieldType.TEXT, label: 'Deadline' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'notes', type: serverWidget.FieldType.TEXTAREA, label: 'Notes' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'urgent', type: serverWidget.FieldType.CHECKBOX, label: 'Urgent'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        
        var getRFQs = function (vendorId) {
            var searchId = 'customsearch7545'
            var searchObj = search.load({
                type: 'customrecord1506',
                id: searchId
            });
            if (vendorId != -1) {
                var vendorFilter = search.createFilter({
                    name: 'custrecord362',
                    operator: search.Operator.ANYOF,
                    values: vendorId
                });
                searchObj.filters.push(vendorFilter)
            }
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var rfqResults = [];
            for (var i = 0; i < allResults.length; i++) {
                var rfqId = allResults[i].getText(allResults[i].columns[0]);
                var item = allResults[i].getText(allResults[i].columns[1]);
                var qty = allResults[i].getValue(allResults[i].columns[2]);
                var vendor = allResults[i].getText(allResults[i].columns[3]);
                var vendorEmail = allResults[i].getValue(allResults[i].columns[4]);
                var dateCreated = allResults[i].getValue(allResults[i].columns[5]);
                var deadline = allResults[i].getValue(allResults[i].columns[6]);
                var notes = allResults[i].getValue(allResults[i].columns[7]);
                var urgent = allResults[i].getValue(allResults[i].columns[8]) ? 'T' : 'F';
                rfqResults.push({
                    id: rfqId,
                    idtext: rfqId,
                    item: item,
                    qty: qty,
                    vendor: vendor,
                    vendoremail: vendorEmail,
                    created: dateCreated,
                    deadline: deadline,
                    notes: notes,
                    urgent: urgent
                });
            }
            return rfqResults;
        };

        var getAllResults = function (searchObj) {
            try {
                var searchResultsArr = new Array();
                var startCount = 0;

                do {
                    var searchResults = searchObj.run().getRange({
                        start: startCount,
                        end: startCount + 1000
                    });
                    startCount = startCount + 1000;
                    for (var i = 0; i < searchResults.length; i++) {
                        searchResultsArr.push(searchResults[i]);
                    }
                } while (searchResults.length >= 1000)
                return searchResultsArr;
            } catch (e) {
                log.error('Error in getAllResults',e)
            }
        };
        
        // var findWithAttr = function findWithAttr(array, attr, value) {
        //     for(var i = 0; i < array.length; i += 1) {
        //         if(array[i][attr] === value) {
        //             return i;
        //         }
        //     }
        //     return -1;
        // };
    });