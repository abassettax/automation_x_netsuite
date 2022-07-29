/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */

/*
 * Copyright (c) 2021 Trajectory Inc.
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
 * @FileName: TJINC_ATXNEV_CS_Transaction.js
 * @NamingStandard: TJINC_NSJ-2-1-0
*/
define(['N/record', 
'/SuiteScripts/trajectoryinc.com/TJINC_ATXNED/TJINC_ATXNED_CS_Main'],
    function (record, lib) {
        function tjincATX_pageInit(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    lib.tjincATX_pageInitSO(context);
                    break;
            }
        }

        function tjincATX_lineInit(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    lib.tjincATX_lineInitSO(context);
                    break;
            }
        }
        
        function tjincATX_fieldChanged(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    lib.tjincATX_fieldChangedSO(context);
                    break;
            }
        }

        function tjincATX_sublistChanged(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    lib.tjincATX_sublistChangedSO(context);
                    break;
            }
        }

        function tjincATX_postSource(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    lib.tjincATX_postSourcingSO(context);
                    break;
            }
        }

        function tjincATX_validateline(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    return lib.tjincATX_validatelineSO(context);
                default:
                    return true;
            }
        }

        function tjincATX_validateDelete(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    return lib.tjincATX_validatedeleteSO(context);
                default:
                    return true;
            }
        }

        function tjincATX_saveRecord(context) {
            switch (context.currentRecord.type.toLowerCase()) {
                case record.Type.SALES_ORDER.toLowerCase():
                    return lib.tjincATX_saveRecordSO(context);
                default:
                    return true;
            }
        }

        return {
            fieldChanged: tjincATX_fieldChanged,
            postSourcing: tjincATX_postSource,
            lineInit: tjincATX_lineInit,
            pageInit: tjincATX_pageInit,
            saveRecord: tjincATX_saveRecord,
            sublistChanged: tjincATX_sublistChanged,
            validateLine: tjincATX_validateline,
            validateDelete: tjincATX_validateDelete
        };
    }
);