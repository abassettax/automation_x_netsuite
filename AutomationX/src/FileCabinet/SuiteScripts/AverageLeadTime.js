function averageleadtime(rec_type, rec_id)  
{
var columns = new Array();
 
 columns[0] = new nlobjSearchColumn("locationleadtime",null,"AVG");
 columns[1] =new nlobjSearchColumn("internalid",null,"GROUP").setSort(false);
  columns[2] =new nlobjSearchColumn("custitem82",null,"GROUP");
var itemSearch = nlapiSearchRecord("item",null,
[
  ["locationleadtime","greaterthan","0"], 
   "AND", 
   ["inventorylocation.custrecord17","is","T"], 
   "AND", 
 ["locationleadtime","greaterthan","0"],
   "AND", 
   ["internalidnumber","equalto",rec_id]
], 
columns 
);


  for ( var mm = 0; itemSearch != null && mm < itemSearch.length ; mm++ )
 		{
          
    var averagelead = Math.ceil(itemSearch[mm].getValue(columns[mm]));
averagelead= averagelead.toFixed(1);

  if(averagelead !=  itemSearch[mm].getValue(columns[2]) )
     {

    nlapiSubmitField(rec_type , rec_id,  'custitem82'  ,   averagelead , false);
    nlapiLogExecution('debug', 'averagelead - leadtime - item', averagelead +' - '+ itemSearch[mm].getValue(columns[2])  +' - '+ rec_id);
 
   
     }
          
          
          
        }
}
