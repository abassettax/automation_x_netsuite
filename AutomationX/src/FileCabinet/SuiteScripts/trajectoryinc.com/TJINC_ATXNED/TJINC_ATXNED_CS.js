/**
 * @NApiVersion 2.x
 */

/**
 * Copyright (c) 2021 Trajectory Inc.
 * 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: ATX
 * @Module: --
 * @Version: 1.0.0
 * @Company: Trajectory Inc.
 * @CreationDate: 20210531
 * @FileName: TJINC_ATXNED_CS.js
 * @NamingStandard: TJINC_NSJ-2-1-0
*/
define(['N/record','N/search',
'/SuiteBundles/Bundle 310544/TJINC_NS_Library_SS21'],
function (record, search, tj) {

    return {
        CopyRecordReprice: function (i_id, i_cust) {
            try{
                var s_url = 'https://system.na3.netsuite.com/app/accounting/transactions/salesord.nl?entity=' +  i_cust  + '&currentrecordType='+ record.Type.SALES_ORDER  + '&currentrecordID='+  i_id + '&axCopy=yes&whence=';
                //var s_url2 = 'https://system.na3.netsuite.com/app/accounting/transactions/salesord.nl?id='+i_id+'&whence=&e=T&memdoc=0';
                window.open(s_url,'_blank');
                window.open(s_url2,'_blank');
            }catch(e){
                console.error('error',e);
            }
            return true; 
        },

        axClose: function(i_id,s_rectype){
            var o_rec = record.load({ type: s_rectype, id: i_id, isDynamic: false });
            var i_itemline, o_searchvalues, s_statmessage, o_qty;
            var b_linematch = false;
            try{
                var o_so_search = tj.searchAll({
                    'search': search.create({
                        type: 'salesorder',
                        filters: [
                            ["type","anyof","SalesOrd"],"AND",
                            ["mainline","is","F"],"AND",
                            ["internalidnumber","equalto",i_id]
                        ],     
                        columns: ['line', 'quantitypicked', 'quantitypacked'],
                    })
                });
                for(var i=0; i<=o_rec.getLineItemCount('item');i++){
                    b_linematch = false;
                    i_itemline = o_rec.getSublistValue({ fieldId: 'line', sublistId: 'item', line: i });

                    for(var j=0;j<o_so_search.length; j++){
                        o_searchvalues = o_so_search[j];
                        if(i_itemline ===  o_searchvalues.getValue('line')){
                            b_linematch = true;
                            o_qty = {
                                qty: o_rec.getSublistValue({ fieldId: 'quantity', sublistId: 'item', line: i }),
                                qtypicked: o_searchvalues.getValue('quantitypicked'),
                                qtypacked: o_searchvalues.getValue('quantitypacked'),
                                qtybilled: o_rec.getSublistValue({ fieldId: 'quantitybilled', sublistId: 'item', line: i }),
                                qtyfulfilled: o_rec.getSublistValue({ fieldId: 'quantityfulfilled', sublistId: 'item', line: i })
                            }
                            s_statmessage ='\n\n Quantity Pulled: ' + o_qty.qty +'\n Quantity PickPacked:  ' + o_qty.qtypacked +'\n Quantity Fulfilled:  ' + o_qty.qtyfulfilled + '\n Quantity Invoiced:  ' + o_qty.qtybilled;

                            if(o_qty.qtypicked > o_qty.qtybilled){  
                                alert('Line # ' + i_itemline  + ' has a quantity fulfilled greater than billed so cannot be closed.  Please finish processing the fulfillment before closing. ' + s_statmessage ); 
                            }else if(o_qty.qty > 0){
                                o_rec.setSublistValue({ fieldId: 'isclosed', value: 'T', sublistId: 'item', line: i });
                            }
                            break;
                        }
                    }

                    if(!b_linematch ){
                        o_rec.setSublistValue({ fieldId: 'isclosed', value: 'T', sublistId: 'item', line: i });
                    }
                }
                o_rec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                window.location.reload()
            }catch(e){
                log.error('axClose',e);
            }
        },

        printstaginglabel: function(i_id){
            try{
                var printURL = 'https://422523.app.netsuite.com/app/common/custom/advancedprint/printsearchresults.nl?printType=SEARCH&l=T&e=T&id=5601&Transaction_INTERNALID='+i_id+'&style=NORMAL&report=&grid=&searchid=5601&dle=T&sortcol=Transaction_TRANDATE_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=139&whence=';
                window.open(printURL,'_blank');
            }catch(e){
                log.error('printstaginglabel');
            }
        },

        getParameterFromURL: function(param){
            param = (new URL(document.location.href)).searchParams.get(param) || '';
            return param;  
        }
    };
});