/**
 * Copyright (c) 2011 Trajectory Inc. 
 * 165 John St. 3rd Floor, Toronto, ON, Canada, M5T 1X3 
 * www.trajectoryinc.com 
 * All Rights Reserved. 
 */

/**
 * @System: Netsuite - Production
 * @Author: Darren Hill
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: 2012/03/16
 * @GeneralDescription: This script is to enforce Swish Data specific Time Sheet rules.
 * @LastModificationDate: 2012/03/22
 * @LastModificationAuthor: Darren Hill
 * @LastModificationDescription: Creation
 * @NamingStandard: TJINC_NSJ-1-1
 * @Version 1.0
 */

var AX_PURCHASING = 1052;
var ADMINISTRATOR = 3;
var FULL_ACCESS = 18;
var  AX_Inv_DataBase = 1078;

/*
 * @Function: TJINC_OnSave @Purpose: This function loads @Parameters: Type (default) Defaults record Type Name (default) the field that is being updated linenum (default) the line index of the lineitem @Returns: N/A
 */

/* exported TJINC_PageInit */

function TJINC_PageInit(type) {
  
  
  

  



    'use strict';
    var userRole = parseInt(nlapiGetRole(), 10);
    if (type.toString() === 'edit' && (userRole !== AX_PURCHASING && userRole !== AX_Inv_DataBase && userRole !== ADMINISTRATOR && userRole !== FULL_ACCESS)) {
        jQuery('td#inventorylnk').hide();
    }
}