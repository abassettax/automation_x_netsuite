//Script used to get items ids for Smart Merchand
function pullSSResults(request, response){


    var ssResultOut = [];
    var ssId = request.getParameter("ssid");
    try
    {

        var ssResult = nlapiLoadSearch('item',ssId, null, null);

        var ssResultSet = ssResult.runSearch();
        var ssResultSet = ssResultSet.getResults(0, 50);

        for (var i = 0; i < ssResultSet.length ; i++)
        {
            var resultItem = ssResultSet[i];

            ssResultOut.push(resultItem.getId());
        }
    }catch(e)
    {
        nlapiLogExecution('ERROR', 'Error', e);

    }

    response.write(JSON.stringify(ssResultOut));






}