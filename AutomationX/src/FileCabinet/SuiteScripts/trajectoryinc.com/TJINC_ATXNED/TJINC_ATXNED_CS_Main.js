/**
 * @NApiVersion 2.x
 */

/**
 * Copyright (c) 2019 Trajectory Inc.
 * 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/*
 * @System: Automation X
 * @Module: Events
 * @Version: 1.0.0
 * @Company: Trajectory Inc.
 * @CreationDate: 20210210
 * @FileName: TJINC_ATXNED_CS_Main.js
 * @NamingStandard: TJINC_NSJ-2-1-0
*/
define(['N/runtime', 'N/url', 'N/record', 'N/search', 'N/http',
    '/SuiteBundles/Bundle 310544/TJINC_NS_Library_SS2.js'],
    function (runtime, url, record, search, http, tj) {
        var s_customer_center = 'CUSTOMER';
        var i_source_customercenter = 14;
        var i_avalara_tax = 9162;
        return {
            _enablebuttons: function () {
                for (var i = 0; i <= 16; i++) {
                    jQuery("#custformbutton_btn" + i + "").attr("disabled", false);
                }
            },

            _forcehold: function (context) {
                var o_rec = context.currentRecord;
                var a_columns, o_lf, o_temp, i;
                try {
                    if (o_rec.getValue({ fieldId: 'entity' })) {
                        a_columns = ['custentity149', 'custentity157', 'custentity158', 'custentity180', 'custentity187', 'custentity193', 'custentity251', 'custentity327', 'balance', 'unbilledorders', 'creditlimit', 'terms', 'custentity_req_wellsitename', 'custentity_req_wellnumber', 'custentity_req_accountingnumber', 'custentity_req_glaccount', 'custentity_req_techname', 'custentity_req_xtocode', 'custentity_req_plantcode', 'custentity_req_approverid', 'custentity_req_xto_reason_codes'];
                        o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue('entity'), type: record.Type.CUSTOMER.toLowerCase(), columns: a_columns }));
                        o_temp = {
                            axholdstatus: parseInt(o_lf.custentity327),
                            cbalance: o_lf.balance,
                            cunbilledorders: o_lf.unbilledorders,
                            ccreditlimit: o_lf.creditlimit,
                            thisordertotal: 0,
                            creditrem: 0,
                            holdmessage: '',
                            searchurl: ''
                        };

                        if (!o_rec.id) {
                            o_temp.thisordertotal = o_rec.getValue({ fieldId: 'total' });
                        }

                        o_temp.creditrem = parseInt(o_temp.ccreditlimit) - (parseInt(o_temp.cbalance) + parseInt(o_temp.cunbilledorders) + parseInt(o_temp.thisordertotal));

                        if (o_temp.axholdstatus === 3 || o_temp.axholdstatus === 4 || o_temp.axholdstatus === 9 || o_temp.creditrem < 0) {
                            o_temp.holdmessage = '<div> <font size="2" ><B>';
                            if (context.type === 'edit') {
                                o_temp.searchurl = '<tr><td nowrap="" height="15px" valign="top" ><input type="button" style ="border-radius: 3px; height:100%;  background-color:#F2F2F2;" value="Click to View Past Due Invoices" id="custformbutton_customscript350_9" name="custformbutton_customscript350_9" onclick="nsapiButtonCall(\'button\', \'customscript350\', \'viewpastdue\'); return false;" ></td></tr><br/>';
                            } else {
                                o_temp.searchurl = 'Click EDIT to view past due invoices.';
                            }


                            if (o_temp.creditrem < 0) {
                                o_temp.holdmessage += "Customer has exceeded credit limit. Order can not be fulfilled. Please contact accounting to discuss solutions. <br/><br/>";
                            }
                            if (o_temp.axholdstatus === 3) {
                                o_temp.holdmessage += 'Customer account is Past Due and has been placed on <u>SOFT CREDIT HOLD</u>.  Please contact accounting to lift the hold for the remanider of the day.<br/><br/>';
                                o_temp.holdmessage += o_temp.searchurl;
                            } else if (o_temp.axholdstatus === 4) {
                                o_temp.holdmessage += 'Customer account is Past Due and has been placed on <u>CREDIT HOLD</u>. Please resolve outstanding invoces before processing order.<br/><br/>';
                                o_temp.holdmessage += o_temp.searchurl;
                            } else if (o_temp.axholdstatus === 9) {
                                o_temp.holdmessage += 'Customer account is Past Due and has been placed on <u>HARD CREDIT HOLD</u>. Please contact accounting.<br/><br/>';
                                o_temp.holdmessage += o_temp.searchurl;
                            }

                            o_temp.holdmessage += "</b></font></div >";
                            window.nlapiSetFieldValue('custbody172', o_temp.holdmessage);
                            //o_rec.setValue('custbody172', o_temp.holdmessage);
                        }

                        //don't reset these if field has value
                        o_temp.approverid = o_rec.getValue({ fieldId: 'custbody73' });
                        if (o_temp.plantcode == '') {
                            o_rec.setValue({ fieldId: 'custbody73', value: o_lf.custentity158 });
                        }
                        o_temp.plantcode = o_rec.getValue({ fieldId: 'custbody69' });
                        if (o_temp.plantcode == '') {
                            o_rec.setValue({ fieldId: 'custbody69', value: o_lf.custentity157 });
                        }

                        //if(o_rec.getValue('terms') !== 8){
                        //   o_rec.setValue({ fieldId:'terms', value: o_lf.terms});
                        //    o_rec.setValue({ fieldId:'creditcard', value: ''});
                        //}
                        o_temp = [
                            { cusfield: 'custentity_req_wellsitename', ordfield: 'custbody8' },
                            { cusfield: 'custentity_req_wellnumber', ordfield: 'custbody9' },
                            { cusfield: 'custentity_req_accountingnumber', ordfield: 'custbody10' },
                            { cusfield: 'custentity_req_glaccount', ordfield: 'custbody74' },
                            { cusfield: 'custentity_req_techname', ordfield: 'custbody38' },
                            { cusfield: 'custentity_req_xtocode', ordfield: 'custbody11' },
                            { cusfield: 'custentity_req_plantcode', ordfield: 'custbody69' },
                            { cusfield: 'custentity_req_approverid', ordfield: 'custbody73' },
                            { cusfield: 'custentity_req_xto_reason_codes', ordfield: 'custbody67' },
                            { cusfield: 'custentity187', ordfield: 'custbody7' },
                            { cusfield: 'custentity193', ordfield: 'otherrefnum' }
                        ];
                        var s_req = 'Required', s_cusfield, s_ordfield;
                        for (i = 0; i < o_temp.length; i++) {
                            s_cusfield = o_lf[o_temp[i].cusfield];
                            s_ordfield = o_rec.getValue({ fieldId: o_temp[i].ordfield });
                            if (s_cusfield === s_req) {
                                o_rec.setValue({ fieldId: o_temp[i].cusfield, value: '' });
                            }
                            if (s_ordfield === s_req) {
                                o_rec.setValue({ fieldId: o_temp[i].ordfield, value: '' });
                            }
                            if (o_rec.getValue({ fieldId: o_temp[i].cusfield }) === 'T' && o_lf[o_temp[i].cusfield] === '') {
                                o_rec.setValue({ fieldId: o_temp[i].ordfield, value: s_req });
                            }
                        }
                        //o_rec.setText({ fieldId:'custbody36', text: ''});
                        o_rec.setValue({ fieldId: 'class', value: o_lf.custentity149 });
                        o_rec.setValue({ fieldId: 'location', value: o_lf.custentity180 });
                        //o_rec.setValue({ fieldId:'custbody36', value: o_lf.custentity251});
                    }
                } catch (e) {
                    log.error('_forcehold', e);
                }
            },
            //SO_onsave
            _trim: function (stringToTrim) {
                return stringToTrim.replace(/^\s+|\s+$/g, "");
            },
            //SO_onsave
            _is_int: function (value) {
                if ((parseFloat(value) === parseInt(value)) && !isNaN(value)) {
                    return true;
                } else {
                    return false;
                }
            },
            //Signature
            _signature: function (context) {
                var o_rec = context.currentRecord;
                var o_piccode;
                try {
                    if (context.type !== 'delete') {
                        o_piccode = window.sessionStorage.sigpic;
                        window.sessionStorage.sigpic = '';
                        if (o_piccode) {
                            o_rec.setValue({ fieldId: 'custbody140', value: o_piccode, ignoreFieldChange: true });
                            return true;
                        }
                    }
                    return true;
                } catch (e) {
                    log.error('_signature', e);
                    return true;
                }
            },
            //SO_fieldChanged post sourcing
            _so_fieldchange_psource: function (context) {
                var o_rec = context.currentRecord;
                var i_lineitem, i_customer, i_parent, i_location, o_lf, o_cust_obj, s_desc, s_itemtype, s_leadtimevalue, o_item_search;
                try {
                    if (context.fieldId === 'item' && o_rec.getValue('customform') !== 303) {
                        i_lineitem = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });//uid
                        i_customer = o_rec.getValue('entity'); //custn 
                        if (i_customer) {
                            o_lf = tj.lookupFields(search.lookupFields({ id: i_customer, type: record.Type.CUSTOMER.toLowerCase(), columns: ['parent'] }));
                            i_parent = o_lf.parent;

                            if (i_parent) {
                                i_customer = i_parent;
                            }

                            if (i_lineitem) {
                                var o_formulacol = search.createColumn({
                                    name: "formulatext",
                                    formula: "'Customer Part #:' ||  {custrecord161} ||case when {custrecord162} IS NOT NULL THEN '  Contract Line#:' || {custrecord162}else NULL END"
                                });
                                var o_custom_search = tj.searchAll({
                                    'search': search.create({
                                        type: 'customrecord455',
                                        filters: [
                                            ["custrecord159", "anyof", i_lineitem], "AND",
                                            ["custrecord160", "anyof", i_customer]
                                        ],
                                        columns: [
                                            o_formulacol
                                        ]
                                    })
                                });

                                if (o_custom_search.length > 0) {
                                    log.debug('Search item: ' + i_lineitem + '  Customer: ' + i_customer, o_custom_search[0].getValue(o_formulacol));
                                    s_desc = '';
                                    s_desc = o_rec.getCurrentSublistValue({ fieldId: 'description', sublistId: 'item', ignoreFieldChange: true });
                                    s_desc = s_desc + '\n\n' + o_custom_search[0].getValue(o_formulacol);
                                    o_rec.setCurrentSublistValue({ fieldId: 'description', sublistId: 'item', value: s_desc, ignoreFieldChange: true });
                                }
                            }
                        }

                        s_itemtype = o_rec.getCurrentSublistValue({ fieldId: 'itemtype', sublistId: 'item' });
                        i_location = o_rec.getValue('location');

                        if (s_itemtype === 'InvtPart' && i_location) {

                            var o_col_0 = search.createColumn({
                                name: "formulanumeric",
                                summary: search.Summary.SUM,
                                formula: "CASE WHEN {inventorylocation.internalid} =" + i_location + "THEN {locationquantityavailable} ELSE NULL END"
                            });
                            var o_col_1 = search.createColumn({
                                name: "locationquantityavailable",
                                summary: search.Summary.SUM
                            });
                            var o_col_2 = search.createColumn({
                                name: "custitem69",
                                summary: search.Summary.GROUP
                            });
                            var o_col_3 = search.createColumn({
                                name: "formulanumeric",
                                summary: search.Summary.AVG,
                                formula: "CASE WHEN {inventorylocation.internalid} =" + i_location + "THEN {locationleadtime} ELSE NULL END"
                            });
                            var o_col_4 = search.createColumn({
                                name: "formulanumeric",
                                summary: search.Summary.GROUP,
                                formula: "CASE WHEN {inventorylocation.internalid} =" + i_location + "THEN {inventorylocation} ELSE NULL END"
                            });

                            o_item_search = tj.searchAll({
                                'search': search.create({
                                    type: 'item',
                                    filters: [
                                        ["internalidnumber", "equalto", i_lineitem], "AND",
                                        ["inventorylocation.custrecord17", "is", "T"], "AND",
                                        ["type", "anyof", "InvtPart", "Assembly"]
                                    ],
                                    columns: [
                                        o_col_0,
                                        o_col_1,
                                        o_col_2,
                                        o_col_3,
                                        o_col_4
                                    ]
                                })
                            });

                            if (o_item_search.length > 0) {
                                o_lf = tj.lookupFields(search.lookupFields({ id: i_customer, type: record.Type.INVENTORY_ITEM.toLowerCase(), columns: ['custitem82'] }));

                                o_cust_obj = {
                                    avalocal: o_item_search[0].getValue(o_col_0),
                                    avacompany: o_item_search[0].getValue(o_col_1),
                                    overstock: o_item_search[0].getValue(o_col_2),
                                    locationlead: o_item_search[0].getValue(o_col_3),
                                    inventorylocation: o_item_search[0].getValue(o_col_4),
                                    lineqty: o_rec.getCurrentSublistValue({ fieldId: 'quantity', sublistId: 'item' }),
                                    itemreavglead: Math.round(o_lf.custitem82)
                                };
                                if (o_cust_obj.locationlead > 0) {
                                    s_leadtimevalue = o_cust_obj.locationlead;
                                } else if (o_cust_obj.itemreavglead) {
                                    s_leadtimevalue = o_cust_obj.itemreavglead;
                                } else {
                                    s_leadtimevalue = null;
                                }

                                if ((o_cust_obj.avalocal * 1) >= (o_cust_obj.lineqty * 1)) {
                                    s_leadtimevalue = 'Local Availability';
                                }
                                else if (o_cust_obj.avalocal > 0 && o_cust_obj.avacompany >= o_cust_obj.lineqty) {
                                    s_leadtimevalue = 'Partial Local Availability / Remainder Available to Ship';
                                }
                                else if (o_cust_obj.avalocal > 0 && o_cust_obj.avacompany === o_cust_obj.avalocal && (o_cust_obj.avacompany * 1) < (o_cust_obj.lineqty * 1)) {
                                    s_leadtimevalue = 'Partial Local Availability /' + s_leadtimevalue + ' Days On Remaining';
                                }

                                else if ((o_cust_obj.avacompany * 1) >= (o_cust_obj.lineqty * 1) && o_cust_obj.avalocal < .01) {
                                    s_leadtimevalue = 'Available to Ship';
                                }
                                else if (o_cust_obj.avacompany > 0 && o_cust_obj.avacompany < o_cust_obj.lineqty) {
                                    s_leadtimevalue = 'Partial Avalibility to Ship/ ' + s_leadtimevalue + ' Days On Remaining';
                                }
                                else if (o_cust_obj.locationlead > 0) {
                                    s_leadtimevalue = o_cust_obj.locationlead + ' Days';
                                }
                                else if (s_leadtimevalue > 0) {
                                    s_leadtimevalue += " Days";
                                }
                                else {
                                    s_leadtimevalue = '';
                                }
                                o_rec.setCurrentSublistValue({ fieldId: 'custcol83', sublistId: 'item', value: s_leadtimevalue });

                            }
                        }
                    }
                } catch (e) {
                    log.error('_so_fieldchange_psource', e);
                }
            },
            //SO_fieldChanged field change
            _so_fieldchange_fchange: function (context) {
                var o_rec = context.currentRecord;
                var o_lf, o_temp, i;
                try {
                    if (context.fieldId === 'custbody173') {
                        o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue('custbody173'), type: record.Type.CONTACT.toLowerCase(), columns: ['custentity356'] }));
                        o_temp = o_lf.custentity356;
                        if (o_temp) {
                            o_rec.setValue({ fieldId: 'custbody73', value: o_temp });
                        }
                    } else if (context.fieldId === 'custbody226' && o_rec.getValue('custbody226')) {
                        var a_lf_field = ['custrecord265', 'custrecord266', 'custrecord267', 'custrecord268', 'custrecord269', 'custrecord270', 'custrecord271', 'custrecord272', 'custrecord273', 'custrecord274'];
                        o_temp = [
                            { field: 'custrecord265', setfield: 'custbody38' },
                            { field: 'custrecord266', setfield: 'custbody8' },
                            { field: 'custrecord267', setfield: 'custbody9' },
                            { field: 'custrecord268', setfield: 'custbody10' },
                            { field: 'custrecord269', setfield: 'custbody69' },
                            { field: 'custrecord270', setfield: 'custbody73' },
                            { field: 'custrecord271', setfield: 'custbody11' },
                            { field: 'custrecord272', setfield: 'custbody67' },
                            { field: 'custrecord273', setfield: 'custbody74' },
                            { field: 'custrecord274', setfield: 'custbody87' }
                        ];

                        o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue('custbody173'), type: 'customrecord665', columns: a_lf_field }));
                        for (i = 0; i < o_temp.length; i++) {
                            o_rec.setValue(o_temp[i].setfield, o_lf[o_temp[i].field]);
                        }
                    } else if (context.fieldId === 'custbody216') {
                        o_rec.setValue({ fieldId: 'custbody38', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol102', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody217') {
                        o_rec.setValue({ fieldId: 'custbody8', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol103', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody218') {
                        o_rec.setValue({ fieldId: 'custbody9', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol104', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody219') {
                        o_rec.setValue({ fieldId: 'custbody10', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol105', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody220') {
                        o_rec.setValue({ fieldId: 'custbody69', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol106', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody221') {
                        o_rec.setValue({ fieldId: 'custbody73', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol107', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody222') {
                        o_rec.setValue({ fieldId: 'custbody11', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol108', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody223') {
                        o_rec.setValue({ fieldId: 'custbody67', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol109', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody224') {
                        o_rec.setValue({ fieldId: 'custbody74', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol110', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'custbody225') {
                        o_rec.setValue({ fieldId: 'custbody87', value: '' });
                        for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                            o_rec.selectLine({ sublistId: 'item', line: i });
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol111', value: '' });
                            o_rec.commitLine({ sublistId: 'item' });
                        }
                    } else if (context.fieldId === 'isclosed') {
                        var i_lineid = o_rec.getCurrentSublistValue({ fieldId: 'line', sublistId: 'item' });
                        if (o_rec.id && o_rec.getCurrentSublistValue({ fieldId: 'isclosed', sublistId: 'item' }) === 'T') {

                            var o_so_search = tj.searchAll({
                                'search': search.create({
                                    type: 'salesorder',
                                    filters: [
                                        ["type", "anyof", "SalesOrd"], "AND",
                                        ["mainline", "is", "F"], "AND",
                                        ["internalidnumber", "equalto", o_rec.id], "AND",
                                        ["line", "equalto", i_lineid]
                                    ],
                                    columns: ['quantitypicked', 'quantitypacked']
                                })
                            });
                            var i_qtypicked = o_so_search[0].getValue('quantitypicked');
                            var i_qtyPacked = o_so_search[0].getValue('quantitypacked');
                            var s_statusmessage = '\n\n Quantity Pulled: ' + i_qtypicked + '\n Quantity PickPacked:  ' + i_qtyPacked + '\n Quantity Fulfilled:  ' + o_rec.getCurrentSublistValue({ fieldId: 'quantityfulfilled', sublistId: 'item' }) + '\n Quantity Invoiced:  ' + o_rec.getCurrentSublistValue({ fieldId: 'quantitybilled', sublistId: 'item' });
                            if (i_qtyPacked > o_rec.getCurrentSublistValue({ fieldId: 'quantitybilled', sublistId: 'item' })) {
                                tj.alert('This line has a quantity fulfilled greater than billed so cannot be closed.  Please finish processing the shipped quantity before closing. ' + s_statusmessage);
                                o_rec.setCurrentSublistValue({ value: 'F', fieldId: 'isclosed', sublistId: 'item' });
                            } else if (i_qtypicked <= 0 || !i_qtypicked) {
                                o_rec.setCurrentSublistValue({ value: 0, fieldId: 'quantity', sublistId: 'item' });
                                tj.alert('This line has been closed and the quantity set to 0.');
                            } else {
                                o_rec.setCurrentSublistValue({ value: i_qtypicked, fieldId: 'quantity', sublistId: 'item' });
                                tj.alert('This line has been closed and the quantity set to the quantity Invoiced.')
                            }
                        }
                    } else if (context.fieldId === 'costestimatetype') {
                        if (o_rec.getCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item' }) === 'CUSTOM') {
                            tj.alert('Please enter the unit cost into EST. EXTENDED COST field. ');
                        }
                    } else if (context.fieldId === 'costestimate') {
                        var i_newcost = o_rec.getCurrentSublistValue({ fieldId: 'quantity', sublistId: 'item' }) * parseFloat((o_rec.getCurrentSublistValue({ fieldId: 'costestimate', sublistId: 'item' }).replace(' ', '')));
                        o_rec.setCurrentSublistValue({ value: i_newcost, fieldId: 'costestimate', sublistId: 'item' });
                    } else if (context.fieldId == 'custcol114') {
                        var itemID = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item'
                        });
                        var fromLocation = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol114'
                        });
                        if (itemID != '' && fromLocation != '') {
                            var itemAvail = 0;
                            var filters = [];
                            var itemFilter = ['internalid', 'anyof'];
                            itemFilter.push(itemID.toString());
                            var locationFilter = ['inventorylocation', 'anyof'];
                            locationFilter.push(fromLocation.toString());
                            var fullFilter = [];
                            fullFilter.push(itemFilter);
                            fullFilter.push('AND');
                            fullFilter.push(locationFilter);
                            filters.push(fullFilter);
        
                            search.create({
                                type: 'item',
                                filters: filters,
                                columns: [
                                    'inventorylocation',
                                    'locationquantityavailable'
                                ]
                            }).run().each(function (result) {
                                itemAvail = +result.getValue(result.columns[1])
                                return true;
                            });
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol115',
                                value: itemAvail
                            });
                        } else {
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol115',
                                value: ''
                            });
                        }
                    } else if (context.fieldId == 'custcol90') {
                        var customer = o_rec.getValue('entity');
                        var custOnHold = false;
                        if (customer) {
                            var custLookup = tj.lookupFields(search.lookupFields({ id: customer, type: record.Type.CUSTOMER.toLowerCase(), columns: ['custentity327'] }));
                            var custHoldStatus = custLookup.custentity327;
                            if (custHoldStatus == '4' || custHoldStatus == '9') {
                                custOnHold = true;
                            }
                        }
                        //if customer is on hold, prevent user from setting purchase request field
                        if (custOnHold) {
                            tj.alert('You are attempting to source inventory for a customer who is on hold.  Please reach out to Accounting to get the customer off hold before sourcing product for them.');
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol90',
                                value: '',
                                ignoreFieldChange: true
                            });
                        }
                        var itemID = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item'
                        });
                        var itemLookup = search.lookupFields({
                            type: search.Type.ITEM,
                            id: itemID,
                            columns: ['custitem122','custitem123']
                        });
                        var doNotPurchase = itemLookup.custitem122;
                        if (doNotPurchase) {
                            tj.alert('You are attempting to submit a PR for an item marked as Do Not Purchase.  Please reach out to Sourcing/Purchasing to get the item updated or provide a different item for your sales order.');
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol90',
                                value: '',
                                ignoreFieldChange: true
                            });
                        }
                        var approvalRequired = itemLookup.custitem123;
                        if (approvalRequired) {
                            tj.alert('You are submitting a PR for an item marked as Approval Required.  Please provide details in the notes, otherwise your PR will be rejected.');
                        }
                    } 
                    if (context.fieldId == 'custcol90' || context.fieldId == 'custcol118') {
                        var prType = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol90'
                        });
                        var prVendor = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol118'
                        });
                        //if credit card PO and pr vendor is blank or another vendor, always reset to cc tracker vendor
                        // alert(prType + ' | ' + prVendor);
                        if (prType == '6' && prVendor != '2491') {
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol118',
                                value: '2491'
                            });
                        }
                    } else if (context.fieldId === 'custcol90' && o_rec.getCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item' }) !== '') {
                        o_temp = {
                            stockrequest: o_rec.getCurrentSublistValue({ fieldId: 'custcol91', sublistId: 'item' }),
                            relatedrecord: o_rec.getCurrentSublistValue({ fieldId: 'custcol74', sublistId: 'item' }),
                            lineclosed: o_rec.getCurrentSublistValue({ fieldId: 'isclosed', sublistId: 'item' }),
                            linetype: o_rec.getCurrentSublistValue({ fieldId: 'itemtype', sublistId: 'item' }),
                            hasLocation: o_rec.getCurrentSublistValue({ fieldId: 'location', sublistId: 'item' }),
                            hasvendor: o_rec.getCurrentSublistValue({ fieldId: 'custcol118', sublistId: 'item' }),
                            custcol90: o_rec.getCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item' })
                        };

                        if (o_temp.linetype === 'Assembly' && o_temp.custcol90 !== 5) {
                            tj.alert('You are attempting to create a purchase order for a Assembly item.  Please save your sales order and create a workorder after saving.');
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: '' })
                            return;
                        }
                        // if (o_temp.linetype === 'NonInvtPart') {
                        //     tj.alert('You are attempting to create a purchase order or transfer order for a Non Inventory item.  If you would like to purchase a direct item, please create a standalone purchase request and add the necessary details there.');
                        //     o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: '' })
                        //     return;
                        // }
                        if (o_rec.getCurrentSublistValue({ fieldId: 'item', sublistId: 'item' }) !== 1277) {
                            if (!o_temp.hasLocation) {
                                tj.alert("Please Select a Location for this line before attempting to create a PO.");
                                o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: '' })
                                return;
                            }
                            if (!o_temp.hasvendor && o_temp.linetype !== 'Assembly') {
                                tj.alert("Please Select a Vendor for this line before attempting to create a PO.");
                                o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: '' })
                                return;
                            }

                        }

                        if (o_temp.stockrequest && o_temp.lineclosed === 'F') {
                            o_lf = tj.lookupFields(search.lookupFields({ id: o_temp.stockrequest, type: 'customrecord463', columns: ['custrecord214'] }));
                            if (o_lf.custrecord214 !== 3) {
                                tj.alert('This line is already associated with a Purchase Order/Request or Work Order.');
                            }
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: '' })

                        } else if ((o_temp.relatedrecord || o_temp.lineclosed !== 'T') && o_temp.linetype === 'Assembly' && o_temp.custcol90 !== 5) {
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: 1 })
                        } else if (o_temp.relatedrecord || o_temp.lineclosed === 'T' && (o_temp.linetype !== 'InvtPart' || o_temp.linetype !== 'Service' || o_temp.linetype !== 'Assembly')) {
                            tj.alert('This line is already associated with a Purchase Order/Request, Work Order, the line is closed or the item type is not supported.');
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol90', sublistId: 'item', value: '' })
                        }

                        /*}else if(context.fieldId === 'custrecord187'){
                            o_rec.setCurrentSublistValue({ fieldId: 'custrecord192', sublistId: 'recmachcustrecord221' , value: o_rec.getValue({ fieldId:'location'})});
                            o_rec.setCurrentSublistValue({ fieldId: 'custrecord203', sublistId: 'recmachcustrecord221' , value: o_rec.getValue({ fieldId:'class'})});
                            o_rec.setCurrentSublistValue({ fieldId: 'custrecord202', sublistId: 'recmachcustrecord221' , value: o_rec.getText({ fieldId:'entity'})});
                        
                        
                        }else if(context.fieldId === 'custrecord192'){
                            var i_adjleadtime = 0;
                            var i_location = o_rec.getCurrentSublistValue({ fieldId: 'custrecord187', sublistId: 'recmachcustrecord221' });
                            var i_items = o_rec.getCurrentSublistValue({ fieldId: 'custrecord192', sublistId: 'recmachcustrecord221' });
                            a_columns = [        
                                search.createColumn({ name: "locationpreferredstocklevel", summary: "MAX"}),
                                search.createColumn({ name: "locationquantityonhand", summary: "MAX"}),
                                search.createColumn({ name: "locationquantitycommitted", summary: "MAX"}),
                                search.createColumn({ name: "locationquantityavailable", summary: "MAX"}),
                                search.createColumn({ name: "locationquantitybackordered", summary: "MAX"}),
                                search.createColumn({ name: "locationquantityonorder", summary: "MAX"}),
                                search.createColumn({ name: "locationpreferredstocklevel", summary: "MAX"}),
                                search.createColumn({ name: "locationquantityintransit", summary: "MAX"}),
                                search.createColumn({ name: "formulanumeric", summary: "SUM", formula: "CASE WHEN ({transaction.location}= {inventorylocation} ) THEN  {transaction.quantity}/3 ELSE NULL END"}),
                                search.createColumn({ name: "custitem_tjinc_averagedemand", summary: "AVG"}),
                                search.createColumn({ name: "custitem_tjinc_monthsonhand", summary: "AVG"}),
                                search.createColumn({ name: "quantityavailable", summary: "AVG"}),
                                search.createColumn({ name: "locationleadtime", summary: "MAX"}),
                                search.createColumn({ name: "leadtime", summary: "MAX"}),
                                search.createColumn({ name: "custitem35", summary: "GROUP"}),
                                search.createColumn({ name: "vendor", summary: "GROUP"}),
                                search.createColumn({ name: "cost", summary: "MAX"})
                            ];
                            o_item_search = tj.searchAll({
                                'search': search.create({
                                    type: 'item',
                                    filters: [
                                        [   
                                            ["locationquantityonhand", "greaterthan", "0"],"OR", 
                                            ["locationpreferredstocklevel", "greaterthan", "0"],"OR", 
                                            ["locationquantityonorder", "greaterthan", "0"],"OR", 
                                            ["inventorylocation.custrecord17", "is", "T"]
                                        ],"AND",
                                        [
                                            ["transaction.type", "anyof", "SalesOrd"],"AND", 
                                            ["transaction.mainline", "is", "F"],"AND", 
                                            ["transaction.trandate", "onorafter", "daysago90"]
                                        ],"AND",
                                        ["inventorylocation", "anyof", i_location],"AND",
                                        ["internalidnumber", "equalto", i_items]
                                    ],
                                    columns: a_columns
                                })
                            });
                            if(o_item_search.length > 0){
                                o_temp = {
                                    lava: o_item_search[0].getValue(a_columns[3]) || 0,
                                    fivecode: o_item_search[0].getValue(a_columns[13]) || '',
                                    locleadtime: o_item_search[0].getValue(a_columns[11]) || 0,
                                    leadtime: o_item_search[0].getValue(a_columns[12]) || 0, 
                                    avademand: o_item_search[0].getValue(a_columns[8]) || 0,
                                    locavademand: Math.round(o_item_search[0].getValue(a_columns[7])) || 0,
                                    prefvendor: o_item_search[0].getValue(a_columns[14]) || '',
                                    loconorder: o_item_search[0].getValue(a_columns[5]),
                                    itempp: o_item_search[0].getValue(a_columns[15])
                
                                };
                                i_adjleadtime = o_temp.locleadtime || o_temp.leadtime;
                
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord188', sublistId: 'recmachcustrecord221', value: o_temp.fivecode});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord193', sublistId: 'recmachcustrecord221', value: o_temp.locavademand});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord191', sublistId: 'recmachcustrecord221', value: o_temp.avademand});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord195', sublistId: 'recmachcustrecord221', value: i_adjleadtime});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord197', sublistId: 'recmachcustrecord221', value: o_temp.prefvendor});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord209', sublistId: 'recmachcustrecord221', value: o_temp.lava});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord217', sublistId: 'recmachcustrecord221', value: o_temp.loconorder});
                                o_rec.getCurrentSublistValue({ fieldId: 'custrecord220', sublistId: 'recmachcustrecord221', value: o_temp.itempp});
                                return;
                            }else{
                                a_columns = [        
                                    search.createColumn({ name: "locationpreferredstocklevel", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantityonhand", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantitycommitted", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantityavailable", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantitybackordered", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantityonorder", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantityintransit", summary: "MAX"}),
                                    search.createColumn({ name: "locationquantityintransit", summary: "MAX"}),
                                    search.createColumn({ name: "custitem_tjinc_averagedemand", summary: "AVG"}),
                                    search.createColumn({ name: "custitem_tjinc_monthsonhand", summary: "AVG"}),
                                    search.createColumn({ name: "quantityavailable", summary: "AVG"}),
                                    search.createColumn({ name: "locationleadtime", summary: "MAX"}),
                                    search.createColumn({ name: "leadtime", summary: "MAX"}),
                                    search.createColumn({ name: "custitem35", summary: "GROUP"}),
                                    search.createColumn({ name: "vendor", summary: "GROUP"})
                                ];
                
                                var o_itemdemand_search = tj.searchAll({
                                    'search': search.create({
                                        type: 'item',
                                        filters: [
                                            ["inventorylocation", "anyof", i_location],"AND",
                                            ["internalidnumber", "equalto", i_items]
                                        ],
                                        columns: a_columns
                                    })
                                });
                                if (o_itemdemand_search.length > 0){
                                    o_temp = {
                                        lava: o_item_search[0].getValue(a_columns[3]) || 0,
                                        fivecode: o_item_search[0].getValue(a_columns[13]) || '',
                                        locleadtime: o_item_search[0].getValue(a_columns[11]) || 0,
                                        leadtime: o_item_search[0].getValue(a_columns[12]) || 0, 
                                        avademand: o_item_search[0].getValue(a_columns[8]) || 0,
                                        locavademand: 0,
                                        prefvendor: o_item_search[0].getValue(a_columns[14]) || ''
                                    };
                                    i_adjleadtime = o_temp.locleadtime || o_temp.leadtime;
                                    o_rec.getCurrentSublistValue({ fieldId: 'custrecord188', sublistId: 'recmachcustrecord221', value: o_temp.fivecode});
                                    o_rec.getCurrentSublistValue({ fieldId: 'custrecord193', sublistId: 'recmachcustrecord221', value: o_temp.locavademand});
                                    o_rec.getCurrentSublistValue({ fieldId: 'custrecord191', sublistId: 'recmachcustrecord221', value: o_temp.avademand});
                                    o_rec.getCurrentSublistValue({ fieldId: 'custrecord195', sublistId: 'recmachcustrecord221', value: i_adjleadtime});
                                    o_rec.getCurrentSublistValue({ fieldId: 'custrecord197', sublistId: 'recmachcustrecord221', value: o_temp.prefvendor});
                                    o_rec.getCurrentSublistValue({ fieldId: 'custrecord209', sublistId: 'recmachcustrecord221', value: o_temp.lava});
                                    return;
                
                                }
                            }
                        */
                    } else if (context.fieldId === 'ccnumber') {
                        if (o_rec.getValue({ fieldId: 'ccnumber' })) {
                            o_rec.setValue({ fieldId: 'terms', value: 8 });
                            o_rec.getField({ fieldId: 'ccsecuritycode' }).isMandatory = true;
                        } else {
                            if (o_rec.getValue('entity')) {
                                o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue('entity'), type: record.Type.CUSTOMER.toLowerCase(), columns: ['terms'] }));
                                o_rec.setValue({ fieldId: 'terms', value: o_lf.terms });
                            }
                        }
                    } else if (context.fieldId === 'item' && o_rec.getValue('customform') !== 303) {
                        var i_linecount = o_rec.getLineCount('item');
                        /*
                        o_temp = [
                            { getfield: 'custcol102', checkfield: 'custbody216'},
                            { getfield: 'custcol103', checkfield: 'custbody217'},
                            { getfield: 'custcol104', checkfield: 'custbody218'},
                            { getfield: 'custcol105', checkfield: 'custbody219'},
                            { getfield: 'custcol106', checkfield: 'custbody220'},
                            { getfield: 'custcol107', checkfield: 'custbody221'},
                            { getfield: 'custcol108', checkfield: 'custbody222'},
                            { getfield: 'custcol109', checkfield: 'custbody223'},
                            { getfield: 'custcol110', checkfield: 'custbody224'},
                            { getfield: 'custcol111', checkfield: 'custbody225'}
                        ];
                        var i_currIndex = o_rec.getCurrentSublistIndex({ sublistId: 'item' });
                        for(i = 0;i < o_temp.length;i++){

                            o_fieldtemp = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: o_temp[i].getfield});
                            o_rec.commitLine({ sublistId: 'item' });
                            if(o_rec.getValue(o_temp[i].checkfield) === 'T'){
                                o_rec.selectLine({ sublistId: 'item', line: i_currIndex });
                                o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: o_temp[i].getfield, value: o_fieldtemp})
                                o_rec.commitLine({ sublistId: 'item' });
                            }
                            
                        }
                        o_rec.selectLine({ sublistId: 'item', line: i_currIndex });

                        o_fieldtemp = o_rec.getCurrentSublistText({ fieldId: 'item', sublistId: 'item'}).indexOf('New Item');
                        if (o_fieldtemp !== -1 && o_rec.type.toLowerCase() !== 'estimate') {
                            tj.alert("You are attempting to add a quick add item. Quick Item add is only available from a quote. Please add items to a quote and convert to a Sales Order.");
                            o_rec.setCurrentSublistValue({ fieldId: 'item', sublistId: 'item', value: null});
                            return;
                        }
                        */
                        o_rec.setCurrentSublistValue({ fieldId: 'location', sublistId: 'item', value: o_rec.getValue('location') });
                        var i_val = '';
                        if (o_rec.getCurrentSublistValue({ fieldId: 'custcol_linenumber', sublistId: 'item' }).indexOf("ES") !== -1) {
                            i_val = parseInt((o_rec.getCurrentSublistValue({ fieldId: 'custcol_linenumber', sublistId: 'item' })).split('-')[0]);
                            i_val++;
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol_linenumber', sublistId: 'item', value: i_val + '-ES' });
                        } else {
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol_linenumber', sublistId: 'item', value: parseInt(i_linecount) + 1 });
                        }



                        /*}else if(context.fieldId === 'quantity' && o_rec.getValue('customform') !== 303){
                            var s_itemType = o_rec.getCurrentSublistValue({ fieldId: 'itemtype', sublistId: 'item'});
                            var i_itemid = o_rec.getCurrentSublistValue({ fieldId: 'item', sublistId: 'item'});
                            a_columns = [   
                                search.createColumn({ name: "formulanumeric", summary: "SUM", formula: 'CASE WHEN {inventorylocation.internalid} =' + o_rec.getValue('location') + 'THEN {locationquantityavailable} ELSE NULL END'}),
                                search.createColumn({ name: "locationquantityavailable", summary: "SUM"}),
                                search.createColumn({ name: "custitem69", summary: "GROUP"}),
                                search.createColumn({ name: "formulanumeric", summary: "AVG", formula: 'CASE WHEN {inventorylocation.internalid} =' + o_rec.getValue('location') + 'THEN {locationleadtime} ELSE NULL END'}),
                                search.createColumn({ name: "formulanumeric", summary: "GROUP", formula: 'CASE WHEN {inventorylocation.internalid} =' + o_rec.getValue('location') + 'THEN {inventorylocation} ELSE NULL END'})
                            ];
                
                            /*if(s_itemType === 'InvtPart' && o_rec.type.toLowerCase() === 'estimate'){
                                o_item_search = tj.searchAll({
                                    'search': search.create({
                                        type: 'item',
                                        filters: [
                                            ['internalidnumber', 'equalto',i_itemid ],'AND',
                                            ['custrecord17.inventorylocation', 'is', 'T'],'AND',
                                            ['type', 'anyof', 'InvtPart','Assembly']
                                        ],
                                        columns: a_columns
                                    })
                                });
                                if(o_item_search.length > 0){
                                    o_lf = tj.lookupFields(search.lookupFields({ id: i_itemid, type: 'inventoryitem', columns: ['custitem82'] }));
                                    o_temp = {
                                        avalocal: o_item_search[0].getValue(a_columns[0]),
                                        avacompany: o_item_search[0].getValue(a_columns[1]),
                                        overstock: o_item_search[0].getValue(a_columns[2]),
                                        locationlead: o_item_search[0].getValue(a_columns[3]), 
                                        inventorylocation: o_item_search[0].getValue(a_columns[4]),
                                        lineqty: o_rec.getCurrentSublistValue({ fieldId: 'quantity', sublistId: 'item'}),
                                        itemreavglead: Math.round(o_lf.custitem82),
                                        leadtimevalue: ''
                                    };
                            
                                    if (o_temp.locationlead > 0){ 
                                        o_temp.leadtimevalue = o_temp.locationlead; 
                                    }else if(o_temp.itemreavglead){ 
                                        o_temp.leadtimevalue = o_temp.itemreavglead; 
                                    }else{ 
                                        o_temp.leadtimevalue = null; 
                                    }
                
                
                                    if ((o_temp.avalocal * 1) >= (o_temp.lineqty * 1)) {
                                        o_temp.leadtimevalue = 'Local Availability';
                                    }
                                    else if (o_temp.avalocal > 0 && o_temp.avacompany >= o_temp.lineqty) {
                                        o_temp.leadtimevalue = 'Partial Local Availability / Remainder Available to Ship';
                                    }
                                    else if (o_temp.avalocal > 0 && o_temp.avacompany === o_temp.avalocal && (o_temp.avacompany * 1) < (o_temp.lineqty * 1)) {
                                        o_temp.leadtimevalue = 'Partial Local Availability /' + o_temp.locationlead + ' Days On Remaining';
                                    }
                                    else if ((o_temp.avacompany * 1) >= (o_temp.lineqty * 1) && o_temp.avalocal < .01) {
                                        o_temp.leadtimevalue = 'Available to Ship';
                                    }
                                    else if (o_temp.avacompany > 0 && o_temp.avacompany < o_temp.lineqty) {
                                        o_temp.leadtimevalue = 'Partial Availability to Ship/ ' + o_temp.locationlead + ' Days On Remaining';
                                    }
                                    else if (o_temp.locationlead > 0) {
                                        o_temp.leadtimevalue = o_temp.locationlead + ' Days';
                                    }
                                    else if (o_temp.leadtimevalue > 0) {
                                        o_temp.leadtimevalue += " Days";
                                    }
                                    else {
                                        o_temp.leadtimevalue = ''; 
                                    }
                                    o_rec.setCurrentSublistValue({ fieldId: 'custcol83', sublistId: 'item', value: o_temp.leadtimevalue})
                                }
                
                            }
                
                            return;
                            */
                    } else if (context.fieldId === 'entity') {
                        this._forcehold(context);
                    } else if (context.fieldId === 'custcol120') {
                        //if date is less than current date, show error and reset to today
                        var prDate = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol120'
                        });
                        var today = new Date ();
                        // alert('test: ' + prDate < today);
                        if (prDate != '' && prDate < today) {
                            tj.alert('The date value for Purchase Request Date must be a current or future date. Please set a value of today or later.');
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol120',
                                value: today
                            });
                        }                        
                    }
                    return;
                } catch (e) {
                    log.error('_so_fieldchange_fchange', e);
                }
            },//*********************************************
            //SO_fieldChanged page init
            _so_fieldchange_pinit: function (context) {
                var i_oldid = (new URL(document.location.href)).searchParams.get("id");
                var o_rec = context.currentRecord;
                var s_rectype = o_rec.type.toLowerCase();
                var o_fields = ['custbody8', 'custbody9', 'custbody10', 'custbody11', 'custbody34', 'custbody35', 'custbody36', 'custbody38', 'custbody67',
                    'custbody73', 'custbody74', 'custbody87', 'custbody173', 'class', 'location', 'shipcarrier', 'shipmethod', 'shippingcost', 'shipaddresslist', 'billaddresslist'];
                var i, o_temp, o_line, o_lf, i_total, i_ctotal, i_creditrem, o_oldrec;

                try {
                    if (o_rec.getValue({ fieldId: 'tranid' }) === 'To Be Generated') {
                        if (context.type === 'copy') {
                            o_oldrec = record.load({ type: s_rectype, id: i_oldid, isDynamic: true });
                            //Set Body Fields
                            for (i = 0; i < o_fields.length; i++) {
                                o_temp = o_oldrec.getValue(o_fields[i]);
                                if (o_temp) {
                                    o_rec.setValue(o_fields[i], o_temp);
                                }
                            }
                            // Set Line fields
                            for (i = 0; i < o_oldrec.getLineCount('item'); i++) {
                                o_line = {
                                    itemss: o_oldrec.getSublistValue({ fieldId: 'item', sublistId: 'item', line: i }),
                                    qty: o_oldrec.getSublistValue({ fieldId: 'quantity', sublistId: 'item', line: i }) || '',
                                    desc: o_oldrec.getSublistValue({ fieldId: 'description', sublistId: 'item', line: i }),
                                    solocation: o_oldrec.getSublistValue({ fieldId: 'location', sublistId: 'item', line: i }),
                                    closed: o_oldrec.getSublistValue({ fieldId: 'isclosed', sublistId: 'item', line: i })
                                }

                                if (o_line.closed !== 'T') {
                                    o_rec.selectNewLine({ sublistId: 'item' });
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: o_line.itemss, ignoreFieldChange: true, forceSyncSourcing: true });
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: o_line.qty, ignoreFieldChange: true, forceSyncSourcing: true })
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: o_line.solocation, ignoreFieldChange: true, forceSyncSourcing: true })
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'isclosed', value: o_line.closed, ignoreFieldChange: true, forceSyncSourcing: true })
                                    o_rec.commitLine({ sublistId: 'item' });
                                }
                            }
                        }
                        if (s_rectype === 'salesorder') {
                            for (i = 0; i < o_rec.getLineCount({ sublistId: 'item' }); i++) {
                                if (o_rec.getSublistValue({ fieldId: 'item', sublistId: 'item', line: i }) !== 0) {
                                    o_rec.selectLine({ sublistId: 'item', line: i });
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol74', value: '' });
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol91', value: '' });
                                    o_rec.commitLine({ sublistId: 'item' });

                                }
                            }
                        }
                    }
                    if (o_rec.getValue({ fieldId: 'entity' })) {
                        o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue({ fieldId: 'entity' }), type: record.Type.CUSTOMER, columns: ['balance', 'unbilledorders', 'creditlimit'] }));
                        if (!o_rec.id) {
                            i_total = o_rec.getValue({ fieldId: 'total' });
                        } else {
                            i_total = 0;
                        }
                        i_ctotal = parseInt(o_lf.balance) + parseInt(o_lf.unbilledorders) + parseInt(i_total);
                        i_creditrem = parseInt(o_lf.creditlimit) - parseInt(i_ctotal);

                        if (i_creditrem < 0) {
                            tj.alert('Warning: Customer oustanding balance (balance + unbilled + current order total) of $' + i_ctotal + ' exceeds credit limit by $' + (-1*i_creditrem));
                        }
                        this._forcehold(context);

                    }
                    if (s_rectype === 'salesorder' && o_rec.getValue({ fieldId: 'custbody125' }) === 12) {
                        o_rec.setValue({ fieldId: 'custbody125', value: '' });
                    }
                    /*else if(s_rectype === 'estimate'){
                        i_taskid = (new URL(document.location.href)).searchParams.get("taskid");
                        if(i_taskid && o_rec.getValue('custbody125') === ''){
                            o_rec.setValue({ fieldId:'custbody125', value: 12});
                            o_rec.setValue({ fieldId:'custbody167', value: i_taskid});
                        }
                    } */
                } catch (e) {
                    log.error('_so_fieldchange_pinit', e);
                }
            },
            //SO_fieldChanged line delete
            _so_fieldchange_delete: function (context) {
                var o_rec = context.currentRecord;
                var i_lineid, i_linequantity, s_message;
                try {
                    if (context.sublistId === 'item') {
                        i_lineid = o_rec.getCurrentSublistValue({ fieldId: 'line', sublistId: 'item' });
                        i_linequantity = o_rec.getCurrentSublistValue({ fieldId: 'quantity', sublistId: 'item' });
                        if (o_rec.id && o_rec.type.toLowerCase() === 'salesorder' && i_lineid && i_linequantity) {

                            var o_item_search = tj.searchAll({
                                'search': search.create({
                                    type: 'salesorder',
                                    filters: [
                                        ['type', 'anyof', 'SalesOrd'], 'AND',
                                        ['mainline', 'is', 'F'], 'AND',
                                        ['internalidnumber', 'equalto', o_rec.id], 'AND',
                                        ['line', 'equalto', i_lineid]
                                    ],
                                    columns: ['quantitypicked', 'quantitypacked']
                                })
                            });
                            if (o_item_search.length > 0) {
                                s_message = ' \n\n Quantity Pulled: ' + o_item_search[0].getValue('quantitypicked') + '\n Quantity PickPacked:  ' + o_item_search[0].getValue('quantitypacked') + '\n Quantity Fulfilled:  ' + o_rec.getCurrentSublistValue({ fieldId: 'quantityfulfilled', sublistId: 'item' }) + '\n Quantity Invoiced:  ' + o_rec.getCurrentSublistValue({ fieldId: 'quantitybilled', sublistId: 'item' });
                                if (o_item_search[0].getValue('quantitypicked') > o_rec.getCurrentSublistValue({ fieldId: 'quantitybilled', sublistId: 'item' })) {
                                    tj.alert('This line has a quantity fulfilled and can not be deleted. ' + s_message);
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                } catch (e) {
                    log.error('_so_fieldchange_pinit', e);
                }
            },
            //SO_LineInt
            _so_lineinit: function (context) {
                var o_rec = context.currentRecord;
                var o_temp;
                try {
                    if (context.sublistId === 'item') {
                        if (o_rec.getValue({ fieldId: 'customform' }) !== 303) {
                            if (o_rec.getCurrentSublistValue({ fieldId: 'custcol74', sublistId: 'item' })) {
                                o_temp = o_rec.getSublistField({ sublistId: 'item', fieldId: 'custcol76', line: 0 });
                                if (o_temp) {
                                    o_temp.isDisabled = true;
                                }
                            } else {
                                o_temp = o_rec.getSublistField({ sublistId: 'item', fieldId: 'custcol76', line: 0 });
                                if (o_temp) {
                                    o_temp.isDisabled = false;
                                }
                            }
                        }
                        var preferredVendor = o_rec.getCurrentSublistValue({ fieldId: 'povendor', sublistId: 'item' });
                        var prVendor = o_rec.getCurrentSublistValue({ fieldId: 'custcol118', sublistId: 'item' })
                        if (preferredVendor != '' && prVendor == '') {
                            o_rec.setCurrentSublistValue({
                                fieldId: 'custcol118',
                                sublistId: 'item',
                                value: preferredVendor
                            });
                        }
                    }
                } catch (e) {
                    log.error('_so_lineinit', e);
                }
            },
            //SO Field Change
            _so_fieldchange: function (context) {
                var o_rec = context.currentRecord;
                var o_lf, s_field;
                try {
                    //if(context.fieldId === 'custbody_po_follow_up'){
                    //    o_rec.setValue({ fieldId: 'email', value: o_rec.getValue('recordcreatedby')} );
                    //}
                    if (context.fieldId === 'custbody91' || context.fieldId === 'custbody_po_follow_up') {
                        if (o_rec.getValue({ fieldId: 'custbody91' }) >= 1) {
                            o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue('custbody91'), type: search.Type.CONTACT.toLowerCase(), columns: ['email'] }));
                            s_field = o_lf.email + ";" + o_rec.getValue({ fieldId: 'custbody_po_follow_up' });
                            o_rec.setValue({ fieldId: 'email', value: s_field });
                        } else {
                            o_rec.setValue({ fieldId: 'email', value: o_rec.getValue('custbody_po_follow_up') });
                        }
                    } 
                    if (context.sublistId == 'item' && (context.fieldId == 'custcol90' || context.fieldId == 'custcol117')) {
                        var purchReq = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol90'
                        });
                        var prType = o_rec.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol117'
                        });
                        if (purchReq == '1' && prType == '') {
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol117',
                                value: '1',
                                ignoreFieldChange: true
                            });
                        }
                        if (purchReq == '' || purchReq == '5') {
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol117',
                                value: '',
                                ignoreFieldChange: true
                            });
                        }
                        //set commit inventory to Do Not Commit for Drop Ship lines
                        if (purchReq == '1' && (prType == '3' || prType == '5')) {
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'commitinventory',
                                value: '3',
                                ignoreFieldChange: true
                            });
                        } else {
                            o_rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'commitinventory',
                                value: '1',
                                ignoreFieldChange: true
                            });
                        }
                    }
                } catch (e) {
                    log.error('_so_fieldchange', e);
                }
            },
            //SO_postSource_margincalc
            _so_postsource: function (context) {
                var o_rec = context.currentRecord;
                var s_itemtype, i_lineloc, i_itemrate, s_avgmargintext, s_ppricemargintext, s_costmargintext;
                var i_locationac = 0;
                try {
                    if (context.fieldId === 'item' && context.sublistId === 'item' && o_rec.getValue('customform') !== 303) {
                        o_rec.setCurrentSublistValue({ fieldId: 'custcol74', sublistId: 'item', value: o_rec.getCurrentSublistValue({ fieldId: 'location', sublistId: 'item' }) });

                        if (window.oneanddone === 1) {
                            window.oneanddone = 0;
                            return;
                        }

                        o_rec.setCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item', value: '' });

                        if (o_rec.getCurrentSublistValue({ fieldId: 'price', sublistId: 'item' }) < 0) {
                            o_rec.setCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item', value: 'Please enter a target margin or select a price level to see margin.' });
                            return;
                        }

                        s_itemtype = o_rec.getCurrentSublistValue({ fieldId: 'itemtype', sublistId: 'item' });

                        if (s_itemtype === 'InvtPart' || s_itemtype === 'Assembly') {

                            // if (!window.preferedvendorrate) {
                                window.labelac = "AC:";
                                i_lineloc = o_rec.getCurrentSublistValue({ fieldId: 'location', sublistId: 'item' });
                                i_linecostrate = o_rec.getCurrentSublistValue({ fieldId: 'costestimaterate', sublistId: 'item' });
                                if (i_lineloc) {
                                    var o_custom_search = tj.searchAll({
                                        'search': search.create({
                                            type: 'item',
                                            filters: [
                                                ["inventorylocation", "anyof", i_lineloc],
                                                "AND",
                                                ["internalidnumber", "equalto", o_rec.id]
                                            ],
                                            columns: [
                                                'cost',
                                                'custitem46',
                                                'custitem50',
                                                'averagecost',
                                                'locationaveragecost',
                                                'locationpreferredstocklevel'
                                            ]
                                        })
                                    });

                                    if (o_custom_search) {
                                        i_locationac = o_custom_search[0].getValue('locationaveragecost');
                                        window.source = o_custom_search[0].getValue('custitem46');
                                        window.lastNegotiationDate = o_custom_search[0].getValue('custitem50');
                                        window.preferedvendorrate = o_custom_search[0].getValue('cost');
                                        window.itemaveragecost = o_custom_search[0].getValue('averagecost');
                                        window.isStocked = o_custom_search[0].getValue('locationpreferredstocklevel');
                                    }

                                    // if (window.source === 2 && window.itemaveragecost) {
                                    //     o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'AVGCOST' });
                                    // } else {
                                    //     if (i_locationac) {
                                    //         if (parseInt(i_locationac) >= parseInt(o_rec.getCurrentSublistValue({ fieldId: 'quantity', sublistId: 'item' }))) {
                                    //             o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'AVGCOST' });
                                    //         }
                                    //     } else {
                                    //         o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'PURCHPRICE' });
                                    //     }
                                    // }

                                    if (i_locationac > 0) {
                                        window.itemaveragecost = i_locationac;
                                        window.labelac = "LAC:";
                                    }
                                }

                                i_itemrate = o_rec.getCurrentSublistValue({ fieldId: 'rate', sublistId: 'item' });

                                var i_costMargin = ((1 - (window.costestimaterate / i_itemrate)) * 100).toFixed(2);
                                var i_ppMargin = ((1 - (window.preferedvendorrate / i_itemrate)) * 100).toFixed(2); //-2
                                var i_avgcostMargin = ((1 - (window.itemaveragecost / i_itemrate)) * 100).toFixed(2);

                                if (window.itemaveragecost > 0) {
                                    s_avgmargintext = window.labelac + i_avgcostMargin + '%\n';
                                }

                                s_costmargintext = 'Cost Est:' + i_costMargin + '%\n ';

                                if (s_itemtype !== 'Assembly') {
                                    s_ppricemargintext = 'PP:' + i_ppMargin + '%\n ';
                                }

                                var o_LastNegoshDate = window.lastNegotiationDate;
                                var s_isstockedlocal = "Non-Stock" + '.\n';
                                if (parseInt(window.isStocked) > 0) {
                                    s_isstockedlocal = 'Stocked' + '.\n';
                                }

                                var i_marginfieldvalue = s_costmargintext + s_ppricemargintext + s_avgmargintext + '\n' + s_isstockedlocal + ' \n  ' + o_LastNegoshDate;
                                o_rec.setCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item', value: i_marginfieldvalue });
                                window.oneanddone = 1;
                            // }
                            window.lastNegotiationDate = "";
                            window.preferedvendorrate = "";
                            window.itemaveragecost = "";
                            window.source = "";
                            window.isStocked = "";
                            return;
                        }
                        //set new est margin field if rate and cost set
                        var itemrate = o_rec.getCurrentSublistValue({ fieldId: 'rate', sublistId: 'item' });
                        var itemcostrate = o_rec.getCurrentSublistValue({ fieldId: 'costestimaterate', sublistId: 'item' });
                        if (itemrate > 0) {
                        var estMargin = (100*(itemrate - itemcostrate)/itemrate).toFixed(2);
                        o_rec.setCurrentSublistValue({ fieldId: 'custcol123', sublistId: 'item', value: estMargin, ignoreFieldChange: true });
                        }
                    }
                } catch (e) {
                    log.error('_so_postsource', e);
                }
            },
            //SO_fieldChangedMarginCalc
            _so_fieldchangemargin: function (context) {
                var o_rec = context.currentRecord;
                var s_itemtype, i_itemid, i_lineloc, i_itemrate, a_columns, o_temp;
                try {
                    if (o_rec.getValue({ fieldId: 'customform' }) !== 303) {
                        if (context.fieldId === 'povendor') {
                            i_vendorid = o_rec.getCurrentSublistValue({ fieldId: 'povendor', sublistId: 'item' });
                            if (i_vendorid != '') {
                                // o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'PURCHPRICE' });
                            }
                        } else if (context.fieldId === 'price' || (context.sublistId === 'item' && context.fieldId === 'location') || context.fieldId === 'costestimaterate') {
                            if (o_rec.getCurrentSublistValue({ fieldId: 'price', sublistId: 'item' }) < 0) {
                                o_rec.setCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item', value: 'Please enter a target margin or select a price level to see margin.' });
                            } else {
                                i_itemid = o_rec.getCurrentSublistValue({ fieldId: 'item', sublistId: 'item' });
                                s_itemtype = o_rec.getCurrentSublistValue({ fieldId: 'itemtype', sublistId: 'item' });
    
    
                                if (s_itemtype === 'InvtPart' || s_itemtype === 'Assembly') {
                                    if (i_itemid) {     //!window.preferedvendorrate && 
                                        window.labelac = "AC:";
                                        i_lineloc = o_rec.getCurrentSublistValue({ fieldId: 'location', sublistId: 'item' });
                                        i_linecostrate = o_rec.getCurrentSublistValue({ fieldId: 'costestimaterate', sublistId: 'item' });
                                        if (i_lineloc) {
                                            a_columns = [
                                                search.createColumn({ name: "locationaveragecost", summary: search.Summary.AVG }),
                                                search.createColumn({ name: "averagecost", summary: search.Summary.AVG }),
                                                search.createColumn({ name: "cost", summary: search.Summary.SUM }),
                                                search.createColumn({ name: "locationpreferredstocklevel", summary: search.Summary.AVG }),
                                                search.createColumn({ name: "custrecord154", join: "inventoryLocation", summary: search.Summary.GROUP }),
                                                search.createColumn({ name: "class", join: "user", summary: search.Summary.GROUP }),
                                                search.createColumn({ name: "custitem46", summary: search.Summary.GROUP }),
                                                search.createColumn({ name: "locationquantityavailable", summary: search.Summary.GROUP }),
                                                search.createColumn({ name: "custitem50", summary: search.Summary.MAX })
                                                //search.createColumn({ name: "custrecord302", summary: search.Summary.COUNT }),
                                                //search.createColumn({ name: "custrecord301", summary: search.Summary.COUNT })
                                            ];
                                            var o_item_search = tj.searchAll({
                                                'search': search.create({
                                                    type: 'item',
                                                    filters: [
                                                        ["inventorylocation", "anyof", i_lineloc],
                                                        "AND",
                                                        ["internalidnumber", "equalto", i_itemid]
                                                    ],
                                                    columns: a_columns
                                                })
                                            });
    
                                            var i_locationac = 0;
                                            window.costestimaterate = i_linecostrate;
                                            window.source = o_item_search[0].getValue(a_columns[6]);
                                                window.locationAva = o_item_search[0].getValue(a_columns[7]);
                                                window.lastNegotiationDate = o_item_search[0].getValue(a_columns[8]);
                                                //window.altCount = o_item_search[0].getValue(a_columns[9]);
                                            if (o_item_search.length > 0) {
                                                i_locationac = o_item_search[0].getValue(a_columns[0]);
                                                window.preferedvendorrate = o_item_search[0].getValue(a_columns[2]);
                                                window.itemaveragecost = o_item_search[0].getValue(a_columns[1]);
                                                window.isStocked = o_item_search[0].getValue(a_columns[3]);
                                                window.LocationClass = o_item_search[0].getValue(a_columns[4]);
                                                window.userClass = o_item_search[0].getValue(a_columns[5]);
                                                  
                                            }
    
                                            //commenting this out should allow users to set this and not have it be reset
                                            // if (window.source === 2 && window.itemaveragecost) {
                                            //     o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'AVGCOST' });
                                            // } else {
                                            //     if (parseInt(window.locationAva) >= parseInt(o_rec.getCurrentSublistValue({ fieldId: 'quantity', sublistId: 'item' })) && i_locationac) {
                                            //         o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'AVGCOST' });
                                            //     } else {
                                            //         o_rec.setCurrentSublistValue({ fieldId: 'costestimatetype', sublistId: 'item', value: 'PURCHPRICE' });
                                            //     }
                                            // }
                                            if (i_locationac > 0) {
                                                window.itemaveragecost = i_locationac;
                                                window.labelac = "LAC:";
                                            }
                                        }
                                    }
    
    
                                    i_itemrate = o_rec.getCurrentSublistValue({ fieldId: 'rate', sublistId: 'item' });
    
                                    o_temp = {
                                        costMargin: ((1 - (window.costestimaterate / i_itemrate)) * 100).toFixed(2),
                                        ppmargin: ((1 - (window.preferedvendorrate / i_itemrate)) * 100).toFixed(2),
                                        avgcostmargin: ((1 - (window.itemaveragecost / i_itemrate)) * 100).toFixed(2),
                                        costmargintext: '',
                                        avgtextmargin: '',
                                        ppricemargintext: '',
                                        isstockedlocal: 'Non-Stock' + '.\n',
                                        negoshlabel: '',
                                        altlabel: '',
                                        marginval: 0
                                    };
    
    
                                    if (window.itemaveragecost > 0) {
                                        o_temp.avgtextmargin = window.labelac + o_temp.avgcostmargin + " % \n ";
                                    }
    
                                    o_temp.costmargintext = 'Cost Est:' + o_temp.costMargin + '%\n ';
    
                                    if (s_itemtype !== 'Assembly') {
                                        o_temp.ppricemargintext = "PP: " + o_temp.ppmargin + "% \n";
                                    }
    
                                    if (parseInt(window.isStocked) > 0) {
                                        o_temp.isstockedlocal = 'Is Stocked' + '.\n';
                                    }
    
                                    if (window.lastNegotiationDate) {
                                        o_temp.negoshlabel = 'LND:';
                                    }
                                    if (parseInt(window.window.altCount) > 0) {
                                        o_temp.altlabel = '\n Alternates:' + parseInt(window.window.altCount);
                                    }
    
                                    o_temp.marginval = o_temp.costmargintext + o_temp.ppricemargintext + o_temp.avgtextmargin + o_temp.isstockedlocal + o_temp.negoshlabel + window.lastNegotiationDate + o_temp.altlabel;
                                    o_rec.setCurrentSublistValue({ fieldId: 'custcol112', sublistId: 'item', value: window.isStocked || '' });
                                    o_rec.setCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item', value: o_temp.marginval || '' });
    
                                    window.oneanddone = 1;
                                    window.preferedvendorrate = "";
                                    window.itemaveragecost = "";
                                    window.isStocked = "";
                                    window.LocationClass = "";
                                    window.userClass = "";
                                    window.source = "";
                                    window.locationAva = "";
                                }
                            }

                            //set new est margin field if rate and cost set
                            var itemrate = o_rec.getCurrentSublistValue({ fieldId: 'rate', sublistId: 'item' });
                            var itemcostrate = o_rec.getCurrentSublistValue({ fieldId: 'costestimaterate', sublistId: 'item' });
                            if (itemrate > 0) {
                                var estMargin = (100*(itemrate - itemcostrate)/itemrate).toFixed(2);
                                o_rec.setCurrentSublistValue({ fieldId: 'custcol123', sublistId: 'item', value: estMargin, ignoreFieldChange: true });
                            }
                            
                            return;
                        }
                    }
                } catch (e) {
                    log.error('_so_fieldchangemargin', e);
                }
            },
            //SO_fieldChanged_SelectPriceLevel
            _so_fieldchange_selectprice: function (context) {
                var o_rec = context.currentRecord;
                var i_margincalc, s_itemtype, i_itemid, o_item, i_lineloc, i_locnac = 0, i_newsp, i_baseprice, i_pricelevel;
                try {
                    if (o_rec.getValue({ fieldId: 'customform' }) !== 303) {
                        if (context.fieldId === 'custcol61') {
                            i_margincalc = o_rec.getCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item' });
                            if (i_margincalc) {
                                if (i_margincalc > 0) {
                                    o_rec.setCurrentSublistValue({ fieldId: 'custcol61', sublistId: 'item', value: '' });
                                    window.oneanddone = 0;
                                    s_itemtype = o_rec.getCurrentSublistValue({ fieldId: 'itemtype', sublistId: 'item' });
                                    i_itemid = o_rec.getCurrentSublistValue({ fieldId: 'item', sublistId: 'item' });

                                    if (s_itemtype === 'InvtPart') {
                                        s_itemtype = 'inventoryitem';
                                    } else if (s_itemtype === 'Assembly') {
                                        s_itemtype = 'assemblyitem';
                                    } else if (s_itemtype === 'Kit' || s_itemtype === 'Group') {
                                        s_itemtype = 'kititem';
                                    }

                                    if ((s_itemtype === 'inventoryitem' || s_itemtype === 'assemblyitem') && i_itemid) {
                                        o_item = record.load({ type: s_itemtype, id: i_itemid });
                                        window.preferedvendorrate = o_item.getValue({ fieldId: 'cost' });
                                        window.itemaveragecost = o_item.getValue('averagecost');
                                        window.labelac = 'AC:';
                                        i_lineloc = o_rec.getCurrentSublistValue({ fieldId: 'location', sublistId: 'item' });
                                        if (i_lineloc) {
                                            var o_item_search = tj.searchAll({
                                                'search': search.create({
                                                    type: 'item',
                                                    filters: [
                                                        ["inventorylocation", "anyof", i_lineloc],
                                                        "AND",
                                                        ["internalidnumber", "equalto", i_itemid]
                                                    ],
                                                    columns: ['locationaveragecost']
                                                })
                                            });
                                            if (o_item_search.length > 0) {
                                                i_locnac = o_item_search[0].getValue('locationaveragecost');
                                            }
                                            if (i_locnac > 0) {
                                                window.itemaveragecost = i_locnac;
                                                window.labelac = "LAC:";
                                            }
                                        }
                                        i_newsp = (o_item.getValue({ fieldId: 'cost' }) / (1 - (i_margincalc) / 100)).toFixed(2);
                                        i_baseprice = o_item.getMatrixSublistValue({ sublistId: 'price', fieldId: 'price', column: 0, line: 0 });
                                        i_pricelevel = o_item.getSublistValue({ sublistId: 'price', fieldId: 'pricelevel', line: 0 });

                                        if (i_newsp >= i_baseprice) {
                                            o_rec.setCurrentSublistValue({ fieldId: 'price', sublistId: 'item', value: i_pricelevel });
                                            return;
                                        }
                                        /* o_temp = {
                                            pricelevelprice: '', 
                                            priceleveldiscount: '',
                                            vpricelevel: ''
                                        };
                                        for (var i = 0; i < o_item.getLineCount('price');i++) {
                                            o_temp.pricelevelprice = o_item.getMatrixSublistValue({ sublistId: 'price', fieldId: 'price', column: i, line: 0 });
                                            o_temp.priceleveldiscount = o_item.getSublistValue({ sublistId: 'price', fieldId: 'discount',  line: i });
                                            o_temp.pricelevel = o_item.getSublistValue({ sublistId: 'price', fieldId: 'pricelevel',  line: i });
                    
                                            if (o_temp.pricelevel === 157) { 
                                                o_temp.pricelevelprice = 99999999999; 
                                            }
                                            if (i_newsp >= o_temp.pricelevelprice && o_temp.priceleveldiscount && o_temp.pricelevelprice) {
                                                break;
                                            }
                    
                                        }*/
                                        o_rec.setCurrentSublistValue({ fieldId: 'price', sublistId: 'item', value: i_pricelevel });
                                    }
                                }
                            }
                        }
                        if (context.fieldId == 'custcol123') {
                            var margincalcfield = o_rec.getCurrentSublistValue({ fieldId: 'custcol123', sublistId: 'item' });
                            // alert(margincalcfield + ' | ' + typeof(margincalcfield));
                            // var splitMargin= margincalcfield.split('%');
                            var finalMargin = margincalcfield/100;
                            // alert(finalMargin);
                            if (finalMargin > 0) {
                              var itemcostrate = o_rec.getCurrentSublistValue({ fieldId: 'costestimaterate', sublistId: 'item' });
                              var calcrate = (itemcostrate / (1 - finalMargin)).toFixed(2);
                              o_rec.setCurrentSublistValue({ fieldId: 'price', sublistId: 'item', value: '-1' });
                              o_rec.setCurrentSublistValue({ fieldId: 'rate', sublistId: 'item', value: calcrate });
                              return true;
                            } 
                            return false;
                          }
                    }
                    return;
                } catch (e) {
                    log.error('_so_fieldchange_selectprice', e);
                    return;
                }
            },//-----------------------------Check
            //SO_onsave
            _so_onsave: function (context) {
                var o_rec = context.currentRecord;
                var o_temp, o_lf;
                var i_itemcheck, i_splitinv;
                var i, j;
                try {

                    o_lf = tj.lookupFields(search.lookupFields({ id: o_rec.getValue('entity'), type: 'customer', columns: ['custentity327'] }));

                    if (parseInt(o_lf.custentity327) === 9) {
                        tj.alert('The Following customer is on Force Hold, Please contact Accounting');
                        return false;
                    }

                    i_splitinv = parseInt(o_rec.getValue('custbody_totalnumberofchildinvoices'));
                    i_itemcheck = 0;
                    var i_multbincheck = false;
                    for (i = 0; i < o_rec.getLineCount('item'); i++) {
                        switch (o_rec.getSublistValue({ fieldId: 'itemtype', sublistId: 'item', line: i })) {
                            case 'Assembly':
                                break;
                            case 'Kit':
                                i_itemcheck++;
                                break;
                            case 'Group':
                                i_itemcheck++;
                                break;
                        }
                        var objSubRecord = o_rec.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        var invAssignLines = objSubRecord.getLineCount({
                            sublistId: 'inventoryassignment'
                        });
                        if (invAssignLines > 1) {
                            i_multbincheck = true;
                        }
                    }

                    if (i_itemcheck > 0 && i_splitinv > 0) {
                        tj.alert('Invoice Spliting does not work for kits or groups.  Please create multiple sales orders or set Split Invoice Count to blank.');
                        return false;
                    }

                    //Validate customer codes START
                    o_temp = {
                        errMsg: 'The following customer code values do no match the split invoice count: \n\n',
                        errMsgL: 0,
                        customerCodes: ['custbody8', 'custbody9', 'custbody10', 'custbody74', 'custbody38', 'custbody11', 'custbody69', 'custbody73', 'custbody67', 'custbody87'],
                        customerCodesLabels: ['WellSite Name', 'Well Number', 'Accounting #', 'GL Account', 'Purchaser/Technician Name', 'XTO Code', 'Plant Code', 'Approver ID', 'Reason Codes', 'Online Paykey/UserID'],
                        numberofCopies: o_rec.getValue('custbody_totalnumberofchildinvoices'),
                        fieldValue: '',
                        mySplitResult: '',
                        errFlag: false

                    };
                    o_temp.errMsgL = o_temp.errMsg.length;

                    if (o_temp.numberofCopies > 1) {
                        for (i = 0; i < o_temp.customerCodes.length; i++) {
                            o_temp.errFlag = false;
                            o_temp.fieldValue = o_rec.getValue(o_temp.customerCodes[i]);
                            o_temp.fieldValue = this._trim(o_temp.fieldValue);
                            o_temp.mySplitResult = o_temp.fieldValue.split(',');
                            if (o_temp.fieldValue.length > 0) {
                                if (o_temp.mySplitResult.length > 1) {
                                    if (o_temp.mySplitResult.length !== o_temp.numberofCopies) {
                                        o_temp.errFlag = true;
                                    } else {
                                        for (j = 0; j < o_temp.numberofCopies; j++) {
                                            if (o_temp.mySplitResult[j] !== null) {
                                                var str = this._trim(o_temp.mySplitResult[j]);
                                                if (str.length === 0) {
                                                    o_temp.errFlag = true;
                                                }
                                            }
                                        }
                                    }
                                    if (o_temp.errFlag) {
                                        o_temp.errMsg += o_temp.customerCodesLabels[i] + ', ';
                                    }
                                }
                            }
                        }

                        if (o_temp.errMsg.length > o_temp.errMsgL) {
                            o_temp.errMsg += '\n\nPlease ensure the total entries for each customer code field matches the split invoice count.';
                            tj.alert(o_temp.errMsg);
                            return false;
                        }
                    }
                    //Validate customer codes END

                    var splitInvoiceCount = parseInt(o_rec.getValue('custbody_totalnumberofchildinvoices'));

                    if (!isNaN(splitInvoiceCount)) {
                        if (splitInvoiceCount > 0) {
                            for (i = 0; i < o_rec.getLineCount('item'); i++) {
                                var le = o_rec.getSublistValue('item', 'item', i);
                                var qty = parseInt(o_rec.getSublistValue('item', 'quantity', i));
                                var x = qty / splitInvoiceCount;
                                if ((!this._is_int(x)) && (le !== 0)) {
                                    tj.alert('The quantity number on the line ' + i + ' cannot be divided by the invoice split count');
                                    return false;
                                }
                            }
                        }
                    }
                    if (i_multbincheck) {
                        if (splitInvoiceCount > 0) {
                            tj.alert('The bin detail for this order is too complex to be split by the script. Please split up the invoices manually.');
                            return false;
                        }
                    }
                    o_rec.setValue({ fieldId: 'shippingcostoverridden', value: true });

                    var a_fields = ['otherrefnum', 'custbody38', 'custbody8', 'custbody9', 'custbody10', 'custbody69', 'custbody11', 'custbody67', 'custbody74', 'custbody87', 'custbody129'];
                    var s_custcodelist;

                    for (i = 0; i < a_fields.length; i++) {
                        s_custcodelist += a_fields[i] + ' ';
                    }
                    o_rec.setValue({ fieldId: 'custbody204', value: s_custcodelist.substring(0, 299), ignoreFieldChange: true });

                    var s_addtocart = '';
                    for (i = 0; i < o_rec.getLineCount('item'); i++) {
                        var s_itemtext = o_rec.getSublistText({ fieldId: 'item', sublistId: 'item', line: i });
                        if ((s_itemtext.indexOf('-I.U.') !== -1 && s_itemtext.indexOf('-I.U-S') === -1 && o_rec.type.toLowerCase() === "salesorder") ||
                            (s_itemtext.indexOf('IN USE') !== -1 && s_itemtext.indexOf('IN USE - SOLD') === -1 && o_rec.type.toLowerCase() === "salesorder")) {
                            record.submitFields({
                                id: o_rec.getSublistValue({ fieldId: 'item', sublistId: 'item', line: i }),
                                values: {
                                    custitem66: 'F',
                                    displayname: 'IN USE - SOLD',
                                    salesdescription: o_rec.getSublistValue({ fieldId: 'description', sublistId: 'item', line: i })
                                },
                                type: 'inventoryitem',
                                options: {
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                }
                            });
                        }
                        if (o_rec.getSublistValue({ fieldId: 'quantity', sublistId: 'item', line: i }) > 0) {
                            s_addtocart = s_addtocart + o_rec.getSublistValue({ fieldId: 'item', sublistId: 'item', line: i }) + "," + o_rec.getSublistValue({ fieldId: 'quantity', sublistId: 'item', line: i }) + ";";
                        }
                    }
                    o_rec.setValue('custbody153', s_addtocart, true);

                    return true;
                } catch (e) {
                    log.error('_so_onsave', e);
                    return true;
                }
            },
            //CS SO BasePrice
            _cs_so_baseprice: function (context) {
                var o_rec = context.currentRecord;
                var i_itemid, s_url, o_response, s_respbody, s_respbprice;
                try {
                    if (runtime.executionContext === runtime.ContextType.WEBSTORE) {
                        if (context.sublistId === 'item') {
                            i_itemid = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });

                            log.debug('ITEM ID', i_itemid);
                            if (i_itemid) {
                                s_url = 'https://422523.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2151&deploy=1&compid=422523&h=a7317b172ab64e26e19f&itemid=' + i_itemid;
                                o_response = http.get({ url: s_url });

                                s_respbody = JSON.parse(o_response.getBody());
                                log.debug('RESPONSE', JSON.stringify(s_respbody));

                                if (s_respbody.dontshowprice) {
                                    s_respbprice = parseInt(s_respbody.baseprice);
                                    if (s_respbprice) {
                                        log.debug('Set Base Price', JSON.stringify(s_respbprice));
                                        o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: s_respbprice });
                                    }
                                }
                            }
                        }
                    }
                    return true;
                } catch (e) {
                    log.error('_cs_so_baseprice', e);
                    return true;
                }
            },
            //CS SO Purchase Request validations
            _cs_so_purchasereq: function (context) {
                var o_rec = context.currentRecord;
                var i_prVal, i_prType, i_loc, i_qty, i_qtyavail;
                try {
                    if (context.sublistId === 'item') {
                        i_prVal = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol90' });
                        i_prType = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol117' });
                        i_prVendor = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol118' });

                        i_loc = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'location' });
                        i_tranloc = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol114' });
                        i_tranqtyavail = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol115' });
                        i_qty = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' });
                        i_qtyavail = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantityavailable' });

                        // log.debug('Purchase Request: ', i_prVal);
                        if (i_prVal) {
                            if (i_prVal == '1') {
                                //if PR, validate selection for purchase request type
                                if (i_prType == '') {
                                    alert('The current line you selected for a Purchase Request does not have a Purchase Request Type set. Please correct this line before submitting.')
                                    return false;
                                }
                            }
                            if (i_prVal != '5') {
                                //if PR, validate selection for Vendor
                                if (i_prVendor == '') {
                                    alert('The current line you selected for a Purchase Request does not have a Vendor set. Please correct this line before submitting.')
                                    return false;
                                }
                            }
                            if (i_prVal != '6') {
                                if (i_prVendor == '2491') {
                                    alert('The current line you selected for a Purchase Request is using the placeholder vendor Credit Card Purchase Tracker %. Please verify this as a placeholder vendor or Credit Card PO before saving and include all required details in the PR Notes field.')
                                    // return false;
                                }
                            }
                            if (i_prVal == '5') {
                                if (i_loc == '218' || i_loc == '219' || i_tranloc == '218' || i_tranloc == '219') {
                                    alert('The current line you selected for a Transfer is attempting to transfer from/to a panel shop. Please choose a different location before submitting.')
                                    return false;
                                }
                                //if TO, validate selection for ship loc (and qty avail > qty)
                                if (i_loc == '' || i_tranloc == '') {
                                    alert('The current line you selected for a Transfer is missing either a Ship Location or a Transfer From Location. Please correct this line before submitting.')
                                    return false;
                                } else if (i_tranqtyavail == '' || i_tranqtyavail == 0 || i_tranqtyavail < i_qty) {
                                    alert('The current line you selected for a Transfer does not have enough quantity to transfer. Either select a location with enough available to complete the line or change to a Purchase Request. Please correct this line before submitting.')
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                } catch (e) {
                    log.error('_cs_so_purchasereq', e);
                    return true;
                }
            },
            //Set SO Location Encino  page init
            _set_so_loc_encino_pinit: function (context) {
                var o_rec = context.currentRecord;
                var o_cust = 31270;
                try {
                    if (o_rec.getValue({ fieldId: 'customform' }) === 356) {
                        o_rec.setValue({ fieldId: 'location', value: '201' });
                        if (o_rec.getValue({ fieldId: 'entity' }) === o_cust) {
                            o_rec.setValue({ fieldId: 'custbody125', value: '3' });
                        } else {
                            o_rec.setValue({ fieldId: 'entity', value: o_cust });
                        }
                    }
                } catch (e) {
                    log.error('_set_so_loc_encino', e);
                }
            },
            //Set SO Location Encino sb change
            /*_set_so_loc_encino_sc: function(context){
                var o_rec = context.currentRecord;
                var o_sbval;
                try {
                    if(context.sublistId === 'item'){
                        o_sbval = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantityavailable'});
                        if(o_sbval <= 0){
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: '17' });
                        }
                    }
                }catch(e){
                    log.error('_set_so_loc_encino_sc',e);
                }
            },*/
            //XTOTrailersHideFields validate line
            _xto_trailerhide_vline: function (context) {
                var o_rec = context.currentRecord;
                try {
                    if (o_rec.getValue({ fieldId: 'customform' }) == 364) {
                        o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 211 })
                    }
                    if (o_rec.getValue({ fieldId: 'customform' }) == 347 || o_rec.getValue({ fieldId: 'customform' }) == 362) {
                        o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 69 })
                    }
                    if ((o_rec.getValue({ fieldId: 'customform' }) == 347 || o_rec.getValue({ fieldId: 'customform' }) == 362) && (parseInt(o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantityavailable' })) < o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' }))) {
                        tj.alert('STOCK ALERT\n\nThere is not enough avalible quantity to complete this line.  Please double check your part number or reduce the quantity to be less than or equal to Senecas available stock.');
                        return false;
                    }
                    return true;
                } catch (e) {
                    log.error('_xto_trailerhide_vline', e);
                    return false;
                }
            },
            //XTOTrailersHideFields line init
            _xto_trailerhide_linit: function (context) {
                var o_rec = context.currentRecord;
                try {
                    if (o_rec.getValue({ fieldId: 'customform' }) == 364) {
                        o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 211 })
                    }
                    if (o_rec.getValue({ fieldId: 'customform' }) == 347 || o_rec.getValue({ fieldId: 'customform' }) == 362) {
                        o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 69 })
                    }
                } catch (e) {
                    log.error('_xto_trailerhide_linit', e);
                }
            },
            //XTOTrailersHideFields field change
            _xto_trailerhide_fchange: function (context) {
                var o_rec = context.currentRecord;
                var o_temp;
                try {
                    if ((o_rec.getValue({ fieldId: 'customform' }) == 347 || o_rec.getValue({ fieldId: 'customform' }) == 362)) {
                        if (context.fieldId === 'custbody213') {
                            o_temp = {
                                afeField: document.getElementById('custbody214_fs'),
                                afeFieldLabel: document.getElementById('custbody214_fs_lbl_uir_label'),
                                loeField: document.getElementById('custbody215_fs'),
                                loeFieldLabel: document.getElementById('custbody215_fs_lbl_uir_label'),
                                custbody213: o_rec.getValue({ fieldId: 'custbody213' })
                            };
                            if (o_temp.custbody213 == 2) {
                                if (o_temp.afeField) {
                                    o_temp.afeField.style.display = 'none';
                                    o_temp.afeFieldLabel.style.display = 'none';
                                    o_rec.setValue({ fieldId: 'custbody214', value: '' });
                                }
                                if (o_temp.loeField) {
                                    o_temp.loeField.style.display = '';
                                    o_temp.loeFieldLabel.style.display = 'list-item';
                                    o_rec.setValue({ fieldId: 'custbody215', value: '1' });
                                }
                            } else if (o_temp.custbody213 == 1) {
                                if (o_temp.afeField) {
                                    o_temp.afeField.style.display = '';
                                    o_temp.afeFieldLabel.style.display = 'list-item';
                                    o_rec.setValue({ fieldId: 'custbody214', value: 'ICC- MISCELLANEOUS 1400-1220-1810' })
                                }
                                if (o_temp.loeField) {
                                    o_temp.loeField.style.display = 'none';
                                    o_temp.loeFieldLabel.style.display = 'none';
                                    o_rec.setValue({ fieldId: 'custbody215', value: '' });
                                }
                            }
                        }
                        if (o_rec.getValue('tranid') === 'To Be Generated') {
                            if (context.fieldId === 'item') {
                                o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'taxcode', value: i_avalara_tax });
                                o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 69 })
                            }
                        }
                        if (context.sublistId = 'item' && context.fieldId === 'location') {
                            if (o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'location' }) == '') {
                                setTimeout(function(){
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 69})
                                }, 250);
                                
                            }
                        }
                    }
                } catch (e) {
                    log.error('_xto_trailerhide_fchange', e);
                }
            },
            //XTOTrailersHideFields page init
            _xto_trailerhide_pinit: function (context) {
                var o_rec = context.currentRecord;
                var o_user = runtime.getCurrentUser();
                var o_lf, o_tempfield, o_temp, a_fields;
                try {
                    // alert(o_rec.getValue('customform'))
                    if (o_rec.getValue({ fieldId: 'customform' }) == 347 || o_rec.getValue({ fieldId: 'customform' }) == 362) {
                        if (o_rec.getValue('tranid') === 'To Be Generated') {
                            if (o_user.contact) {
                                o_lf = tj.lookupFields(search.lookupFields({ id: o_user.contact, type: record.Type.CONTACT.toLowerCase(), columns: ['entityid'] }));
                                o_rec.setValue({ fieldId: 'custbody173', value: o_user.contact });
                                // o_rec.setValue({ fieldId: 'custbody35', value: o_lf.entityid });
                            }
                            o_rec.setValue({ fieldId: 'shipcarrier', value: 'nonups' });
                            o_rec.setValue({ fieldId: 'shipmethod', value: 4605 });
                            o_rec.setValue({ fieldId: 'custbody125', value: i_source_customercenter });
                            o_rec.setValue({ fieldId: 'custbody68', value: 20 });
                            o_rec.setValue({ fieldId: 'terms', value: 2 });
                            o_rec.setValue({ fieldId: 'custbody_as_solutions_assist', value: 5 });
                        }
    
                        // alert(o_rec.getValue('custbody213'))
                        if (o_rec.getValue('custbody213') == 1) {
                            o_temp = {
                                loeField: document.getElementById('custbody215_fs'),
                                loeFieldLabel: document.getElementById('custbody215_fs_lbl_uir_label')
                            };
                            // alert(JSON.stringify(o_temp))
                            if (o_temp.loeField) {
                                o_temp.loeField.style.display = 'none';
                                o_temp.loeFieldLabel.style.display = 'none';
                            }
                        }
    
                        a_fields = ['tbl_custpagesi_sigcapturebtn', 'tbl_secondarycustpagesi_sigcapturebtn', 'NS_MENU_ID0', 'tbl_custpage_ava_calculatetax', 'tbl_custpage_ava_validatebillto', 'tbl_custpage_ava_validateshipto', 'tbl_secondarycustpage_ava_calculatetax', 'tbl_secondarycustpage_ava_validatebillto', 'tbl_secondarycustpage_ava_validateshipto', 'NS_MENU_ID0', 'item_pane_hd'];/*,'item_pane_hd'*/
                        for (var i = 0; i < a_fields.length; i++) {
                            o_tempfield = document.getElementById(a_fields[i]);
                            if (o_tempfield) {
                                o_tempfield.style.display = 'none';
                            }
                        }
    
                        if (document.getElementsByClassName('totallingbg') !== null) {
                            document.getElementsByClassName('totallingbg')[0].style.display = "none";
                        }
                        if (o_rec.getValue('location')) {
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: o_rec.getValue('location') });
                        }
                        // if (o_rec.getValue('customform') === 363) {
                        //     o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 47 });
                        // } else if (o_rec.getValue({ fieldId: 'customform' }) === 347 || o_rec.getValue({ fieldId: 'customform' }) === 362) {
                        //     o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 69 });
                        // }
                    }
                } catch (e) {
                    log.error('_xto_trailerhide_pinit', e);
                }
            },

            _cs_so_valfield: function (context) {
                try {
                    var sublistId = context.sublistId;
                    var fieldId = context.fieldId;
                    // alert('fieldId: ' + fieldId);
                    if (sublistId === 'item' && (fieldId === 'rate' || fieldId === 'amount')) {
                        var o_rec = context.currentRecord;
                        var entity = o_rec.getValue('entity');
                        var item = o_rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'item'});
                        // alert('item: ' + item);
                        if (item != '' && entity != '') {
                            var pricebookResults = tj.searchAll({
                                'search': search.create({
                                    type: "customrecord1281",
                                    filters:
                                    [
                                    ["custrecord317","anyof",item], 
                                    "AND", 
                                    ["custrecord316.custrecord319","anyof",entity], 
                                    "AND", 
                                    ["custrecord316.custrecord320","before","today"], 
                                    "AND", 
                                    ["custrecord316.custrecord321","after","today"], 
                                    "AND", 
                                    ["isinactive","is","F"], 
                                    "AND", 
                                    ["custrecord316.isinactive","is","F"]
                                    ],
                                    columns: ['custrecord318']
                                })
                            });
                            if (pricebookResults.length > 0) {
                                var pricebookRate = pricebookResults[0].getValue({
                                    name: 'custrecord318'
                                });
                                // alert('pb rate: ' + pricebookRate);
                                var lineRate = o_rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'rate'});
                                // alert('line rate: ' + lineRate);
                                if (lineRate != pricebookRate) {
                                    alert('The current line item you are editing is part of a pricebook for the customer on this order. The default price level, rate, and amount cannot be changed from what is defined in the pricebook.')
                                    o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: pricebookRate });
                                    return false;
                                }      
                            }
                        }
                    }
                    if (sublistId === 'item' && fieldId === 'custcol_custpriceupdate') {
                        var o_rec = context.currentRecord;
                        var entity = o_rec.getValue('entity');
                        var item = o_rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'item'});
                        // alert('item: ' + item);
                        if (item != '' && entity != '') {
                            var pricebookResults = tj.searchAll({
                                'search': search.create({
                                    type: "customrecord1281",
                                    filters:
                                    [
                                    ["custrecord316.custrecord319","anyof",entity], 
                                    "AND", 
                                    ["custrecord316.custrecord320","before","today"], 
                                    "AND", 
                                    ["custrecord316.custrecord321","after","today"], 
                                    "AND", 
                                    ["isinactive","is","F"], 
                                    "AND", 
                                    ["custrecord316.isinactive","is","F"]
                                    ],
                                    columns: ['custrecord318']
                                })
                            });
                            if (pricebookResults.length > 0) {
                                //always throw error when checking update. can't add new items to pricebook, it is static. can't update existing prices.
                                alert('The customer on this order belongs to a pricebook. The defined items and prices in that book are static and cannot be updated or added to.')
                                o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: pricebookRate });
                                return false;  
                            }
                        }
                    }
                    if (sublistId === 'item' && fieldId === 'costestimatetype') {
                        var o_rec = context.currentRecord;
                        var lineItem = o_rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'item'});
                        var itemLookup = search.lookupFields({
                            type: search.Type.ITEM,
                            id: lineItem,
                            columns: ['type']
                        });
                        var itemType = itemLookup.type[0].value;
                        var costEstType = o_rec.getCurrentSublistValue({sublistId: 'item', fieldId: 'costestimatetype'});
                        // alert('costEstType: ' + costEstType);
                        if (itemType == 'NonInvtPart' && costEstType != 'CUSTOM') {
                            alert('The Cost Estimate Type for Non-Inventory Items must be set to Custom. Please set the Est Extended Cost for this item.')
                            o_rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'costestimatetype', value: 'CUSTOM' });
                            return false;  
                        }
                    }
                    return true;
                } catch (e) {
                    log.error('tjincATX_validatelineSO', e);
                    return true;
                }
            },

            tjincATX_pageInitSO: function (context) {
                var o_user = runtime.getCurrentUser();
                try {
                    log.debug('tjincATX_pageInitSO', 'IN');
                    this._enablebuttons();
                    this._so_fieldchange_pinit(context);
                    this._set_so_loc_encino_pinit(context);

                    // if (o_user.roleCenter === s_customer_center || parseInt(o_user.id) === 6447 || parseInt(o_user.id) === 25918) {
                        this._xto_trailerhide_pinit(context);
                    // }
                } catch (e) {
                    log.error('tjincATX_pageInitSO', e);
                }
            },

            tjincATX_fieldChangedSO: function (context) {
                var o_user = runtime.getCurrentUser();
                try {
                    this._so_fieldchange_fchange(context);
                    this._so_fieldchange(context);
                    this._so_fieldchangemargin(context);
                    this._so_fieldchange_selectprice(context);

                    // if (o_user.roleCenter === s_customer_center || parseInt(o_user.id) === 6447 || parseInt(o_user.id) === 25918) {
                        this._xto_trailerhide_fchange(context);
                    // }
                } catch (e) {
                    log.error('tjincATX_fieldChangedSO', e);
                }
            },

            tjincATX_sublistChangedSO: function (context) {
                try {
                    log.debug('tjincATX_sublistChangedSO', 'IN, ' + context);
                    //this._set_so_loc_encino_sc(context);
                } catch (e) {
                    log.error('tjincATX_sublistChangedSO', e);
                }
            },

            tjincATX_postSourcingSO: function (context) {
                try {
                    this._so_fieldchange_psource(context);
                    this._so_postsource(context);
                } catch (e) {
                    log.error('tjincATX_postSourcingSO', e);
                }
            },

            tjincATX_lineInitSO: function (context) {
                var o_user = runtime.getCurrentUser();
                try {
                    log.debug('tjincATX_lineinit', 'IN');
                    this._so_lineinit(context);

                    // if (o_user.roleCenter === s_customer_center || parseInt(o_user.id) === 6447 || parseInt(o_user.id) === 25918) {
                        // this._xto_trailerhide_linit(context);
                    // }
                } catch (e) {
                    log.error('tjincATX_lineInitSO', e);
                }
            },

            tjincATX_validatefieldSO: function (context) {
                var o_response = true;
                try {
                    log.debug('tjincATX_validatefieldSO', 'IN');
                    o_response = this._cs_so_valfield(context);

                    return o_response;
                } catch (e) {
                    log.error('tjincATX_validatefieldSO', e);
                }
            },

            tjincATX_validatelineSO: function (context) {
                var o_response = true;
                var o_user = runtime.getCurrentUser();
                try {
                    log.debug('tjincATX_validateline', 'IN');
                    //CS SO BasePrice
                    o_response = this._cs_so_baseprice(context);
                    o_response = this._cs_so_purchasereq(context);

                    // if (o_user.roleCenter === s_customer_center || parseInt(o_user.id) === 6447 || parseInt(o_user.id) === 25918) {
                        o_response = this._xto_trailerhide_vline(context);
                    // }

                    return o_response;
                } catch (e) {
                    log.error('tjincATX_validatelineSO', e);
                }
            },

            tjincATX_validatedeleteSO: function (context) {
                var b_response = true;
                try {
                    log.debug('tjincATX_validatedeleteSO', 'IN');
                    b_response = this._so_fieldchange_delete(context);
                    return b_response;
                } catch (e) {
                    log.error('tjincATX_validatedeleteSO', e);
                    return b_response;
                }
            },

            tjincATX_saveRecordSO: function (context) {
                var b_response = true;
                try {
                    log.debug('tjincATX_saveRecordSO', 'IN');
                    //Signature
                    b_response = this._signature(context);
                    if (b_response) {
                        b_response = this._so_onsave(context);
                    }
                    return b_response;
                } catch (e) {
                    log.error('tjincATX_saveRecordSO', e);
                    return b_response;
                }
            }
        }
    });