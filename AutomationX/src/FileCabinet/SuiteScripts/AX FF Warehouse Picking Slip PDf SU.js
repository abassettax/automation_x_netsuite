/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/log", "N/record", "N/render"],
function(log, record, render) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
        log.debug('Request Params', context.request.parameters);
        if(context.request.method == 'GET'){
            var recId = context.request.parameters.recid;
            //TODO: need to load if, get all required fields/data for manual xml
            log.debug('Request itemId', parseInt(recId));

            var ffrec = record.load({
                type: record.Type.ITEM_FULFILLMENT,
                id: recId,
                isDynamic: true,
            });
            var recordName = ffrec.getValue({
                fieldId: 'tranid'
            });
            var recordDate = ffrec.getText({
                fieldId: 'trandate'
            });
            var ffLines = ffrec.getLineCount({
                sublistId: 'item'
            });
            var lineData = [];
            for (var i = 0; i < ffLines; i++) {
                var fivecode = ffrec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol38',
                    line: i
                });
                var item = ffrec.getSublistText({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });
                item = item.replace("&", "and");
                var desc = ffrec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'itemdescription',
                    line: i
                });
                desc = desc.replace("&", "and");
                var qty = ffrec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i
                });
                ffrec.selectLine({
                    sublistId: 'item',
                    line: i
                });
                var hasSubrecord = ffrec.hasCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                });
                if (hasSubrecord) {
                    var objSubRecord = ffrec.getCurrentSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    });
                    var invAssignLines = objSubRecord.getLineCount({
                        sublistId: 'inventoryassignment'
                    });
                    for (var j = 0; j < invAssignLines; j++) {
                        var bin = objSubRecord.getSublistText({
                            sublistId: 'inventoryassignment',
                            fieldId: 'binnumber',
                            line: j
                        });
                        var binqty = objSubRecord.getSublistText({
                            sublistId: 'inventoryassignment',
                            fieldId: 'quantity',
                            line: j
                        });
                        lineData.push({
                            fivecode: fivecode,
                            item: item,
                            desc: desc,
                            bin: bin,
                            qty: binqty 
                        });
                    }
                } else {
                    lineData.push({
                        fivecode: fivecode,
                        item: item,
                        desc: desc,
                        bin: '',
                        qty: qty 
                    });
                }
            }
            // log.debug({
            //     title: 'processing data',
            //     details: 'lineData: ' + JSON.stringify(lineData)
            // });
            lineData.sort(function(a,b) { 
                if ( a.bin < b.bin ){
                    return -1;
                }
                if ( a.bin > b.bin ){
                    return 1;
                }
                return 0;
            });
            log.debug({
                title: 'processing data',
                details: 'lineData sorted: ' + JSON.stringify(lineData)
            });
            
            var xmlStr = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdf><head><macrolist><macro id="nlheader"><table align="left" style="font-size:10pt;width:100%;"><tr>';
            //TODO: company logo not working with xml validation
            // xmlStr += '<td rowspan="3" style="padding: 0;"><img src="https://422523.app.netsuite.com/core/media/media.nl?id=14004702&c=422523&h=XZR_Wm2Ld9ctqR1LefJScwFIfIMYqeXnIjSlPLrfRXt_gsLA"; style="float: left; margin: 5px; width: 300px; height: 75px; " /><br />&nbsp;</td>';
            xmlStr += '<td align="center" style="padding: 0;"><span style="font-size: 24pt;">Warehouse Picking Slip</span></td></tr><tr><td align="right" style="padding: 0;"><span style="font-size: 16pt;">FF '+recordName+'</span></td></tr><tr><td align="right" style="padding: 0;">'+recordDate+'</td></tr></table></macro>';
            xmlStr += '<macro id="nlfooter"><table style="width: 100%; font-size: 7pt;"><tr>'
            //TODO: qr code and barcode links not working with xml validation
            // xmlStr += '<td  style="height: 90px; overflow:hidden; align:left;"><barcode codetype="qrcode" height="85px" width="85px" showtext="false" value=" https://422523.app.netsuite.com/app/accounting/transactions/itemship.nl?id='+recId+'&e=T/></td><td align="left" valign="middle" width="150px"><barcode codetype="code128" showtext="true" value='+recordName+'/></td>';
            xmlStr += '<td align="right" style="padding: 0;"><pagenumber/><span style="font-size: 12px;">&nbsp; of &nbsp;</span><totalpages/></td>';
            xmlStr += '</tr></table></macro></macrolist><style type="text/css">table {font-family: sans-serif; font-size: 9pt; table-layout: fixed;} th {font-weight: bold; font-size: 8pt; vertical-align: middle; padding: 3px 3px 3px; background-color: #e3e3e3; color: #333333; }</style></head>';
            xmlStr += '<body header="nlheader" header-height="10%" footer="nlfooter" footer-height="50pt" padding="0.5in 0.5in 0.5in 0.5in" size="Letter">';
            xmlStr += '<p align="center" style="font-size: 18pt; font-weight: bold;">INTERNAL WAREHOUSE USE ONLY</p>';
            xmlStr += '<table class="itemtable" style="width: 100%; margin-top: 10px;"><thead><tr style="border:1px solid #d3d3d3;"><th colspan="3" style="align: center;">5 Code</th><th colspan="9" style="align: left;">Item Name</th><th colspan="6" style="align: center;">Bin(s)</th><th colspan="3" style="align: center; font-size:10px;">Quantity</th></tr></thead>';
            
            //loop item ff lines to generate rows
            for (var i = 0; i < ffLines; i++) {
                var row5Code = lineData[i].fivecode;
                var rowItem = lineData[i].item;
                var rowDesc = lineData[i].desc;
                var rowBins = lineData[i].bin;
                var rowQty = lineData[i].qty;
                xmlStr += '<tr style="border:1px solid #f2f2f2;">';                
                xmlStr += '<td colspan="3" line-height="150%" style="align: center;">'+row5Code+'</td>';
                xmlStr += '<td colspan="9"><span style="font-weight: bold;">'+rowItem+'</span><br />'+rowDesc+'</td>';
                xmlStr += '<td colspan="6" align="center"><span style="font-weight: bold; font-size:12px; ">'+rowBins+'</span></td>';
                xmlStr += '<td  bgcolor="#f9fafc" align="center" colspan="3"><span style="font-weight: bold; font-size:12px; ">'+rowQty+'</span></td></tr>';
            }
            xmlStr += '</table></body></pdf>';
            // log.debug('xmlStr', xmlStr);

            context.response.renderPdf(xmlStr);
        }
    }

    return {
        onRequest: onRequest
    };
    
});
