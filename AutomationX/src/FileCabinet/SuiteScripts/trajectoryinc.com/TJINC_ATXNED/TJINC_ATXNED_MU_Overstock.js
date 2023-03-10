/**
 *@NApiVersion 2.1
 *@NScriptType MassUpdateScript
 */

/**
* Copyright (c) 2022 Trajectory Inc.
* 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2
* www.trajectoryinc.com
* All Rights Reserved.
*/

/**
 * @System: AutomationX
 * @Version: 1.0.0
 * @Company: Trajectory Inc.
 * @CreationDate: 20220125
 * @FileName: TJINC_ATXNED_MU_Overstock.js
 * @NamingStandard: TJINC_NSJ-2-1-0
 */

define(['N/record', 'N/search', 'N/format', '/SuiteBundles/Bundle 310544/TJINC_NS_Library_SS21'],
    function (record, search, format, tj) {
        function each(params) {
            let o_rec, o_totals, o_fields, o_temp, o_location;
            let b_overstock = false, b_overstockcompy = false, b_prefmatch = false;
            let i;
            const i_monthsago = 3;
            // const o_locclass = { 'A': 1, 'C': 3 };
            const o_formula = search.createColumn({ name: 'formulanumeric', formula: 'CASE WHEN {type}=\'Inventory Item\' THEN {transaction.quantity} ELSE ({transaction.quantity}*{memberquantity}) END' });
            
            try {
                o_rec = record.load({ type: params.type, id: params.id, isDynamic: true });
                o_fields = {
                    name: o_rec.getValue({ fieldId: 'itemid' }),
                    actclass: o_rec.getValue({ fieldId: 'custitem61' }),
                    overstock: o_rec.getValue({ fieldId: 'custitemoverstocked' }),
                    overstock_tj: o_rec.getValue({ fieldId: 'custitem_tjinc_overstocked_company' }),
                    overstock_loc: false
                };
    
                // let d_date = new Date();
                // d_date.setDate(d_date.getDate() + 30);
    
                let o_item_locations = tj.searchAll({
                    search: search.create({
                        type: search.Type.ITEM,
                        filters:
                        [
                           ['internalid','anyof',o_rec.id]
                        ],
                        columns:
                        [
                           'itemid',
                           'inventorylocation',
                           'locationquantityonhand',
                           'locationquantityavailable',
                           'locationpreferredstocklevel'
                        ]
                    })
                });
    
                o_totals = {
                    available: 0,
                    preffered: 0
                };
                
                for (i = 0; i < o_item_locations.length; i++) {
                    o_location = {
                        available: parseInt(o_item_locations[i].getValue({ name: 'locationquantityavailable' })) || 0,
                        peferredstock: parseInt(o_item_locations[i].getValue({ name: 'locationpreferredstocklevel' })) || 0,
                    };
    
                    o_totals.available += o_location.available;
                    o_totals.preffered += o_location.peferredstock;

                    if (o_location.peferredstock > 0) {
                        b_prefmatch = true;
                        if (o_location.available - o_location.peferredstock > 0) {
                            o_fields.overstock_loc = true;
                        }
                    }
                }
    
                //ATX-15
                // Moved the submiting to database instance outside the for loop, in order to avoid a reference to an outdated field.
                // If more than one location needs update, it should be done all together.
    
                // Is this item over stocked, Company wide?
                if (b_prefmatch && (o_totals.available - o_totals.preffered) > 0) {
                    // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
                    if (o_fields.overstock_tj !== 'T') {
                        b_overstockcompy = true
                        log.audit('FLAGGING AS OVERSTOCKED (Company)','Flagging ' + o_fields.name + ' (' + params.type + ',' + params.id + ') - as OVERSTOCKED!');
                    }
                } else {
                    // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
                    if (o_fields.overstock_tj !== 'F') {
                        b_overstockcompy = false;
                        log.audit('FLAGGING AS NOT OVERSTOCKED (Company)','Flagging ' + o_fields.name + ' (' + params.type + ',' + params.id + ') - as NOT OVERSTOCKED!');
                    }
                }
    
                if (o_fields.overstock_loc) {
                    // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
                    if (o_fields.overstock !== 'T') {
                        b_overstock = true;
                        log.audit('FLAGGING AS OVERSTOCKED (Location)','Flagging ' + o_fields.name + ' (' + params.type + ',' + params.id + ') - as OVERSTOCKED!');
                    }
                } else {
                    // Don't bother updating if it is ALREADY flagged as overstocked (keeps the logs clean).
                    if (o_fields.overstock !== 'F') {
                        b_overstock = false;
                        log.audit('FLAGGING AS NOT OVERSTOCKED (Location)','Flagging ' + o_fields.name + ' (' + params.type + ',' + params.id + ') - as NOT OVERSTOCKED!');
                    }
                }
    
                //TODO: this gets demand data, specifically from IFs. should switch to SOs and their ship dates
                let o_itemusage_v2 = tj.searchAll({
                    search: search.create({
                        type: "transaction",
                        filters:
                        [
                            ["type","anyof","WorkOrd","SalesOrd"], 
                            "AND", 
                            ["mainline","is","F"], 
                            "AND", 
                            ["taxline","is","F"], 
                            "AND", 
                            ["shipping","is","F"], 
                            "AND", 
                            ["shipdate","onorafter","daysago90"], 
                            "AND", 
                            ["closed","is","F"], 
                            "AND", 
                            ["location","anyof","82","227","74","228","215","223","47","229","55","230","34","231","42","232","32","233","4","234","41","235","17","236","60","237","219","218"], 
                            "AND", 
                            ["quantity","greaterthan","0"],
                            "AND", 
                            ["item","anyof",params.id]
                        ],
                        columns:
                        [
                            search.createColumn({
                                name: "shipdate",
                                label: "Date"
                            }),
                            search.createColumn({
                                name: "quantity",
                                label: "Quantity"
                            })
                        ]
                    })
                });

                var i_totalsold_v2 = 0;
                var i_avgdemand_v2 = 0;

                for(let j=0; j < o_itemusage_v2.length;j++){
                    i_totalsold_v2 += parseInt(o_itemusage_v2[j].getValue({ name: 'quantity'}));
                }

                i_avgdemand_v2 = (i_totalsold_v2/i_monthsago).toFixed(1);
                
                o_temp = {
                    today: new Date(),
                    start: new Date(),
                    montht: {},
                    monthd: {},
                    totalu: 0,
                    tempval: 0,
                    monthkey: 0
                };
                o_temp.today.setDate(1);
                o_temp.start.setDate(1);
                o_temp.start.setMonth(o_temp.today.getMonth() - i_monthsago);
    
                if (o_itemusage_v2) {
    
                    for (i = 0; i <= i_monthsago; i++) {
                        o_temp.tempval = o_temp.start.getFullYear() + '' + pad2(o_temp.start.getMonth());
                        o_temp.montht[o_temp.tempval] = 0;
                        o_temp.monthd[o_temp.tempval] = 0;
                        o_temp.start.setMonth(o_temp.start.getMonth() + 1);
                    }
    
                    for (i = 0; i < o_itemusage_v2.length; i++) {
                        o_temp.tempval = new Date(o_itemusage_v2[i].getValue({ name: 'shipdate'}));
                        o_temp.monthkey = o_temp.tempval.getFullYear() + '' + pad2(o_temp.tempval.getMonth());
                        o_temp.montht[o_temp.monthkey] += parseFloat(o_itemusage_v2[i].getValue({ name: 'quantity'}));
                        o_temp.totalu += parseFloat(o_itemusage_v2[i].getValue({ name: 'quantity'}));
                    }
                }
    
                /*
                * Calculate Demand Trend %
                */
    
                var i_monthA, i_monthB, i_avgdemandtrend;
                if (o_temp.montht) {
                    // Reset startDate
                    o_temp.start.setMonth(o_temp.today.getMonth() - i_monthsago);
    
                    for (i = 0; i < i_monthsago; i++) {
                        i_monthA = o_temp.start.getFullYear() + '' + pad2(o_temp.start.getMonth());
                        o_temp.start.setMonth(o_temp.start.getMonth() + 1);
                        i_monthB = o_temp.start.getFullYear() + '' + pad2(o_temp.start.getMonth());
                        o_temp.monthd[i_monthB] = ((o_temp.montht[i_monthB] - o_temp.montht[i_monthA]) / o_temp.montht[i_monthA]) * 100;
                    }
                }
                i_avgdemandtrend = 0;
    
                for (var percent in o_temp.monthd) {
                    if (o_temp.monthd[percent]) {
                        i_avgdemandtrend += o_temp.monthd[percent];
                    }
                }
    
                i_avgdemandtrend = (i_avgdemandtrend / i_monthsago).toFixed(0);
    

                let i_monthsOnHand_v2 = 0;
                if (i_avgdemand_v2 > 0) {
                    i_monthsOnHand_v2 = (o_totals.available / i_avgdemand_v2).toFixed(0);
                } else if (!i_avgdemand_v2 && o_totals.available > 0) { 
                    i_monthsOnHand_v2 = 99; 
                }
    
                record.submitFields({
                    type: params.type,
                    id: params.id,
                    values: {
                        custitem_tjinc_summaryperiod: i_monthsago,
                        custitem_tjinc_totalunitssold: i_totalsold_v2,
                        custitem_tjinc_averagedemand: i_avgdemand_v2,
                        custitem_tjinc_averagedemandtrend: i_avgdemandtrend,
                        custitem_tjinc_monthlytotals: JSON.stringify(o_temp.montht),
                        custitem_tjinc_monthlydifferences: JSON.stringify(o_temp.monthd),
                        custitem_tjinc_monthsonhand: i_monthsOnHand_v2,
                        custitem_tjinc_overstocked_company: b_overstock,
                        custitemoverstocked: b_overstockcompy
                    },
                    options: {
                        enablesourcing: true
                    }
                });
            } catch (e) {
                log.error('TJINC_ATXNED_MU_Overstock record id:' + o_rec.id, e);
            }
        }

        function pad2(number){
            'use strict';
            return (number < 10 ? '0' : '') + number;
        }

        return {
            each: each
        };
    });