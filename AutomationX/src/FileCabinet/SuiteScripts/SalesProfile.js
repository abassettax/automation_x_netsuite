function UpdateProfileSalesData( type )
{
  var columns = new Array();

 columns[0] =    new nlobjSearchColumn("internalid","customer","GROUP");
columns[1] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Charge Controller'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END"); //custentity275 Charge Controller Sales Time B
  
columns[2] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Battery'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END"); //custentity271 Battery Sales Time B
  
columns[3] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Solar panel'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity267 Solar Panel Sales Time B
  
columns[4] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Plunger Sensor'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity279 Plunger Sensor Sales Time B
  
columns[5] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Actuator'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity283 Actuator Sales Time b
  
columns[6] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Solenoid'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity287 Solenoid Sales Time B
  
columns[7] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Coaxial Surge Suppressor'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity291 Coaxial Surge Suppressor Sales Time B
columns[8] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Wireless I/O'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity295 Wireless Sales Time B
  
columns[9] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Antenna'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity299 Antenna Sales Time B
  
columns[10] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Radio'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity303 Radio Sales Time B
  
columns[11] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Liquid Level'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity307 Liquid Level Sales Time B
  
columns[12] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Manifold'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity311 Manifold Sales Time B
  
columns[13] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'GP Transmitter'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity315 GP Sales Time B
  
columns[14] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Multivariable'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity319 Multivariable Sales Time B
  
columns[15] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Meter Run'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity323 Meter Run Sales Time B
  
columns[16] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula(" CASE WHEN {item.custitem87} = 'Charge Controller'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity274 Charge Controller Sales Time A
  
columns[17] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Battery'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity270 Battery Sales Time A
  
columns[18] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Solar panel'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity266 Solar Panel Sales Time A
  
columns[19] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Plunger Sensor'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity278 Plunger Sensor Sales Time A
  
columns[20] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Actuator'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity282 Actuator Sales Time A
  
columns[21] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Solenoid'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity286 Solenoid Sales Time A
  
columns[22] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Coaxial Surge Suppressor'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity290 Coaxial Surge Suppressor Sales Time A
  
columns[23] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Wireless I/O'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity294 Wireless Sales Time A
  
columns[24] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Antenna'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity298 Antenna Sales Time A
  
columns[25] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Radio'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity302 Radio Sales Time A
  
columns[26] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Liquid Level'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity306 Liquid Level Sales Time A
  
columns[27] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Manifold'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity310 Manifold Sales Time A
  
columns[28] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'GP Transmitter'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity314 GP Sales Time A
  
columns[29] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Multivariable'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity318 Multivariable Sales Time A
  
columns[30] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Meter Run'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-15),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-13),'YYYYMM') THEN {netamountnotax} ELSE 0 END) ELSE 0 END");//custentity322 Meter Run Sales Time A
  
columns[31] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Charge Controller'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity276 Charge Controller Sales Time B Margin
  
columns[32] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Battery'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity272 Battery Sales Time B Margin
  
columns[33] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Solar panel'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity268 Solar Panel Sales Time B Margin
  
columns[34] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Plunger Sensor'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity280 Plunger Sensor Sales Time B Margin
  
columns[35] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Actuator'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity284 Actuator Sales Time B Margin
  
columns[36] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Solenoid'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity288 Solenoid Sales Time B Margin
  
columns[37] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Coaxial Surge Suppressor'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity292 Coaxial Surge Suppressor Sales Time B Margin
  
columns[38] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Wireless I/O'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity296 WirlessIO  Sales Time B Margin
  
columns[39] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Antenna'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity300 Antenna Sales Time B Margin
  
columns[40] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Radio'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity304 Radio Sales Time B Margin
  
columns[41] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Liquid Level'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity308 Liquid Level Sales Time B Margin
  
columns[42] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Manifold'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity312 Manifold Sales Time B Margin
  
columns[43] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'GP Transmitter'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity316 GP Sales Time B Margin
  
columns[44] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Multivariable'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity320 Multivariable Sales Time B Margin
  
columns[45] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN {item.custitem87} = 'Meter Run'  THEN (CASE WHEN TO_CHAR((case when {saleseffectivedate} IS NULL THEN {trandate} ELSE {saleseffectivedate} end),'YYYYMM') BETWEEN TO_CHAR(ADD_MONTHS({today} ,-3),'YYYYMM') AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM') THEN ({quantity} *{item.averagecost} ) ELSE 0 END) ELSE 0 END");//custentity324 Meter Run Sales Time B Margin

////////////////////////
  var searchresults = nlapiSearchRecord("invoice",null,
[
   ["type","anyof","CustInvc"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["item.custitem87","noneof","@NONE@"], 
   "AND", 
   ["trandate","onorafter","daysago500"]//, 
//   "AND", 
//   ["customer.internalidnumber","equalto","18198"]
],
columns
);
  
  
  /////////////////////////////////////////////
  
   var cust = "";
var ChargeControllerSalesTimeB=0;
var BatterySalesTimeB=0;
var SolarPanelSalesTimeB=0;
var PlungerSensorSalesTimeB=0;
var ActuatorSalesTimeb=0;
var SolenoidSalesTimeB=0;
var CoaxialSurgeSuppressorSalesTimeB=0;
var WirelessSalesTimeB=0;
var AntennaSalesTimeB=0;
var RadioSalesTimeB=0;
var LiquidLevelSalesTimeB=0;
var ManifoldSalesTimeB=0;
var GPSalesTimeB=0;
var MultivariableSalesTimeB=0;
var MeterRunSalesTimeB=0;
  ////////////////////////////////////
var ChargeControllerSalesTimeA=0;
var BatterySalesTimeA=0;
var SolarPanelSalesTimeA=0;
var PlungerSensorSalesTimeA=0;
var ActuatorSalesTimeA=0;
var SolenoidSalesTimeA=0;
var CoaxialSurgeSuppressorSalesTimeA=0;
var WirelessSalesTimeA=0;
var AntennaSalesTimeA=0;
var RadioSalesTimeA=0;
var LiquidLevelSalesTimeA=0;
var ManifoldSalesTimeA=0;
var GPSalesTimeA=0;
var MultivariableSalesTimeA=0;
var MeterRunSalesTimeA=0;
  //////////////////////////////////////////////
  
  
var CostChargeControllerSalesTimeBMargin=0;
var CostBatterySalesTimeBMargin=0;
var CostSolarPanelSalesTimeBMargin=0;
var CostPlungerSensorSalesTimeBMargin=0;
var CostActuatorSalesTimeBMargin=0;
var CostSolenoidSalesTimeBMargin=0;
var CostCoaxialSurgeSuppressorSalesTimeBMargin=0;
var CostWirlessIOSalesTimeBMargin=0;
var CostAntennaSalesTimeBMargin=0;
var CostRadioSalesTimeBMargin=0;
var CostLiquidLevelSalesTimeBMargin=0;
var CostManifoldSalesTimeBMargin=0;
var CostGPSalesTimeBMargin=0;
var CostMultivariableSalesTimeBMargin=0;
var CostMeterRunSalesTimeBMargin=0;
 /////////////////////////////////////////////////
  
var ChargeControllerSalesTimeBMargin=null;
var BatterySalesTimeBMargin=null;
var SolarPanelSalesTimeBMargin=null;
var PlungerSensorSalesTimeBMargin=null;
var ActuatorSalesTimeBMargin=null;
var SolenoidSalesTimeBMargin=null;
var CoaxialSurgeSuppressorSalesTimeBMargin=null;
var WirlessIOSalesTimeBMargin=null;
var AntennaSalesTimeBMargin=null;
var RadioSalesTimeBMargin=null;
var LiquidLevelSalesTimeBMargin=null;
var ManifoldSalesTimeBMargin=null;
var GPSalesTimeBMargin=null;
var MultivariableSalesTimeBMargin=null;
var MeterRunSalesTimeBMargin=null;




for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
 cust = searchresults[i].getValue(columns[0]);
 ChargeControllerSalesTimeB = searchresults[i].getValue(columns[1]);
 BatterySalesTimeB = searchresults[i].getValue(columns[2]);
 SolarPanelSalesTimeB = searchresults[i].getValue(columns[3]);
 PlungerSensorSalesTimeB = searchresults[i].getValue(columns[4]);
 ActuatorSalesTimeb = searchresults[i].getValue(columns[5]);
 SolenoidSalesTimeB = searchresults[i].getValue(columns[6]);
 CoaxialSurgeSuppressorSalesTimeB = searchresults[i].getValue(columns[7]);
 WirelessSalesTimeB = searchresults[i].getValue(columns[8]);
 AntennaSalesTimeB = searchresults[i].getValue(columns[9]);
 RadioSalesTimeB = searchresults[i].getValue(columns[10]);
 LiquidLevelSalesTimeB = searchresults[i].getValue(columns[11]);
 ManifoldSalesTimeB = searchresults[i].getValue(columns[12]);
 GPSalesTimeB = searchresults[i].getValue(columns[13]);
 MultivariableSalesTimeB = searchresults[i].getValue(columns[14]);
 MeterRunSalesTimeB = searchresults[i].getValue(columns[15]);
          ////////////////////////////////////
 ChargeControllerSalesTimeA = searchresults[i].getValue(columns[16]);
 BatterySalesTimeA = searchresults[i].getValue(columns[17]);
 SolarPanelSalesTimeA = searchresults[i].getValue(columns[18]);
 PlungerSensorSalesTimeA = searchresults[i].getValue(columns[19]);
 ActuatorSalesTimeA = searchresults[i].getValue(columns[20]);
 SolenoidSalesTimeA = searchresults[i].getValue(columns[21]);
 CoaxialSurgeSuppressorSalesTimeA = searchresults[i].getValue(columns[22]);
 WirelessSalesTimeA = searchresults[i].getValue(columns[23]);
 AntennaSalesTimeA = searchresults[i].getValue(columns[24]);
 RadioSalesTimeA = searchresults[i].getValue(columns[25]);
 LiquidLevelSalesTimeA = searchresults[i].getValue(columns[26]);
 ManifoldSalesTimeA = searchresults[i].getValue(columns[27]);
 GPSalesTimeA = searchresults[i].getValue(columns[28]);
 MultivariableSalesTimeA = searchresults[i].getValue(columns[29]);
 MeterRunSalesTimeA = searchresults[i].getValue(columns[30]);
   //////////////////////////////////////////////////
          
 CostChargeControllerSalesTimeBMargin = searchresults[i].getValue(columns[31]);
 CostBatterySalesTimeBMargin = searchresults[i].getValue(columns[32]);
 CostSolarPanelSalesTimeBMargin = searchresults[i].getValue(columns[33]);
 CostPlungerSensorSalesTimeBMargin = searchresults[i].getValue(columns[34]);
 CostActuatorSalesTimeBMargin = searchresults[i].getValue(columns[35]);
 CostSolenoidSalesTimeBMargin = searchresults[i].getValue(columns[36]);
 CostCoaxialSurgeSuppressorSalesTimeBMargin = searchresults[i].getValue(columns[37]);
 CostWirlessIOSalesTimeBMargin = searchresults[i].getValue(columns[38]);
 CostAntennaSalesTimeBMargin = searchresults[i].getValue(columns[39]);
 CostRadioSalesTimeBMargin = searchresults[i].getValue(columns[40]);
 CostLiquidLevelSalesTimeBMargin = searchresults[i].getValue(columns[41]);
 CostManifoldSalesTimeBMargin = searchresults[i].getValue(columns[42]);
 CostGPSalesTimeBMargin = searchresults[i].getValue(columns[43]);
 CostMultivariableSalesTimeBMargin = searchresults[i].getValue(columns[44]);
 CostMeterRunSalesTimeBMargin = searchresults[i].getValue(columns[45]);

 //////////////////////////////////

if ( ActuatorSalesTimeb > 0    ){ ActuatorSalesTimeBMargin = ((1-(CostActuatorSalesTimeBMargin/ActuatorSalesTimeb))*100).toFixed(2);  }
if ( AntennaSalesTimeB > 0    ){ AntennaSalesTimeBMargin = ((1-(CostAntennaSalesTimeBMargin/AntennaSalesTimeB))*100).toFixed(2);  }
if ( BatterySalesTimeB > 0    ){ BatterySalesTimeBMargin = ((1-(CostBatterySalesTimeBMargin/BatterySalesTimeB))*100).toFixed(2);  }
if ( ChargeControllerSalesTimeB > 0    ){ ChargeControllerSalesTimeBMargin = ((1-(CostChargeControllerSalesTimeBMargin/ChargeControllerSalesTimeB))*100).toFixed(2);  }
if ( CoaxialSurgeSuppressorSalesTimeB > 0    ){ CoaxialSurgeSuppressorSalesTimeBMargin = ((1-(CostCoaxialSurgeSuppressorSalesTimeBMargin/CoaxialSurgeSuppressorSalesTimeB))*100).toFixed(2);}  
if ( GPSalesTimeB > 0    ){ GPSalesTimeBMargin = ((1-(CostGPSalesTimeBMargin/GPSalesTimeB))*100).toFixed(2);  }
if ( LiquidLevelSalesTimeB > 0    ){ LiquidLevelSalesTimeBMargin = ((1-(CostLiquidLevelSalesTimeBMargin/LiquidLevelSalesTimeB))*100).toFixed(2);  }
if ( ManifoldSalesTimeB > 0    ){ ManifoldSalesTimeBMargin = ((1-(CostManifoldSalesTimeBMargin/ManifoldSalesTimeB))*100).toFixed(2);  }
if ( MeterRunSalesTimeB > 0    ){ MeterRunSalesTimeBMargin = ((1-(CostMeterRunSalesTimeBMargin/MeterRunSalesTimeB))*100).toFixed(2);  }
if ( MultivariableSalesTimeB > 0    ){ MultivariableSalesTimeBMargin = ((1-(CostMultivariableSalesTimeBMargin/MultivariableSalesTimeB))*100).toFixed(2);  }
if ( PlungerSensorSalesTimeB > 0    ){ PlungerSensorSalesTimeBMargin = ((1-(CostPlungerSensorSalesTimeBMargin/PlungerSensorSalesTimeB))*100).toFixed(2);  }
if ( RadioSalesTimeB > 0    ){ RadioSalesTimeBMargin = ((1-(CostRadioSalesTimeBMargin/RadioSalesTimeB))*100).toFixed(2);  }
if ( SolarPanelSalesTimeB > 0    ){ SolarPanelSalesTimeBMargin = ((1-(CostSolarPanelSalesTimeBMargin/SolarPanelSalesTimeB))*100).toFixed(2);  }
if ( SolenoidSalesTimeB > 0    ){ SolenoidSalesTimeBMargin = ((1-(CostSolenoidSalesTimeBMargin/SolenoidSalesTimeB))*100).toFixed(2);  }
if ( WirelessSalesTimeB > 0    ){ WirlessIOSalesTimeBMargin = ((1-(CostWirlessIOSalesTimeBMargin/WirelessSalesTimeB))*100).toFixed(2);  }



if(cust)
  {
 nlapiSubmitField('customer' , cust,['custentity275','custentity271','custentity267','custentity279','custentity283','custentity287','custentity291','custentity295','custentity299','custentity303','custentity307','custentity311','custentity315','custentity319','custentity323','custentity274','custentity270','custentity266','custentity278','custentity282','custentity286','custentity290','custentity294','custentity298','custentity302','custentity306','custentity310','custentity314','custentity318','custentity322','custentity276','custentity272','custentity268','custentity280','custentity284','custentity288','custentity292','custentity296','custentity300','custentity304','custentity308','custentity312','custentity316','custentity320','custentity324'
],[ChargeControllerSalesTimeB,BatterySalesTimeB,SolarPanelSalesTimeB,PlungerSensorSalesTimeB,ActuatorSalesTimeb,SolenoidSalesTimeB,CoaxialSurgeSuppressorSalesTimeB,WirelessSalesTimeB,AntennaSalesTimeB,RadioSalesTimeB,LiquidLevelSalesTimeB,ManifoldSalesTimeB,GPSalesTimeB,MultivariableSalesTimeB,MeterRunSalesTimeB,ChargeControllerSalesTimeA,BatterySalesTimeA,SolarPanelSalesTimeA,PlungerSensorSalesTimeA,ActuatorSalesTimeA,SolenoidSalesTimeA,CoaxialSurgeSuppressorSalesTimeA,WirelessSalesTimeA,AntennaSalesTimeA,RadioSalesTimeA,LiquidLevelSalesTimeA,ManifoldSalesTimeA,GPSalesTimeA,MultivariableSalesTimeA,MeterRunSalesTimeA,ChargeControllerSalesTimeBMargin,BatterySalesTimeBMargin,SolarPanelSalesTimeBMargin,PlungerSensorSalesTimeBMargin,ActuatorSalesTimeBMargin,SolenoidSalesTimeBMargin,CoaxialSurgeSuppressorSalesTimeBMargin,WirlessIOSalesTimeBMargin,AntennaSalesTimeBMargin,RadioSalesTimeBMargin,LiquidLevelSalesTimeBMargin,ManifoldSalesTimeBMargin,GPSalesTimeBMargin,MultivariableSalesTimeBMargin,MeterRunSalesTimeBMargin]);
       
  }
          nlapiLogExecution('debug', 'iid', GPSalesTimeB  );
        }
}