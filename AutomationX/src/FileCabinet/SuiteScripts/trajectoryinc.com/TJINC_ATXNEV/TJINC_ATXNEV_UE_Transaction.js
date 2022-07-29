/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/**
 * Copyright (c) 2021 Trajectory Inc.
 * 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: Automation X
 * @Module: Events
 * @Version: 1.0.0
 * @Company: Trajectory Inc.
 * @CreationDate: 20210210
 * @FileName: TJINC_ATXNEV_UE_Transaction.js
 * @NamingStandard: TJINC_NSJ-2-1-0
 */
 define(['N/record',
 '/SuiteScripts/trajectoryinc.com/TJINC_ATXNED/TJINC_ATXNED_UE_Main'],
 function (record, lib) {
     function tjincATX_afterSubmit(context) {
         switch (context.newRecord.type.toLowerCase()) {
             case record.Type.SALES_ORDER.toLowerCase():
                 lib.tjincATX_afterSubmitSO(context);
                 break;
         }
     }

     function tjincATX_beforeLoad(context) {
         switch (context.newRecord.type.toLowerCase()) {
             case record.Type.SALES_ORDER.toLowerCase():
                 lib.tjincATX_beforeLoadSO(context);
                 break;
         }
     }

     function tjincATX_beforeSubmit(context) {
         switch (context.newRecord.type.toLowerCase()) {
             case record.Type.SALES_ORDER.toLowerCase():
                 lib.tjincATX_beforeSubmitSO(context);
                 break;
         }
     }

     return {
         afterSubmit: tjincATX_afterSubmit,
         beforeLoad: tjincATX_beforeLoad,
         beforeSubmit: tjincATX_beforeSubmit
     };
 });