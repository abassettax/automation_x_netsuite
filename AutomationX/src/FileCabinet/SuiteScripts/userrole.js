function service(request, response) {
  var callBackFuncStr = request.getParameter('callback');
  var context = nlapiGetContext();
  var userRole = context.getRole();                // "admin"
  if (userRole)
  {
  var payload = { userRole: userRole };            // { userRole: "admin" }
  var json = JSON.stringify(payload);              // "{userRole:\"admin\"}"
  var jsonp = callBackFuncStr + "(" + json + ")";  // "callback716242({userRole:\"admin\"})"
  response.write(jsonp);
  } 
}

