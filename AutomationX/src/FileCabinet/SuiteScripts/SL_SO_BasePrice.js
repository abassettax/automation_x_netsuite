/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search'],
function(search) {
   
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
            var itemId = context.request.parameters.itemid;
            log.debug('Request itemId', itemId);
            var result = search.lookupFields({
                type: search.Type.INVENTORY_ITEM,
                id: itemId+"",
                columns: ["dontshowprice","baseprice"]
            });
            log.debug('Result', JSON.stringify(result));
            context.response.write(JSON.stringify(result));
        }
    }

    return {
        onRequest: onRequest
    };
    
});