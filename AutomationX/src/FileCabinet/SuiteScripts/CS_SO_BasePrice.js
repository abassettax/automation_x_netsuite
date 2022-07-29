function useBasePrice(type) {
    try{
        if(nlapiGetContext().getExecutionContext() !== 'webstore') {
            return true;
        }
        if(type !== 'item'){
            return true;
        }
        var itemId = nlapiGetCurrentLineItemValue('item', 'item');
        nlapiLogExecution("DEBUG","ITEM ID",itemId);
        if(itemId){
            var url = "https://422523.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2181&deploy=1&compid=422523&h=28774658b128ac1f69a8&itemid="+itemId;
            var response = nlapiRequestURL(url);

            var item = JSON.parse(response.getBody());
            nlapiLogExecution("DEBUG","RESPONSE",JSON.stringify(item));
            if(item.dontshowprice){
                var basePrice = parseInt(item.baseprice);
                if(basePrice){
                    nlapiLogExecution("DEBUG","Set Base Price",JSON.stringify(basePrice));
                    nlapiSetCurrentLineItemValue('item', 'rate', basePrice, true, true);
                    return true;
                }
            }
        }
    }catch(e){
        nlapiLogExecution("DEBUG","Exception Error",JSON.stringify(e));
    }
    return true;
}
