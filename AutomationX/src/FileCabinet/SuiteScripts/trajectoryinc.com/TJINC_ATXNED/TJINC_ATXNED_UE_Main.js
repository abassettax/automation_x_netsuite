/**
 * @NApiVersion 2.1
 */

/**
 * Copyright (c) 2021 Trajectory Inc.
 * 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: ATXx
 * @Module: RMA
 * @Version: 1.3.7a
 * @Company: Trajectory Inc.
 * @CreationDate: 20210210
 * @FileName: TJINC_ATXNED_UE_Main.js
 * @NamingStandard: TJINC_NSJ-2-1-0
*/
define(['N/record', 'N/search', 'N/email', 'N/file', 'N/task', 'N/ui/serverWidget', 'N/runtime', 'N/redirect',
    '/SuiteBundles/Bundle 310544/TJINC_NS_Library_SS21',
    '/SuiteScripts/trajectoryinc.com/lib/DH/PurchaseRequestItemDetail',
    '/SuiteScripts/trajectoryinc.com/lib/DH/DH_Library',
    '/SuiteScripts/trajectoryinc.com/lib/DH/DH_PurchaseRequest_Engine'],
    function (record, search, email, file, task, serverWidget, runtime, redirect, tj, dh_pr, dh_lib, dh_pre) {
        const i_email_author = 24; // Aaron schultejann
        const s_so = 'salesorder';
        const s_baseurl = 'https://422523.app.netsuite.com/';
        const i_folder = 2331330;
        const DUMMY_PR = 1000;
        const s_customer_center = 'CUSTOMER';
        const o__to_status = { pending: 'B' };
        const o_tax = {
            code: 9162
        };

        return {
            //creates Transfer Orders on beforeSubmit of SO
            _transfer_orderproc: function (context,type) {
                let o_rec = context.newRecord;
                let i_location, i_loc_item;
                let b_createto, b_save;
                let a_tolocation = [], a_torecs = [];
                let o_temp;
                let i, j;
                try {
                    log.debug('_transfer_orderproc', 'IN');

                    i_location = o_rec.getValue({ fieldId: 'location' });
                    log.debug('head locations', i_location);
                    if (i_location) {

                        for (i = 0; i < o_rec.getLineCount('item'); i++) {
                            // if (type == 'salesorder') {
                            //     i_loc_item = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'location', line: i });
                            //     b_createto = false;
                            // } else if (type == 'workorder') {
                                i_loc_item = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol114', line: i });
                                b_createto = false;
                            // }
                            

                            if (parseInt(o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: i })) === 5) {
                                b_createto = true;
                            } else {
                                if (type == 'salesorder') {
                                    b_createto = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol76', line: i });
                                } else if (type == 'workorder') {
                                    b_createto = false;
                                }
                            }

                            if (i_loc_item !== i_location && b_createto) {
                                if (a_tolocation.indexOf(i_loc_item) === -1) {
                                    a_tolocation.push(i_loc_item);
                                    a_torecs.push({ location: i_loc_item, items: [], rec: {}, lines: 0 });
                                }
                            }
                        }

                        log.debug('locations to transfer from', a_tolocation);
                        for (i = 0; i < a_tolocation.length; i++) {
                            b_save = false;
                            i_lines = 0
                            let o_torec = record.create({ type: record.Type.TRANSFER_ORDER, isDynamic: false });
                            o_torec.setValue({ fieldId: 'location', value: a_tolocation[i] });
                            log.debug('locations to transfer to', i_location);
                            o_torec.setValue({ fieldId: 'transferlocation', value: i_location  });
                            o_torec.setValue({ fieldId: 'class', value: o_rec.getValue({ fieldId:'class' }) });
                            o_torec.setValue({ fieldId: 'employee', value: runtime.getCurrentUser().id });
                            o_torec.setValue({ fieldId: 'orderstatus', value: o__to_status.pending });

                            for (j = 0; j < o_rec.getLineCount('item'); j++) {
                                o_temp = {
                                    line_item: o_rec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: j }),
                                    line_qty: o_rec.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: j }),
                                    line_toqty: 0,
                                    line_createTO: false
                                };
                                // if (type == 'salesorder') {
                                //     o_temp.line_loc = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'location', line: j });
                                //     o_temp.line_qtyav = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'quantityavailable', line: j });
                                // } else if (type == 'workorder') {
                                    o_temp.line_loc = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol114', line: j })
                                    o_temp.line_qtyav = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol115', line: j });
                                // }
                                log.debug('o_temp', JSON.stringify(o_temp));

                                log.debug('custcol90', o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: j }));
                                if (parseInt(o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: j })) === 5) {
                                    o_temp.line_createTO = true;
                                } else {
                                    if (type == 'salesorder') {
                                        o_temp.line_createTO = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol76', line: j });
                                    } else if (type == 'workorder') {
                                        o_temp.line_createTO = false;
                                    }
                                }
                                log.debug('o_temp 2', JSON.stringify(o_temp));

                                if (a_tolocation[i] === o_temp.line_loc && o_temp.line_qtyav > 0 && o_temp.line_createTO) {

                                    if (o_temp.line_qty <= o_temp.line_qtyav) {
                                        o_temp.line_toqty = o_temp.line_qty;
                                    } else {
                                        o_temp.line_toqty = o_temp.line_qtyav;
                                    }

                                    let o_cost_search = tj.searchAll({
                                        'search': search.create({
                                            type: search.Type.ITEM,
                                            filters:
                                                [
                                                    ['internalid', 'anyof', o_temp.line_item], 'AND',
                                                    ['inventorylocation', 'anyof', o_temp.line_loc]
                                                ],
                                            columns: ['locationaveragecost']
                                        })
                                    });

                                    o_torec.setSublistValue({ sublistId: 'item', fieldId: 'item', value: o_temp.line_item, line: i_lines });
                                    o_torec.setSublistValue({ sublistId: 'item', fieldId: 'quantity', value: o_temp.line_toqty, line: i_lines });
                                    //defaults to average cost at the location, otherwise uses the rate set on the SO.
                                    //add handling for loc avg cost empty or zero
                                    if (o_cost_search[0].getValue('locationaveragecost') == '' || o_cost_search[0].getValue('locationaveragecost') == 0 || o_cost_search[0].getValue('locationaveragecost') == null) {
                                        var toRate = o_rec.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: j });
                                    } else {
                                        var toRate = o_cost_search[0].getValue('locationaveragecost');
                                    }
                                    o_torec.setSublistValue({ sublistId: 'item', fieldId: 'rate', value: toRate, line: i_lines });
                                    i_lines++;
                                    if (!b_save) {
                                        b_save = true;
                                    }


                                }
                            }

                            if (b_save) {
                                var soId = o_rec.id;
                                if (soId) {
                                    o_torec.setValue({ fieldId: 'custbody236', value: soId });
                                }
                                o_torec.setValue({ fieldId: 'shippingcost', value: 0.01, ignoreFieldChange: true });

                                let i_nrec_id = o_torec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                                log.audit({ title: '_transfer_orderproc', details: 'New Transfer Order created for location: ' + a_tolocation[i] });
                                for (j = 0; j < o_rec.getLineCount('item'); j++) {
                                    if (type == 'salesorder') {
                                        if (o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol114', line: j }) === a_tolocation[i]) {
                                            o_rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol74', line: j, value: i_nrec_id });
                                            //set ship location as header location
                                            o_rec.setSublistValue({ sublistId: 'item', fieldId: 'location', line: j, value: i_location });
    
                                            if (parseInt(o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: j })) === 5) {
                                                o_rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: j, value: '' });
                                            }
                                        }
                                    } else if (type = 'workorder') {
                                        if (o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol114', line: j }) === a_tolocation[i]) {
                                            o_rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol74', line: j, value: i_nrec_id });
    
                                            if (parseInt(o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: j })) === 5) {
                                                o_rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol90', line: j, value: '' });
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                    }
                } catch (e) {
                    log.error('_transfer_orderproc', e);
                }
            },

            //DH - _isprocessable
            _dh_isproc: function (context, lineIndex) {
                let itemType = context.newRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: lineIndex });
                let itemSubType = context.newRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemsubtype', line: lineIndex });
                return itemType === 'InvtPart' || itemType === 'NonInvtPart' || itemType === 'Service' && (itemSubType === 'Sale' || itemSubType === 'Resale');
            },

            _linenumber: function (context) {
                let o_rec = context.newRecord;
                let ES, i_index;
                for(let i=0; i < o_rec.getLineCount({ sublistId: 'item' }); i++){
                    if(o_rec.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: i }) !== 'EndGroup'){
                        i_index = i+1;
                        ES = '';
                        if (o_rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_linenumber', line: i }).indexOf("ES") !== -1) {
                            ES = '-ES';
                        }
                        ES = (i_index).toString() + ES;
                        o_rec.setSublistValue({ sublistId: 'item', fieldId: 'custcol_linenumber', value: ES , line: i });
                        o_rec.setSublistValue({ sublistId: 'item', fieldId: 'taxcode', value: o_tax.code, line: i });
                    }
                }
            },

            //WebStore Order Confermation Email
            _webstore_confirmationemail: function (o_rec) {
                const i_source = o_rec.getValue('source');
                let i_tranid, i_amount, i_entity, s_custname, s_subrep, s_emailmessage, o_lk;
                const o_src = {
                    'web': 'Web (Automation-X: Oil and Gas Well Automation Equipment)',
                    'customer': 'Customer Center'
                };

                try {
                    if (i_source === o_src.web || i_source === o_src.customer) {
                        log.debug('_webstore_confirmationemail', 'IN');
                        log.debug('Record Id: ', o_rec.id);
                        i_tranid = o_rec.getValue('tranid');
                        i_amount = o_rec.getValue('amount');
                        i_entity = o_rec.getValue('entity');
                        s_custname = o_rec.getText('entity');
                        s_subrep = 'Automation-X Customer ' + s_custname + ' has placed an online order.  Number ' + i_tranid + ' has been received';
                        s_emailmessage = s_custname + ' placed an order online (order# ' + i_tranid + ' ' + i_amount + ').  Please verify and process the order.';

                        log.audit(record.Type.SALES_ORDER.toLowerCase() + "  " + o_rec.id + "  " + i_entity);
                        for (let i = 0; i < o_rec.getLineCount('salesteam'); i++) {
                            o_lk = tj.lookupFields(search.lookupFields({ id: o_rec.getSublistField({ sublistId: 'salesteam', fieldId: 'id', line: i }), type: record.Type.EMPLOYEE, columns: ['email'] }));
                            email.send({
                                author: i_email_author,
                                recipients: o_lk.email,
                                subject: s_subrep,
                                body: s_emailmessage
                            });
                        }
                        log.debug('_webstore_confirmationemail', 'OUT');
                    }
                } catch (e) {
                    log.error('_webstore_confirmationemail', e);
                }
            },
            //Signature save to file
            _signaturesave_tofile: function (context, o_rec) {
                let o_file_id, o_file;
                let s_src = o_rec.getValue('custbody140');
                const s_today = new Date();
                const s_type = o_rec.type.toLowerCase();

                try {
                    if (context.type !== 'delete') {
                        log.debug('_signaturesave_tofile', 'IN');
                        if (s_type !== s_so) {
                            if (o_rec.getValue('custbodysavedsignature')) {
                                record.detach({
                                    record: { type: 'file', id: o_rec.getValue('custbodysavedsignature') },
                                    from: { type: s_type, id: o_rec.id }
                                });
                            }
                        } else {
                            if (o_rec.getValue('custbodycustbodysavedsignature_ff')) {
                                record.detach({
                                    record: { type: 'file', id: o_rec.getValue('custbodycustbodysavedsignature_ff') },
                                    from: { type: s_type, id: o_rec.id }
                                });
                            }
                        }
                        if (s_src !== null && s_src !== 'undefined') {
                            if (s_src.length > 1000) {
                                s_src = s_src.substring(22);
                                o_file_id = file.create({
                                    name: s_so + o_rec.id + '_' + s_today + '.png',
                                    fileType: file.Type.PNG,
                                    contents: s_src,
                                    folder: i_folder,
                                    isOnline: true
                                });
                                o_file = file.load({
                                    id: o_file_id
                                });

                                if (o_file !== '' && o_file !== null) {
                                    if (s_type !== s_so) {
                                        o_rec.setValue('custbodycustbodysavedsignature_ff', o_file_id);
                                    } else {
                                        o_rec.setValue('custbodysavedsignature', o_file_id);
                                    }
                                    o_rec.setValue('custbody141', s_baseurl + o_file.url);
                                }
                            }
                        }
                        log.debug('_signaturesave_tofile', 'OUT');
                    }
                    return o_rec;
                } catch (e) {
                    log.error('_signaturesave_tofile', e);
                    return o_rec;
                }
            },
            //Hide copy Button
            _hide_copybutton: function (context, o_rec) {
                let d_today, d_ndays, d_trandate, o_btn;
                let o_form = context.form;
                try {
                    if (context.type === 'view') {
                        o_form.addButton({
                            label: 'Make Copy & Reprice', id: 'custpage_Copy',
                            functionName: 'CopyRecordReprice(' + o_rec.id.toString() + ',' + o_rec.getValue('entity').toString() + ')'
                        });
                    }
                    d_today = new Date();
                    d_ndays = new Date();
                    d_ndays.setDate(d_today.getDate() - 90);
                    d_trandate = Date.parse(o_rec.getValue('trandate'));
                    o_btn = o_form.getButton({ id: 'makecopy' });
                    if (d_ndays > d_trandate && o_btn) {
                        //o_btn.isHidden = true;
                    }
                } catch (e) {
                    log.error('_hide_copybutton', e);
                }
            },
            //Hide Columns
            _hidecolumns: function (context, o_rec) {
                let o_form = context.form;
                let i_credit_rem = 0;
                let s_searchurl = "";
                let a_itemsb = [], o_lkupfields = {}, o_lkupfields_parent = {}, o_tempobj = {};
                let i_isproccesing, i_lineitem, i_customer, i_sotranid, s_custcol91, s_holdmessage, s_custcol90, s_credmessage, s_softholdmessage, s_onholdmessage, s_forceholdmessage;
                const /*i_user2 = 3354, i_user3 = 28538, i_user4 = 28816,*/ i_clineitem = 1277;
                //Users Harris, Michael O' nor 'Allen, Austin L' nor 'Garcia, Leah M'.
                try {
                    i_customer = o_rec.getValue('entity');
                    i_sotranid = o_rec.getValue('tranid');
                    a_itemsb = o_form.getSublist({ id: 'item' });
                    log.debug('hidecolumns 1', a_itemsb)
                    s_holdmessage = '<div> <font size="2" ><B>';
                    s_softholdmessage = "Customer account is Past Due and has been placed on <u>SOFT CREDIT HOLD</u>.  Please contact accounting to lift the hold for the remanider of the day.<br/><br/>";
                    s_onholdmessage = "Customer account is Past Due and has been placed on <u>CREDIT HOLD</u>. Please resolve outstanding invoces before processing order.<br/><br/>";
                    s_forceholdmessage = "Customer account is Past Due and has been placed on <u>HARD CREDIT HOLD</u>. Please contact accounting.<br/><br/>";
                    i_isproccesing = 0;

                    let o_col4 = o_form.getSublist({ id: 'item' }).getField({ id: 'custcol4' });
                    log.debug('Step 1');
                    let o_col76 = a_itemsb.getField('custcol76')
                    let o_col77 = a_itemsb.getField('custcol77');
                    let o_col96 = a_itemsb.getField('custcol96');
                    //let o_col90 = a_itemsb.getField('custcol90');
                    //let o_col92 = a_itemsb.getField('custcol92');
                    let o_col139 = a_itemsb.getField('custbody139');
                    let o_col163 = a_itemsb.getField('custbody163');
                    let o_col178 = a_itemsb.getField('custbody178');
                    let o_col180 = a_itemsb.getField('custbody180');
                    let o_qtycom = a_itemsb.getField('quantitycommitted');
                    let o_qtyful = a_itemsb.getField('quantityfulfilled');
                    let o_qtybil = a_itemsb.getField('quantitybilled');
                    let o_qtybko = a_itemsb.getField('quantitybackordered');
                    let o_cratpo = a_itemsb.getField('createpo');
                    let o_crarpo = a_itemsb.getField('createdpo');
                    let o_cratwo = a_itemsb.getField('createwo');

                    log.debug('Step 1');
                    if (context.type === 'view') {
                        if (o_crarpo) {
                            o_crarpo.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        // if (o_col90) {
                        //     o_col90.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        // }
                        // if (o_col92) {
                        //     o_col92.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        // }
                        if (o_col139) {
                            o_col139.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (o_col163) {
                            o_col163.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (o_col178) {
                            o_col178.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (o_col180) {
                            o_col180.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (i_sotranid !== 'To Be Generated') {
                            if (o_qtycom) {
                                o_qtycom.displayType = serverWidget.SublistDisplayType.HIDDEN;
                            }
                            if (o_qtyful) {
                                o_qtyful.displayType = serverWidget.SublistDisplayType.HIDDEN;
                            }
                            if (o_qtybil) {
                                o_qtybil.displayType = serverWidget.SublistDisplayType.HIDDEN;
                            }
                            if (o_qtybko) {
                                o_qtybko.displayType = serverWidget.SublistDisplayType.HIDDEN;
                            }
                        }
                        o_form.addButton({
                            label: 'Print Staging Label', id: 'custpage_stagingbutton',
                            functionName: 'printstaginglabel(' + o_rec.id + ')'
                        });

                        if (o_rec.getValue('status') !== 'Closed' && o_rec.getValue('status') !== 'Billed') {
                            //TODO: this button does nothing, need to verify function and test
                            o_form.addButton({
                                label: 'Close Order', id: 'custpage_axclose',
                                functionName: 'axClose(' + o_rec.id + ',' + o_rec.type.toLowerCase() + ')'
                            });
                        }

                    } else {
                        if (o_col76) {
                            o_col76.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (o_cratpo) {
                            o_cratpo.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (o_col96) {
                            o_col96.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                        if (o_cratwo) {
                            o_cratwo.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }

                    }

                    if (context.type !== 'edit') {
                        if (i_sotranid === 'To Be Generated' && o_col77) {
                            o_col77.displayType = serverWidget.SublistDisplayType.HIDDEN;
                        }
                    }
                    if (o_cratpo) {
                        o_cratpo.displayType = serverWidget.SublistDisplayType.HIDDEN;
                    }
                    if (o_col4) {
                        o_col4.displayType = serverWidget.SublistDisplayType.HIDDEN;
                    }

                    for (let i = 0; i < o_rec.getLineCount('item'); i++) {
                        s_custcol91 = parseInt(o_rec.getSublistValue('item', 'custcol91', i));
                        s_custcol90 = o_rec.getSublistValue('item', 'custcol90', i);
                        i_lineitem = o_rec.getSublistValue('item', 'item', i);
                        if ((s_custcol91 === 1000 || s_custcol90) && i_lineitem !== i_clineitem) {
                            i_isproccesing = 1;
                            log.debug('Is Processing :', i_isproccesing);
                            break;
                        }
                    }
                    // show processing  message
                    let s_processingmessage = o_form.getField('custbody200');
                    if (s_processingmessage) {
                        s_processingmessage.isDisabled = true;
                        s_processingmessage.label = '';
                        //o_form.removeButton('edit');
                    }
                    // remove edit button until requests finish processing
                    /*if (context.type === 'edit') {
                        redirect.toRecord({
                            type: s_so,
                            id: o_rec.id
                        });
                    }*/
                    //End PO set up SO
                    if (i_customer) {
                        o_lkupfields = tj.lookupFields(search.lookupFields({ id: i_customer, type: record.Type.CUSTOMER.toLowerCase(), columns: ['custentity327', 'balance', 'unbilledorders', 'consolbalance', 'consolunbilledorders', 'creditlimit', 'parent'] }));
                        o_tempobj = {
                            custentity327: parseInt(o_lkupfields.custentity327),
                            balance: o_lkupfields.balance,
                            unbilledorders: o_lkupfields.unbilledorders,
                            creditlimit: o_lkupfields.creditlimit,
                            parent: o_lkupfields.parent,
                            consolbalance: o_lkupfields.consolbalance,
                            consolunbilledorders: o_lkupfields.consolunbilledorders
                        }

                        if (!o_tempobj.creditlimit && o_tempobj.parent) {
                            o_lkupfields_parent = tj.lookupFields(search.lookupFields({ id: o_tempobj.parent, type: record.Type.CUSTOMER.toLowerCase(), columns: ['creditlimit'] }));
                            o_tempobj.creditlimit = o_lkupfields_parent.creditlimit || 0;
                            o_tempobj.balance = o_tempobj.consolbalance || 0;
                            o_tempobj.unbilledorders = o_tempobj.consolunbilledorders || 0;
                        }

                        o_tempobj.balance = parseInt(o_tempobj.balance);
                        if (!o_tempobj.balance) {
                            o_tempobj.balance = 0;
                        }
                        if (o_tempobj.parent) {
                            i_customer = o_tempobj.parent;
                        }
                        //FF orders search
                        let o_formulacol = search.createColumn({
                            name: "formulanumeric",
                            summary: "SUM",
                            formula: "({quantitypicked} - {quantitybilled}) * {rate}"
                        });
                        let o_so_search = tj.searchAll({
                            'search': search.create({
                                type: 'salesorder',
                                filters: [
                                    ["type", "anyof", "SalesOrd"], "AND",
                                    ["closed", "is", "F"], "AND",
                                    ["status", "anyof", "SalesOrd:F", "SalesOrd:E", "SalesOrd:D"], "AND",
                                    ["mainline", "is", "F"], "AND",
                                    ["formulanumeric: CASE WHEN {quantitypicked} > {quantitybilled} THEN 1 ELSE 0 END", "equalto", "1"], "AND",
                                    ["customer.internalidnumber", "equalto", i_customer]
                                ],
                                columns: [
                                    o_formulacol
                                ]
                            })
                        });

                        //end search
                        let i_fforders = 0;
                        if (o_so_search.length > 0) {
                            i_fforders = parseFloat(o_so_search[0].getValue(o_formulacol)) || 0;
                            if (i_fforders <= 0) {
                                i_fforders = 0;
                            }
                        }

                        let i_acommit = 0;
                        let i_qtycom = 0;
                        for (let i = 0; i < o_rec.getLineCount('item'); i++) {
                            i_qtycom = parseInt(o_rec.getSublistValue({ fieldId: 'quantitycommitted', sublistId: 'item', line: i }));
                            if (i_qtycom > 0) {
                                i_acommit += o_rec.getSublistValue({ fieldId: 'rate', sublistId: 'item', line: i }) * i_qtycom;
                            }
                        }

                        //let i_transac_total = o_rec.getValue('total');
                        i_credit_rem = parseInt(o_tempobj.creditlimit) - parseInt(o_tempobj.balance) - parseInt(i_fforders) - parseInt(i_acommit);

                        if (i_credit_rem < 0) {
                            s_credmessage = "Customer has exceeded credit limit. Order can not be fulfilled. Please contact accounting to discuss solutions. <br/><br/>";
                        }
                        //||  o_tempobj.custentity327 === 7 || o_tempobj.custentity327 === 3 

                        if (o_tempobj.custentity327 === 4 || o_tempobj.custentity327 === 9) {
                            let s_btnurl = s_baseurl + 'app/common/search/searchresults.nl?searchtype=Transaction&Transaction_NAME=' + o_rec.getValue('entity') + '&style=NORMAL&report=&grid=&searchid=4901&sortcol=Transction_AMONING15_raw&sortdir=DESC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F';
                            if (context.type === 'edit') {
                                s_searchurl = '<button style ="border-radius: 3px; width:80%; height:100%; background-color:#F2F2F2;"  onclick="window.location.href = \'' + s_btnurl + '\';" >Click to View Past Due Invoices  </button>';
                            } else if (context.type === 'create') {
                                s_searchurl = '<a href="' + s_baseurl + 'app/common/search/searchresults.nl?searchid=4870" target="_blank">Click Here To View Past Customer Report</a>'
                            } else {
                                s_searchurl = 'Click EDIT to view past due invoices.';
                            }

                            if (i_credit_rem < 0) {
                                s_holdmessage += s_credmessage;
                            }
                            if (o_tempobj.custentity327 === 3) {
                                s_holdmessage += s_softholdmessage;
                                s_holdmessage += s_searchurl;
                            }
                            if (o_tempobj.custentity327 === 4) {
                                s_holdmessage += s_onholdmessage;
                                s_holdmessage += s_searchurl;
                            }
                            if (o_tempobj.custentity327 === 9) {
                                s_holdmessage += s_forceholdmessage;
                                s_holdmessage += s_searchurl;
                            }

                            s_holdmessage += "</b></font></div >";
                            o_rec.setValue('custbody172', s_holdmessage);
                            o_form.removeButton('submitfulfill');
                            o_form.removeButton('process');
                        }

                    }
                } catch (e) {
                    log.error('_hidecolumns', e);
                }
            },
            //SO_Create_beforeload
            _so_create: function (context, o_rec) {
                let i_customer = o_rec.getValue('entity');
                let i_tranid, o_customer, s_field;
                const o_checkfields = [
                    { field: 'custentity187', check: 'custbody7' },
                    { field: 'custentity_req_wellsitename', check: 'custbody8' },
                    { field: 'custentity_req_wellnumber', check: 'custbody9' },
                    { field: 'custentity_req_accountingnumber', check: 'custbody10' },
                    { field: 'custentity_req_xtocode', check: 'custbody11' },
                    { field: 'custentity_req_techname', check: 'custbody38' },
                    { field: 'custentity_req_xto_reason_codes', check: 'custbody67' },
                    { field: 'custentity_req_plantcode', check: 'custbody69' },
                    { field: 'custentity_req_approverid', check: 'custbody73' },
                    { field: 'custentity_req_glaccount', check: 'custbody74' },
                    { field: 'custentity193', check: 'otherrefnum' }
                ];
                const s_req = 'Required';
                try {
                    if (context.type !== 'copy') {
                        if (i_customer) {
                            i_tranid = o_rec.getValue('tranid');
                            if (i_tranid === 'To Be Generated') {
                                o_customer = record.load({ type: record.Type.CUSTOMER.toLowerCase(), id: i_customer, isDynamic: false });
                                o_rec.setValue('location', o_customer.getValue('custentity180'));
                                o_rec.setValue('class', o_customer.getValue('custentity149'));
                                for (let i = 0; i < o_checkfields.length; i++) {
                                    s_field = o_customer.getValue(o_checkfields[i].field);
                                    if (s_field === 'T') {
                                        if (!o_rec.getValue(o_checkfields[i].check)) {
                                            o_rec.setValue(o_rec.getValue(o_checkfields[i].check), s_req);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    log.error('_so_create', e);
                }
            },
            //POS Form 
            _pos_form: function (context, o_rec) {
                try {
                    if (o_rec.getValue('customform') === 303 && context.type === 'create') {
                        o_rec.setValue('customform', 294);
                    }
                    return o_rec;
                } catch (e) {
                    log.error('_pos_form', e);
                    return o_rec;
                }
            },
            //DH - Salers Order - UE after submit
            //creates Purchase Requests on afterSubmit of SO
            _dh_so_ue_as: function (context,type) {
                try {
                    if (runtime.executionContext !== runtime.ContextType.MAP_REDUCE) {
                        let purchaseRequests = [];
                        let employeeId = +runtime.getCurrentUser().id;
                        for (let i = 0, lineCount = +context.newRecord.getLineCount({ sublistId: 'item' }); i < lineCount; i = i + 1) {
                            let createType = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol90' });
                            let notes = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol116'});
                            let prType = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol117'});
                            let relatedTransactionId = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: dh_lib.FIELDS.TRANSACTION.COLUMN.RelatedTransaction });
                            let purchaseRequestId = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: dh_lib.FIELDS.TRANSACTION.COLUMN.PurchaseRequest });
                            let costEstimateType = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'costestimatetype' });
                            let quantity = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'quantity' });
                            let estimatedCost = -1;
                            let vendorNotes = null;
                            let nextLineIndex = (i + 1);
                            let i_cost;
                            var recType = context.newRecord.type;
                            if (recType == record.Type.SALES_ORDER) {
                                var tranType = 'salesorder';
                            } else {
                                var tranType = 'workorder';
                            }
                            // Ensure both Related and PR's are blank
                            if (this._dh_isproc(context, i) && !(relatedTransactionId > 0) && (purchaseRequestId === DUMMY_PR || !(purchaseRequestId > 0)) && createType != '') {
                                switch (createType) {
                                    case dh_pr.CreateType.PurchaseOrder:
                                    case dh_pr.CreateType.ExpeditePO:
                                    case dh_pr.CreateType.DropShipPO:
                                    case dh_pr.CreateType.WillCallPO:
                                    case dh_pr.CreateType.CreditCardPO:
                                        // If the estimate 'Cost Est Type' (standard field) is Custom, carry through the Est Extended Cost as the Unit Cost (divide Est Extended Cost / by Qty ) and use as 'estimatedCost'
                                        if (costEstimateType === 'CUSTOM') {
                                            estimatedCost = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'costestimaterate' });
                                        }
                                        // Make sure we don't look too far ahead!
                                        if (nextLineIndex < lineCount) {
                                            // Check the next line for Vendor Notes
                                            let nextLineItemId = +context.newRecord.getSublistValue({ sublistId: 'item', line: nextLineIndex, fieldId: 'item' });
                                            let nextLineCreateType = +context.newRecord.getSublistValue({ sublistId: 'item', line: nextLineIndex, fieldId: dh_lib.FIELDS.TRANSACTION.COLUMN.CreateType });
                                            if (nextLineItemId === dh_lib.ITEM.AXBLANKLINE && nextLineCreateType === createType) {
                                                // Process this as the vendorNotes:
                                                vendorNotes = context.newRecord.getSublistValue({ sublistId: 'item', line: nextLineIndex, fieldId: 'description' });
                                            }
                                        }

                                        if (costEstimateType === 'CUSTOM') {
                                            i_cost = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'costestimaterate' });
                                        } else {
                                            let o_cost_search = tj.searchAll({
                                                'search': search.create({
                                                    type: 'item',
                                                    filters: [
                                                        ['internalidnumber', 'equalto', context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'item' })], 'AND',
                                                        ['othervendor', 'anyof', context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol118' })]
                                                    ],
                                                    columns: ['vendorcost']
                                                })
                                            });
                                            log.debug('beforeSubmit - o_cost_search', "o_cost_search: " + JSON.stringify(o_cost_search));
                                            if (o_cost_search.length > 0) {
                                                i_cost = o_cost_search[0].getValue({ name: 'vendorcost' });
                                            } else {
                                                i_cost = 0;
                                            }
                                        }
                                        
                                        if (type == 'salesorder') {
                                            var locationId = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'location' });
                                            var salesOrderId = +context.newRecord.id;
                                            var salesOrderLine = i + 1;
                                            var workOrderId = null;
                                            var workOrderLine = null;
                                        } else if (type == 'workorder') {
                                            var locationId = context.newRecord.getValue({ fieldId: 'location' })
                                            var workOrderId = +context.newRecord.id;
                                            var workOrderLine = i + 1;
                                            var salesOrderId = null;
                                            var salesOrderLine = null;
                                        }
                                        purchaseRequests.push({
                                            processingStatus: dh_pr.PurchaseRequestProcessingStatus.PurchaseOrder,
                                            LocationPreferredStockLevel: +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol112' }),   /// MH ADDED
                                            vendorId: +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol118' }),
                                            locationId: locationId,
                                            email: runtime.getCurrentUser().email,
                                            fromLocationId: -1,
                                            itemId: context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'item' }),
                                            rate: i_cost,
                                            internalId: '-1',
                                            quantity: quantity,
                                            //have to mock format from normal PR setup
                                            salesOrderId: [{
                                                id: salesOrderId,
                                                line: salesOrderLine,
                                                type: tranType
                                            }],
                                            salesOrderLine: salesOrderLine,
                                            workOrderId: workOrderId,
                                            workOrderLine: workOrderLine,
                                            purchasingNotes: context.newRecord.getValue({ fieldId: dh_lib.FIELDS.TRANSACTION.BODY.PurchasingNotes }),
                                            estimatedCost: estimatedCost,
                                            fromSalesOrderProcess: createType !== dh_pr.CreateType.PurchaseOrder,
                                            description: context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'description' }),
                                            purchaseOrderType: createType,
                                            isCustomPrice: estimatedCost !== -1,
                                            vendorNotes: vendorNotes,
                                            notes: notes,
                                            prType: prType
                                        });
                                        // Skip the next line, if it was vendor notes
                                        if (vendorNotes !== null) {
                                            i = i + 1;
                                        }
                                        break;
                                }
                            }
                        }
                        log.debug('beforeSubmit - purchaseRequestsArr', "purchaseRequests: " + JSON.stringify(purchaseRequests));
                        // Send to Purchase Request Creation process
                        if (purchaseRequests.length > 0) {
                            if (purchaseRequests.length > 10) {
                                let purchaseRequestProcessor = task.create({
                                    taskType: task.TaskType.MAP_REDUCE
                                });
                                purchaseRequestProcessor.scriptId = 'customscript_tjinc_dh_pr_create_mr';
                                purchaseRequestProcessor.deploymentId = null; // Setting this to null forces Netsuite to select the next available 'idle' deployment
                                purchaseRequestProcessor.params = {
                                    custscript_tjinc_dh_owner: employeeId,
                                    custscript_tjinc_dh_sopurchaserequests: JSON.stringify(purchaseRequests)
                                };
                                purchaseRequestProcessor.submit();
                            }
                            else {
                                //only returns requests that can be processed immediately
                                let processablePurchaseRequests = dh_pre.createPurchaseRequests({
                                    employeeId: employeeId,
                                    purchaseRequests: purchaseRequests
                                });
                                let transactions = dh_pre.determineTransactions({
                                    employeeId: employeeId,
                                    purchaseRequests: processablePurchaseRequests
                                });
                                transactions.forEach(function (transaction) {
                                    dh_pre.createTransaction({
                                        transaction: transaction
                                    });
                                });
                                // Redirect back to itself
                                redirect.toRecord({
                                    type: context.newRecord.type,
                                    id: context.newRecord.id
                                });
                                log.audit('afterSubmit - Remaining Usage', runtime.getCurrentScript().getRemainingUsage());
                            }
                        }
                    }
                } catch (e) {
                    log.error('_dh_so_ue', e);
                }
            },
            //DH - Salers Order - UE before submit
            _dh_so_ue_bs: function (context) {
                try {
                    if (runtime.executionContext !== runtime.ContextType.MAP_REDUCE) {
                        var updatePrices = [];
                        var cust = context.newRecord.getValue('entity');
                        for (let i = 0, lineCount = +context.newRecord.getLineCount({ sublistId: 'item' }); i < lineCount; i = i + 1) {
                            let createType = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol90' });
                            let relatedTransactionId = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: dh_lib.FIELDS.TRANSACTION.COLUMN.RelatedTransaction });
                            let purchaseRequestId = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: dh_lib.FIELDS.TRANSACTION.COLUMN.PurchaseRequest });
                            // Ensure both Related and PR's are blank
                            if (this._dh_isproc(context, i) && !(relatedTransactionId > 0) && !(purchaseRequestId > 0) && createType != '') {
                                switch (parseInt(createType)) {
                                    case dh_pr.CreateType.PurchaseOrder:
                                    case dh_pr.CreateType.ExpeditePO:
                                    case dh_pr.CreateType.DropShipPO:
                                    case dh_pr.CreateType.WillCallPO:
                                    case dh_pr.CreateType.CreditCardPO:
                                        // Move this to a BeforeSubmit and populate the 'Purchase Request' column with a dummy value (1000) on evey line that was processed
                                        // Popuating this value allows a client-script to prevent the user from entering a value in the CreateType field .. thus preventing re-generating the line
                                        log.debug('beforeSubmit - Attemping to set Dummy PR', "line: " + i);
                                        log.debug('fields', dh_lib.FIELDS.TRANSACTION.COLUMN.PurchaseRequest + ' value dummy' + DUMMY_PR);
                                        context.newRecord.setSublistValue({ sublistId: 'item', line: i, fieldId: dh_lib.FIELDS.TRANSACTION.COLUMN.PurchaseRequest, value: DUMMY_PR });
                                        break;
                                    case dh_pr.CreateType.TransferOrder:
                                        break;
                                }
                            }
                            var updatePricing = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol_custpriceupdate' });
                            if (updatePricing) {
                                //TODO: push item/price data to array for next fn
                                updatePrices.push({
                                    item: context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'item' }),
                                    rate: context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'rate' })
                                });
                                context.newRecord.setSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol_custpriceupdate', value: false });
                            }
                        }
                        log.debug('beforeSubmit - updatePrices', JSON.stringify(updatePrices));
                        if (updatePrices.length > 0) {
                            var pricebookResults = tj.searchAll({
                                'search': search.create({
                                    type: "customrecord1281",
                                    filters:
                                    [
                                    ["custrecord316.custrecord319","anyof",cust], 
                                    "AND", 
                                    ["custrecord316.custrecord320","before","today"], 
                                    "AND", 
                                    ["custrecord316.custrecord321","after","today"], 
                                    "AND", 
                                    ["isinactive","is","F"], 
                                    "AND", 
                                    ["custrecord316.isinactive","is","F"]
                                    ],
                                    columns: ['custrecord316']
                                })
                            });
                            log.debug('beforeSubmit - pricebookResults', "pricebookResults: " + JSON.stringify(pricebookResults));
                            if (pricebookResults.length > 0) {
                                var pricebookId = pricebookResults[0].getValue({
                                    name: 'custrecord316'
                                });
                                for (var i = 0; i < updatePrices.length; i++) {
                                    var item = updatePrices[i].item;
                                    var rate = updatePrices[i].rate;
                                    var newPricebookItem = record.create({
                                        type: 'customrecord1281'
                                    });
                                    newPricebookItem.setValue({
                                        fieldId: 'custrecord316',
                                        value: pricebookId
                                    });
                                    newPricebookItem.setValue({
                                        fieldId: 'custrecord317',
                                        value: item
                                    });
                                    newPricebookItem.setValue({
                                        fieldId: 'custrecord318',
                                        value: rate
                                    });
                                    var recordId = newPricebookItem.save();
                                    log.debug('beforeSubmit - new pricebook item created', "recordId: " + recordId);
                                }
                                var priceUpdater = task.create({
                                    taskType: task.TaskType.SCHEDULED_SCRIPT
                                });
                                priceUpdater.scriptId = 'customscript_ax_pricebook_update_ss';
                                priceUpdater.deploymentId = null; // Setting this to null forces Netsuite to select the next available 'idle' deployment
                                priceUpdater.params = {
                                    custscript_ax_pricebook_id_ss: pricebookId,
                                    custscript_ax_pricebook_prices_ss: JSON.stringify(updatePrices)
                                };
                                priceUpdater.submit();
                            } else {
                                //normal price update directly on customer
                                var custLookup = search.lookupFields({
                                    type: search.Type.CUSTOMER,
                                    id: cust,
                                    columns: ['parent']
                                });
                                if (custLookup.parent[0]) {
                                    var parent = custLookup.parent[0].value;
                                }
                                //check to see if there is a parent customer if so update that customer
                                if (parent) {
                                    var custLookup2 = search.lookupFields({
                                        type: search.Type.CUSTOMER,
                                        id: parent,
                                        columns: ['custentity333']
                                    });
                                    if (custLookup2.custentity333 == "T") {
                                        cust = parent;
                                    }
                                }
                                ///end customer check
                                var custRecord = record.load({
                                    type: record.Type.CUSTOMER,
                                    id: cust
                                });
                                for (var i = 0; i < updatePrices.length; i++) {
                                    var item = updatePrices[i].item;
                                    var rate = updatePrices[i].rate;
                                    for (var j = 0; j <= custRecord.getLineCount({sublistId:'itempricing'}); j++) {
                                        var thisitemid = custRecord.getSublistValue({
                                            sublistId: 'itempricing',
                                            fieldId: 'item', 
                                            line: j
                                        });
                                        if (item == thisitemid && rate) {
                                            custRecord.setSublistValue({
                                                sublistId: 'itempricing',
                                                fieldId: 'level', 
                                                line: j,
                                                value: -1   //Custom price level
                                            });
                                            custRecord.setSublistValue({
                                                sublistId: 'itempricing',
                                                fieldId: 'price', 
                                                line: j,
                                                value: rate
                                            });
                                            break;
                                        }
                                    }
                                    if (item != thisitemid && rate) {
                                        custRecord.selectNewLineItem({
                                            sublistId: 'itempricing'
                                        });
                                        custRecord.setCurrentSublistValue({
                                            sublistId: 'itempricing',
                                            fieldId: 'item',
                                            value: item
                                        });
                                        custRecord.setCurrentSublistValue({
                                            sublistId: 'itempricing',
                                            fieldId: 'level',
                                            value: -1,
                                            ignoreFieldChange: true
                                        });
                                        custRecord.setCurrentSublistValue({
                                            sublistId: 'itempricing',
                                            fieldId: 'price',
                                            value: rate,
                                            ignoreFieldChange: true
                                        });
                                        custRecord.commitLine({
                                            sublistId: 'itempricing'
                                        });
                                    }
                                }    
                                custRecord.save({
                                    ignoreMandatoryFields: true
                                });
                            }
                        }
                    }
                } catch (e) {
                    log.error('_dh_so_ue_bs', e);
                }
            },
            //XTOTrailerUserEvent before load
            _xto_trailer_bl: function (context) {
                let o_form = context.form;
                let o_user = runtime.getCurrentUser();
                let o_temp;
                try {
                    if (context.type === 'create') {
                        log.debug('login', o_user.email);
                    }

                    if (o_user.role === 1127) {
                        o_form.removeButton('makecopy');
                        //,'newrecrecmachcustrecord157','newrecrecmachcustrecord221'
                        let a_btns = ['email', 'custpage_btnscandocument']
                        for (let i = 0; i < a_btns.length; i++) {
                            o_temp = o_form.getButton(a_btns[i]);
                            if (o_temp) {
                                o_temp.setVisible(false);
                            }
                        }
                        let a_fields = ['custbody7', 'excludecommission', 'couponcode', 'promocode', 'discountitem']
                        for (let i = 0; i < a_fields.length; i++) {
                            if (a_fields[i] !== null) {
                                o_temp = o_form.getField(a_fields[i]);
                                if (o_temp) {
                                    o_temp.displayType = serverWidget.SublistDisplayType.HIDDEN;
                                }
                            }
                        }
                        let a_sublfields = ['custcol48', 'custcol49']
                        for (let i = 0; i < a_sublfields.length; i++) {
                            if (a_sublfields[i] !== null) {
                                o_temp = o_form.getSublist('item').getField(a_sublfields[i]);
                                if (o_temp) {
                                    o_temp.displayType = serverWidget.SublistDisplayType.HIDDEN;
                                }
                            }
                        }

                    } else {
                        let a_sublfields = ['amount', 'taxrate1', 'taxcode', 'location']
                        for (let i = 0; i < a_sublfields.length; i++) {
                            if (a_sublfields[i] !== null) {
                                o_temp = o_form.getSublist('item').getField(a_sublfields[i]);
                                if (o_temp) {
                                    o_temp.displayType = serverWidget.SublistDisplayType.HIDDEN;
                                }
                            }
                        }
                    }

                } catch (e) {
                    log.error('_xto_trailer_bl', e);
                }
            },
            //XTOTrailerUserEvent before submit
            _xto_trailer_bs: function (context) {
                let o_rec = context.newRecord;
                try {
                    o_rec.setValue('customform', 294);
                } catch (e) {
                    log.error('_xto_trailer_bs', e);
                }
            },
            //XTOTrailerUserEvent after submit
            _xto_trailer_as: function (context) {
                //let o_rec = context.newRecord;
                try {
                    log.debug('_xto_trailer_as', context.newRecord.id);
                    redirect.toSuitelet({
                        scriptId: '1388',
                        deploymentId: '1'
                    });
                } catch (e) {
                    log.error('_xto_trailer_as', e);
                }
            },
            //Show Hide Line Customer Codes
            _showhide_linecustomer: function (context) {
                let o_rec = context.newRecord;
                let o_form = context.form;
                let o_itemsublist = o_form.getSublist('item');
                const o_checkfields = [
                    { field: 'custcol102', check: 'custbody216' },
                    { field: 'custcol103', check: 'custbody217' },
                    { field: 'custcol104', check: 'custbody218' },
                    { field: 'custcol105', check: 'custbody219' },
                    { field: 'custcol106', check: 'custbody220' },
                    { field: 'custcol107', check: 'custbody221' },
                    { field: 'custcol108', check: 'custbody222' },
                    { field: 'custcol109', check: 'custbody223' },
                    { field: 'custcol110', check: 'custbody224' },
                    { field: 'custcol111', check: 'custbody225' }
                ];
                let o_temp;
                try {
                    if (o_itemsublist) {
                        for (let i = 0; i < o_checkfields.length; i++) {
                            o_temp = o_form.getSublist('item').getField(o_checkfields[i].field);
                            if (o_rec.getValue(o_checkfields[i].check) !== 'T' && o_temp) {
                                o_temp.displayType = serverWidget.SublistDisplayType.HIDDEN;
                            }
                        }
                    }
                } catch (e) {
                    log.error('_showhide_linecustomer', e);
                }
            },

            tjincATX_beforeSubmitSO: function (context) {
                let o_user = runtime.getCurrentUser();
                try {
                    log.debug('tjincATX_beforeSubmitSO', 'IN');
                    //DH - Salers Order - UE
                    this._dh_so_ue_bs(context);

                    this._transfer_orderproc(context,'salesorder');

                    this._linenumber(context);

                    //XTOTrailerUserEvent
                    if (o_user.roleCenter === s_customer_center || o_user.id === 6447 || o_user.id === 25918) {
                        this._xto_trailer_bs(context);
                    }
                } catch (e) {
                    log.error('tjincATX_beforeSubmitSO', e);
                }
            },

            tjincATX_beforeSubmitWO: function (context) {
                try {
                    log.debug('tjincATX_beforeSubmitWO', 'IN');
                    //DH - Salers Order - UE
                    this._dh_so_ue_bs(context);

                    this._transfer_orderproc(context,'workorder');
                } catch (e) {
                    log.error('tjincATX_beforeSubmitWO', e);
                }
            },

            tjincATX_afterSubmitSO: function (context) {
                let o_user = runtime.getCurrentUser();
                try {
                    if (context.type !== 'delete') {
                        let o_rec = record.load({ type: s_so, id: context.newRecord.id, isDynamic: false });
                        log.debug('tjincATX_afterSubmitSO', 'IN');
                        //WebStore Order Confermation Email
                        this._webstore_confirmationemail(o_rec);
                        //Signature save to file
                        o_rec = this._signaturesave_tofile(context, o_rec);
                        //POS Form 
                        o_rec = this._pos_form(context, o_rec);


                        //XTOTrailerUserEvent
                        if (o_user.roleCenter === s_customer_center || o_user.id === 6447 || o_user.id === 25918) {
                            this._xto_trailer_as(context);
                        }

                        o_rec.save({ enableSourcing: false, ignoreMandatoryFields: true });

                        //DH - Salers Order - UE after submit
                        this._dh_so_ue_as(context, 'salesorder');
                    }
                } catch (e) {
                    log.error('tjincATX_afterSubmitSO', e);
                }
            },

            tjincATX_afterSubmitWO: function (context) {
                try {
                    log.debug('tjincATX_afterSubmitWO', 'IN');
                    if (context.type !== 'delete') {
                        //DH - Salers Order - UE after submit
                        this._dh_so_ue_as(context,'workorder');
                    }
                } catch (e) {
                    log.error('tjincATX_afterSubmitWO', e);
                }
            },

            tjincATX_beforeLoadSO: function (context) {
                let o_rec = context.newRecord;
                let o_form = context.form;
                let o_user = runtime.getCurrentUser();
                try {
                    if (runtime.executionContext === 'USERINTERFACE') {
                        o_form.clientScriptModulePath = './TJINC_ATXNED_CS.js';

                        log.debug('tjincATX_beforeLoadSO', 'IN');
                        //Hide copy Button
                        this._hide_copybutton(context, o_rec);
                        //Hide Columns
                        this._hidecolumns(context, o_rec);
                        //SO_Create_beforeload
                        this._so_create(context, o_rec);

                        //XTOTrailerUserEvent before load
                        if (o_user.roleCenter === s_customer_center || o_user.id === 6447 || o_user.id === 25918) {
                            this._xto_trailer_bl(context);
                        }
                        //Show Hide Line Customer Codes
                        this._showhide_linecustomer(context);
                        log.debug('tjincATX_beforeLoadSO', 'OUT');
                    }
                } catch (e) {
                    log.error('tjincATX_beforeLoadSO', e);
                }
            }
        }
    });
