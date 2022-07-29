/**
* Copyright (c) 2017 Trajectory Inc.
* 250 The Esplanade, Suite 402, Toronto, ON, Canada, M5A 1J2 
* www.trajectoryinc.com
* All Rights Reserved.
*/

/**
* @System: AutomationX
* @Company: Trajectory Inc.
* @CreationDate: 2012/03/16
* @GeneralDescription: This script is to enforce Swish Data specific Time Sheet rules.
* @LastModificationDate: 2017/09/21
* @NamingStandard: TJINC_NSJ-1-1
* @Version 1.0.1
*/

/*
 * @Function: TJINC_OnSave
 * @Purpose: This function loads
 * @Parameters: Type (default) Defaults record Type
 *              Name (default) the field that is being updated
 *              linenum (default) the line index of the lineitem
 */
function OrderItems(request,response) {
	var html = '<html><head>';
	html += '<link rel="stylesheet" type="text/css" href="/core/media/media.nl?id=324124&c=422523&h=d53de633affc8083b35b&_xt=.css" />';
	html += '<script type="text/javascript" src="/core/media/media.nl?id=324351&c=422523&h=8e111bf1f7d18bd4354d&_xt=.js"></script>';
	html += '<script type="text/javascript">';
	html += '$(document).ready(function () {';
	html += '   $("#orderitems").load(function () {';
	html += "   $('#orderitems').contents().find('head').append('<link rel=\"stylesheet\" type=\"text/css\" href=\"/core/media/media.nl?id=324124&c=422523&h=d53de633affc8083b35b&_xt=.css\" />');";
	html += "$('#orderitems').contents().find('table#items_splits tr>td:nth-child(3)').each(function () {";
	html += "  $(this).qtip({";
	html += "    content: {";
	html += "      text: '<img class=\"throbber\" src=\"/core/media/media.nl?id=337870&c=422523&h=47fce0bc400debd47024\" alt=\"Loading...\" />',";
	html += "      ajax: {";
	html += "        url: \"/app/site/hosting/scriptlet.nl?script=178&deploy=1&locationName=\"+ encodeURIComponent($(this).prev().text()) +\"&itemName=\"+ encodeURIComponent( $(this).text() )";
	html += "      },";
	html += "      title: {";
	html += "        text: 'Inventory Summary for ' + $(this).text(),";
	html += "        button: true";
	html += "      }";
	html += "    },";
	html += "    position: {";
	html += "      target: [300, 10],";     
	html += "      viewport: $(window),";
	html += "      effect: false";
	html += "    },";
	html += "    show: {";
	html += "      event: 'mouseenter',";
	html += "      solo: true";
	html += "    },";
	html += "    hide: 'unfocus',";
	html += "    style: {";
	html += "      classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow'";
	html += "    }";
	html += "  });";
	html += "});";
	html += '   });';
	html += '});';
	html += '</script>';
	html += '</head><body style="margin:0;">';
	html += '<iframe id="orderitems" src="/app/accounting/transactions/orderitems.nl" style="border: 0; width: 100%; height: 100%"></iframe>';
	html += '</body></html>';
	response.write( html );
}