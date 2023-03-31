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
            title: 'Purchase Order Communication'
        };

        var ITEMSUBLIST = {
            id: 'custpagesublist',
            label: 'Purchase Orders'
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
            var clearAll = false, locationId = -1, poCommType = 1;
            if (context.request.parameters.clearAll) {
                clearAll = context.request.parameters.clearAll === 'T';
            }
            if (context.request.parameters.locationFilter) {
                locationId = +context.request.parameters.locationFilter;
            }
            if (context.request.parameters.type) {
                poCommType = +context.request.parameters.type;
            }
            if (poCommType == '1') {
                var purchOrders = getUntransmittedPos(locationId);
            } else if (poCommType == '2') {
                var purchOrders = getUnconfirmedPos(locationId);
            } else if (poCommType == '3') {
                var purchOrders = getPastDuePos(locationId);
            }

            var form = serverWidget.createForm({ title: FORM.title });

            var poList = form.addSublist({ id: ITEMSUBLIST.id, label: purchOrders.length + " " + ITEMSUBLIST.label, type: serverWidget.SublistType.LIST });
            poList.addMarkAllButtons();
            REQUEST_FIELDS.forEach(function (stockRequestField) {
                poList.addField(stockRequestField.config).updateDisplayType({ displayType: stockRequestField.displayType });
            });

            FORM_BUTTONS.forEach(function (formButton) {
                form.addButton(formButton);
            });

            var poCommTypeFld = form.addField({ id: 'custpage_pocommtype', type: serverWidget.FieldType.SELECT, label: 'PO Email Type', });
            poCommTypeFld.addSelectOption({
                value: '1',
                text: 'Untransmitted'
            });
            poCommTypeFld.addSelectOption({
                value: '2',
                text: 'Unconfirmed'
            });
            poCommTypeFld.addSelectOption({
                value: '3',
                text: 'Past Due'
            });
            
            form.addField({ id: 'custpage_filterlocationid', type: serverWidget.FieldType.SELECT, label: 'Filter By Location', source: 'location' });

            form.addSubmitButton({
                label: 'Email Vendors'
            });

            form.clientScriptModulePath = './AX PO Communication SU Client.js';

            log.debug({
                title: 'purchOrders',
                details: JSON.stringify(purchOrders)
            });
            purchOrders.forEach(function (purchOrder, index) {
                poList.setSublistValue({ id: 'line', value: parseFloat(index + 1).toFixed(), line: index });
                poList.setSublistValue({ id: 'id', value: purchOrder.id, line: index });
                poList.setSublistValue({ id: 'tranid', value: purchOrder.tranid, line: index });
                if (purchOrder.lastemail != '') {
                    poList.setSublistValue({ id: 'lastemail', value: purchOrder.lastemail, line: index });
                }                
                poList.setSublistValue({ id: 'vendor', value: purchOrder.vendor, line: index });
                if (purchOrder.vendoremail != '') {
                    poList.setSublistValue({ id: 'vendoremail', value: purchOrder.vendoremail, line: index });
                }
                poList.setSublistValue({ id: 'location', value: purchOrder.location, line: index });
                // poList.setSublistValue({ id: 'status', value: purchOrder.status, line: index });
                poList.setSublistValue({ id: 'matstatus', value: purchOrder.matstatus, line: index });
                // poList.setSublistValue({ id: 'created', value: purchOrder.created, line: index });
                poList.setSublistValue({ id: 'date', value: purchOrder.date, line: index });
                if (purchOrder.shipdate != '') {
                    poList.setSublistValue({ id: 'shipdate', value: purchOrder.shipdate, line: index });
                }
                if (purchOrder.nextaction != '') {
                    poList.setSublistValue({ id: 'nextaction', value: purchOrder.nextaction, line: index });
                }
                if (purchOrder.notes != '') {
                    if (purchOrder.notes.length > 4000) {
                        purchOrder.notes = purchOrder.notes.substring(0, 3999);
                    }
                    poList.setSublistValue({ id: 'notes', value: purchOrder.notes, line: index });
                }
                poList.setSublistValue({ id: 'expedite', value: purchOrder.expedite, line: index });
                poList.setSublistValue({ id: 'dropship', value: purchOrder.dropship, line: index });
                poList.setSublistValue({ id: 'blanket', value: purchOrder.blanket, line: index });
                poList.setSublistValue({ id: 'restock', value: purchOrder.restock, line: index });
                poList.setSublistValue({ id: 'willcall', value: purchOrder.willcall, line: index });
                // if (purchOrder.related != '') {
                //     poList.setSublistValue({ id: 'related', value: purchOrder.related, line: index });
                // }
            });
            return form;
        };

        var postHandler = function (context) {
            var posToEmail = [];
            var poCommType = context.request.parameters.custpage_pocommtype;
            log.debug({
                title: 'post poCommType',
                details: poCommType
            });
            var userObj = runtime.getCurrentUser();
            var userName = userObj.name;
            var userId = userObj.id;
            for (var i = 0, lineCount = +context.request.getLineCount({ group: ITEMSUBLIST.id }); i < lineCount; i = i + 1) {
                //check if line is selected
                var process = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'process', line: i });
                if (process == 'T') {
                    var vendorEmail = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'vendoremail', line: i });
                    var poId = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'id', line: i });
                    var tranId = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'tranid', line: i });
                    
                    //send email
                    var poFile = render.transaction({
                        entityId: parseInt(poId),
                        printMode: render.PrintMode.PDF,
                        inCustLocale: true
                    });
                    poFile.name = tranId + '.pdf';
                    
                    var emailBody = '<font size="2"><b><font color="#ff0000"><span style="mso-spacerun: yes">***PLEASE NOTE THE SHIP TO ADDRESS***</span></font></b></font><br /><br /><b>Automation-X Corporation: Purchase Order # '+tranId+'</b><br /><br />';                   
                    
                    if (poCommType == '1') {
                        //untransmitted
                        var emailSubject = ' **Confirm PO** Automation-X Corporation: Purchase Order # ' + tranId;
                        emailBody += '<font size="3">Please review the attached purchase order and reply to this email within <b>24 hours</b> to verify this purchase order was received and processed. Please include an expected ship date and/or tracking if available.</font><p><font size="3"><font face="Calibri"><span style="mso-spacerun: yes">';
                    } else if (poCommType == '2') {
                        //unconfirmed
                        var emailSubject = ' **Confirm PO Ship Date** Automation-X Corporation: Purchase Order # ' + tranId;
                        emailBody += '<font size="3">Please review the attached purchase order and reply to this email within <b>24 hours</b> to verify this purchase order was received and processed. Please include an expected ship date and/or tracking if available.</font><p><font size="3"><font face="Calibri"><span style="mso-spacerun: yes">';
                    } else if (poCommType == '3') {
                        //past due
                        var emailSubject = ' **PO Past Ship Date** Automation-X Corporation: Purchase Order # ' + tranId;
                        emailBody += '<font size="3">Please review the attached purchase order and reply to this email within <b>24 hours</b> to verify this purchase order was received and processed. It is past due according to the original ship date. Please include an expected ship date and/or tracking if available.</font><p><font size="3"><font face="Calibri"><span style="mso-spacerun: yes">';
                    }
                    emailBody += '<b>NOTE: If pricing on PO is not correct, do not ship product until you have received a revised PO.  Acceptance of this PO constitutes acceptance of listed pricing.</b></span></font></font></p><font size="3"><font face="Calibri"><font face="Arial" size="1"> </font></font></font><p align="center" class="MsoNormal" style="TEXT-ALIGN: center; MARGIN: 0in 0in 0pt"><b style="mso-bidi-font-weight: normal"><font size="3">Automation-X Shipping Terms:</font></span></b></p><p align="center"><font size="3"><font size="2"><b>Standard Warehouse Shipments:</b></font></font></p><p align="center" class="MsoNormal" style="text-align: center; margin: 0in 0in 0pt;"><font size="3"><font face="Calibri"><span style="font-family: "Garamond","serif";">Please ship all small package shipments via UPS Ground account #05R4X4.  </span></font></font></p><p align="center" class="MsoNormal" style="TEXT-ALIGN: center; MARGIN: 0in 0in 0pt"><font size="3"><font face="Calibri">For Freight shipments use FedEx Freight #653849990.  These shipping accounts can be used for anything that is shipping to one of our warehouse locations.<br /><br />Please send an order confirmation or report any discrepancies within 24 hours to <font color="#0000ff"><a href="mailto:purchasing@automation-x.com">purchasing@automation-x.com</a>. </font>Please include estimated ship dates. In the event of delays or back-orders please contact purchasing immediately.<br /><br />Please let us know if you have any questions.<br /><br />Have a great week!</span></font></font></p><font size="3"><font face="Calibri"> </font></font><p align="center"><font size="3"><font face="Calibri"><a href="mailto:purchasing@automation-x.com"><font color="#0000ff">purchasing@automation-x.com</font></a></span></font></font></p>';
                    log.debug({
                        title: 'post emailSubject',
                        details: emailSubject
                    });
                    log.debug({
                        title: 'post emailBody',
                        details: emailBody
                    });
                    // vendorEmail = 'andrew.bassett@automation-x.com'
                    // var cc = [];
                    var cc = ['purchasing@automation-x.com '];
                    email.send({
                        author: userId,
                        recipients: vendorEmail,
                        subject: emailSubject,
                        body: emailBody,
                        cc: cc,
                        attachments: [poFile],
                        relatedRecords: {
                            transactionId: parseInt(poId)
                        }
                    });
                    log.debug({
                        title: 'post email sent',
                        details: tranId
                    });

                    //update PO
                    var poFields = search.lookupFields({
                        type: search.Type.TRANSACTION,
                        id: poId,
                        columns: ['custbody45']
                    });
                    var currReleaseNotes = poFields.custbody45;
                    var now = new Date();
                    var dd = now.getDate();
                    var month = now.getMonth() + 1;
                    var y = now.getFullYear();
                    var transmissiondate = month + '/' + dd + '/' + y;
                    var nextAction = context.request.getSublistValue({ group: ITEMSUBLIST.id, name: 'nextaction', line: i });
                    if (nextAction == '') {
                        var nextactionday = now.getDay();
                        if (nextactionday == 4) { 
                            daystoadd = 5; 
                        } else if (nextactionday == 5) { 
                            daystoadd = 4; 
                        }
                        nextAction = nlapiAddDays(now, daystoadd);
                    }
                    var releasenotes = '';
                    if (poCommType == '1') {
                        if (currReleaseNotes == '') {
                            releasenotes = transmissiondate + ' Emailed to Vendor. ' + userName;
                        } else {
                            releasenotes = ExistingreleaseNotes + '</br>' + transmissiondate + ' Emailed to Vendor. ' + userName;
                        }
                    } else if (poCommType == '2') {
                        if (currReleaseNotes == '') {
                            releasenotes = transmissiondate + ' Emailed to Vendor for confirmation. ' + userName;
                        } else {
                            releasenotes = ExistingreleaseNotes + '</br>' + transmissiondate + ' Emailed to Vendor for confirmation. ' + userName;
                        }
                    } else if (poCommType == '3') {
                        if (currReleaseNotes == '') {
                            releasenotes = transmissiondate + ' Emailed to Vendor for ship dates. ' + userName;
                        } else {
                            releasenotes = ExistingreleaseNotes + '</br>' + transmissiondate + ' Emailed to Vendor for ship dates. ' + userName;
                        }
                    }
                    record.submitFields({
                        type: record.Type.PURCHASE_ORDER,
                        id: poId,
                        values: {
                            custbody45: releasenotes,
                            custbody71: nextAction,
                            custbody242: now
                        }
                    });
                }
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
        FORM_BUTTONS.push({ id: 'custpage_clear_btn', label: 'Clear All Lines', functionName: 'clearalllines' });
        FORM_BUTTONS.push({ id: 'custpage_reset', label: 'Reset', functionName: 'reset' });

        // sublist fields
        var REQUEST_FIELDS = [];
        REQUEST_FIELDS.push({ value: '', config: { id: 'line', type: serverWidget.FieldType.TEXT, label: 'Line ID'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'process', type: serverWidget.FieldType.CHECKBOX, label: 'Email'}, displayType: serverWidget.FieldDisplayType.ENTRY });
        REQUEST_FIELDS.push({ value: '', config: { id: 'id', type: serverWidget.FieldType.SELECT, label: 'Purchase Order', source: 'transaction' }, displayType: serverWidget.FieldDisplayType.HIDDEN });
        REQUEST_FIELDS.push({ value: '', config: { id: 'tranid', type: serverWidget.FieldType.TEXT, label: 'Tran ID' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'lastemail', type: serverWidget.FieldType.DATE, label: 'Last Email' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'vendor', type: serverWidget.FieldType.TEXT, label: 'Vendor', source: 'vendor' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'vendoremail', type: serverWidget.FieldType.TEXTAREA, label: 'Vendor Email' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        REQUEST_FIELDS.push({ value: '', config: { id: 'location', type: serverWidget.FieldType.TEXT, label: 'Location', source: 'location'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        // REQUEST_FIELDS.push({ value: '', config: { id: 'status', type: serverWidget.FieldType.TEXT, label: 'PO Status' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'matstatus', type: serverWidget.FieldType.TEXT, label: 'Material Status', source: 'customlist29' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        // REQUEST_FIELDS.push({ value: '', config: { id: 'created', type: serverWidget.FieldType.DATE, label: 'Date Created' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'date', type: serverWidget.FieldType.DATE, label: 'Date' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'shipdate', type: serverWidget.FieldType.DATE, label: 'Ship Date' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'nextaction', type: serverWidget.FieldType.DATE, label: 'Next Action' }, displayType: serverWidget.FieldDisplayType.ENTRY });
        REQUEST_FIELDS.push({ value: '', config: { id: 'notes', type: serverWidget.FieldType.TEXTAREA, label: 'Release Notes' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'expedite', type: serverWidget.FieldType.CHECKBOX, label: 'Expedite'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'dropship', type: serverWidget.FieldType.CHECKBOX, label: 'Drop Ship'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'blanket', type: serverWidget.FieldType.CHECKBOX, label: 'Blanket'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'restock', type: serverWidget.FieldType.CHECKBOX, label: 'Restock'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        REQUEST_FIELDS.push({ value: '', config: { id: 'willcall', type: serverWidget.FieldType.CHECKBOX, label: 'Will Call'}, displayType: serverWidget.FieldDisplayType.DISABLED });
        // REQUEST_FIELDS.push({ value: '', config: { id: 'related', type: serverWidget.FieldType.TEXT, label: 'Related Transactions' }, displayType: serverWidget.FieldDisplayType.DISABLED });
        
        var getUntransmittedPos = function (locationId) {
            var searchId = 'customsearch7533'
            var searchObj = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            if (locationId != -1) {
                var locFilter = search.createFilter({
                    name: 'location',
                    operator: search.Operator.ANYOF,
                    values: locationId
                });
                searchObj.filters.push(locFilter)
            }
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var purchOrders = [];
            for (var i = 0; i < allResults.length; i++) {
                var poId = allResults[i].getValue(allResults[i].columns[0]);
                var tranId = allResults[i].getValue(allResults[i].columns[1]);
                var vendor = allResults[i].getText(allResults[i].columns[2]);
                var vendorEmail = allResults[i].getValue(allResults[i].columns[3]);
                var location = allResults[i].getText(allResults[i].columns[4]);
                var status = allResults[i].getText(allResults[i].columns[5]);
                var materialStatus = allResults[i].getText(allResults[i].columns[6]);
                var dateCreated = allResults[i].getValue(allResults[i].columns[7]);
                var date = allResults[i].getValue(allResults[i].columns[8]);
                var shipDate = allResults[i].getValue(allResults[i].columns[9]);
                var nextAction = allResults[i].getValue(allResults[i].columns[10]);
                var releaseNotes = allResults[i].getValue(allResults[i].columns[11]);
                var expedite = allResults[i].getValue(allResults[i].columns[12]) ? 'T' : 'F';
                var dropShip = allResults[i].getValue(allResults[i].columns[13]) ? 'T' : 'F';
                var blanket = allResults[i].getValue(allResults[i].columns[14]) ? 'T' : 'F';
                var restock = allResults[i].getValue(allResults[i].columns[15]) ? 'T' : 'F';
                var willCall = allResults[i].getValue(allResults[i].columns[16]) ? 'T' : 'F';
                var relatedTrans = allResults[i].getText(allResults[i].columns[17]);
                var lastEmailSent = allResults[i].getValue(allResults[i].columns[18]);
                purchOrders.push({
                    id: poId,
                    tranid: tranId,
                    vendor: vendor,
                    vendoremail: vendorEmail,
                    location: location,
                    status: status,
                    matstatus: materialStatus,
                    created: dateCreated,
                    date: date,
                    shipdate: shipDate,
                    nextaction: nextAction,
                    notes: releaseNotes,
                    expedite: expedite,
                    dropship: dropShip,
                    blanket: blanket,
                    restock: restock,
                    willcall: willCall,
                    related: relatedTrans,
                    lastemail: lastEmailSent
                });
            }
            return purchOrders;
        };

        var getUnconfirmedPos = function (locationId) {
            var searchId = 'customsearch7534'
            var searchObj = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            if (locationId != -1) {
                var locFilter = search.createFilter({
                    name: 'location',
                    operator: search.Operator.ANYOF,
                    values: locationId
                });
                searchObj.filters.push(locFilter)
            }
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var purchOrders = [];
            for (var i = 0; i < allResults.length; i++) {
                var poId = allResults[i].getValue(allResults[i].columns[0]);
                var tranId = allResults[i].getValue(allResults[i].columns[1]);
                var vendor = allResults[i].getText(allResults[i].columns[2]);
                var vendorEmail = allResults[i].getValue(allResults[i].columns[3]);
                var location = allResults[i].getText(allResults[i].columns[4]);
                var status = allResults[i].getText(allResults[i].columns[5]);
                var materialStatus = allResults[i].getText(allResults[i].columns[6]);
                var dateCreated = allResults[i].getValue(allResults[i].columns[7]);
                var date = allResults[i].getValue(allResults[i].columns[8]);
                var shipDate = allResults[i].getValue(allResults[i].columns[9]);
                var nextAction = allResults[i].getValue(allResults[i].columns[10]);
                var releaseNotes = allResults[i].getValue(allResults[i].columns[11]);
                var expedite = allResults[i].getValue(allResults[i].columns[12]) ? 'T' : 'F';
                var dropShip = allResults[i].getValue(allResults[i].columns[13]) ? 'T' : 'F';
                var blanket = allResults[i].getValue(allResults[i].columns[14]) ? 'T' : 'F';
                var restock = allResults[i].getValue(allResults[i].columns[15]) ? 'T' : 'F';
                var willCall = allResults[i].getValue(allResults[i].columns[16]) ? 'T' : 'F';
                var relatedTrans = allResults[i].getText(allResults[i].columns[17]);
                var lastEmailSent = allResults[i].getValue(allResults[i].columns[18]);
                purchOrders.push({
                    id: poId,
                    tranid: tranId,
                    vendor: vendor,
                    vendoremail: vendorEmail,
                    location: location,
                    status: status,
                    matstatus: materialStatus,
                    created: dateCreated,
                    date: date,
                    shipdate: shipDate,
                    nextaction: nextAction,
                    notes: releaseNotes,
                    expedite: expedite,
                    dropship: dropShip,
                    blanket: blanket,
                    restock: restock,
                    willcall: willCall,
                    related: relatedTrans,
                    lastemail: lastEmailSent
                });
            }
            return purchOrders;
        };

        var getPastDuePos = function (locationId) {
            var searchId = 'customsearch7535'
            var searchObj = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            if (locationId != -1) {
                var locFilter = search.createFilter({
                    name: 'location',
                    operator: search.Operator.ANYOF,
                    values: locationId
                });
                searchObj.filters.push(locFilter)
            }
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var purchOrders = [];
            for (var i = 0; i < allResults.length; i++) {
                var poId = allResults[i].getValue(allResults[i].columns[0]);
                var tranId = allResults[i].getValue(allResults[i].columns[1]);
                var vendor = allResults[i].getText(allResults[i].columns[2]);
                var vendorEmail = allResults[i].getValue(allResults[i].columns[3]);
                var location = allResults[i].getText(allResults[i].columns[4]);
                var status = allResults[i].getText(allResults[i].columns[5]);
                var materialStatus = allResults[i].getText(allResults[i].columns[6]);
                var dateCreated = allResults[i].getValue(allResults[i].columns[7]);
                var date = allResults[i].getValue(allResults[i].columns[8]);
                var shipDate = allResults[i].getValue(allResults[i].columns[9]);
                var nextAction = allResults[i].getValue(allResults[i].columns[10]);
                var releaseNotes = allResults[i].getValue(allResults[i].columns[11]);
                var expedite = allResults[i].getValue(allResults[i].columns[12]) ? 'T' : 'F';
                var dropShip = allResults[i].getValue(allResults[i].columns[13]) ? 'T' : 'F';
                var blanket = allResults[i].getValue(allResults[i].columns[14]) ? 'T' : 'F';
                var restock = allResults[i].getValue(allResults[i].columns[15]) ? 'T' : 'F';
                var willCall = allResults[i].getValue(allResults[i].columns[16]) ? 'T' : 'F';
                var relatedTrans = allResults[i].getText(allResults[i].columns[17]);
                var lastEmailSent = allResults[i].getValue(allResults[i].columns[18]);
                purchOrders.push({
                    id: poId,
                    tranid: tranId,
                    vendor: vendor,
                    vendoremail: vendorEmail,
                    location: location,
                    status: status,
                    matstatus: materialStatus,
                    created: dateCreated,
                    date: date,
                    shipdate: shipDate,
                    nextaction: nextAction,
                    notes: releaseNotes,
                    expedite: expedite,
                    dropship: dropShip,
                    blanket: blanket,
                    restock: restock,
                    willcall: willCall,
                    related: relatedTrans,
                    lastemail: lastEmailSent
                });
            }
            return purchOrders;
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