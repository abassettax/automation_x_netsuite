define('SmartMerchand.Model'
    , [
        'SC.Model'
        , 'underscore'
    ]
    , function (

        SCModel
        , _
    ) {

        'use strict';

        return SCModel.extend({

            name: 'SmartMerchand.Model'

            , getItemsSS: function (id) {

                try {

                    nlapiLogExecution('ERROR', 'getItems', 'Starting loading items...');

                    var suiteletURL = nlapiResolveURL('SUITELET', 'customscript_tt_smart_merchand_ss_result', 'customdeploy_tt_smart_merchand_ss_result', true);
                    
                    suiteletURL = suiteletURL + '&ssid=' + id;
                    
                    var suiteletResponse = nlapiRequestURL(suiteletURL).getBody();

                    nlapiLogExecution('ERROR', 'suiteletResponse', suiteletResponse);
                    var result = JSON.parse(suiteletResponse);
                    
                    nlapiLogExecution('ERROR', 'Result', result);

                } catch (e) {
                    nlapiLogExecution('ERROR', 'EXCEPTION', e);
                    
                }

                return result;
            }
        });
    });