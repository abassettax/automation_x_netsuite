function starttime()
{

  jQuery('#custpage_clockin').hide();
 //  jQuery('#custpage_test').hide()
var starttime = new Date();

var salaryemp = nlapiLookupField('employee', nlapiGetFieldValue('employee'), 'usetimedata');
if(salaryemp =="F" )
{
alert("Your employee record shows you are salaried.  Time cards are for hourly employees, if you are an hourly employee and getting this error please have HR correct the USE TIME DATA field on your employee record under the payroll tab.  If you are attempting to enter time off please select the AX Time Off form.");
return false;
}



var weekday = starttime.getDay();
var dd = starttime.getDate();
var mm = starttime.getMonth()+1;
var y = starttime.getFullYear();
var hour = starttime.getHours();
var minutes = starttime.getMinutes();
var hourstart = starttime.getHours();
var minutesstart = starttime.getMinutes();
var amPMstart =  (hour  >= 12) ? (' pm') : (' am');

if( minutesstart <10 )
{
minutesstart = "0"+minutesstart ;
}

if( hourstart >12 )
{
hourstart =hourstart -12 ;
}

var starttime =  mm  + '/'+dd+ '/'+ y + " " + hourstart + ":" + minutesstart + ":00"+amPMstart ;



//-------------------------------------------------------------------------------------------------------
var timecarddate = nlapiGetFieldValue('trandate');

var starttimecard = nlapiCreateRecord('timebill');

starttimecard.setFieldValue( 'employee',  nlapiGetUser());

starttimecard.setFieldValue( 'trandate', timecarddate);

starttimecard.setFieldValue( 'hours', "00"+":"+"00");

starttimecard.setFieldValue( 'payrollitem', 3);

starttimecard.setFieldValue( 'custcol69', starttime );


  
nlapiSubmitRecord(starttimecard, true); 

var idd = starttimecard.getFieldValue( 'id' );


//-----------------------------------------------------------------------------------------------
  //nlapiSetRedirectURL('TASKLINK', 'CARD_-29');
  var response =  "https://system.na3.netsuite.com/app/center/card.nl?sc="; //nlapiResolveURL('RECORD', 'timebill',idd );
   window.location.assign(response);

}


////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


function stoptime()
{
  jQuery('#custpage_clockout').hide();
var stoptime = new Date();
var weekday = stoptime.getDay();
var dd = stoptime.getDate();
var mm = stoptime.getMonth()+1;
var y = stoptime.getFullYear();
var hour = stoptime.getHours();
var hoursstop = stoptime.getHours();
var minutes = stoptime.getMinutes();
var minutesstop = stoptime.getMinutes();
var amPM =  (hour  >= 12) ? (' pm') : (' am');


if( minutesstop <10 )
{
minutesstop = "0"+minutes ;
}

if( hoursstop >12 )
{
hoursstop =hoursstop -12 ;
}


var stoptime =  mm  + "/"+dd+ "/"+ y + " " + hoursstop + ":" + minutesstop + ":00"+amPM ;
var stoptimeformat =  stoptime ;//nlapiDateToString(stoptime, 'datetime');


var diff = Math.abs(new Date(nlapiGetFieldValue('custcol69'))- new Date(stoptimeformat ));
var minutess = Math.floor((diff/1000)/60);

var newhours = Math.floor(minutess/60);
var newmin =  minutess - (newhours *60);




hrDiff = Math.abs(newhours );//Math.abs(hrDiff );
minDiff =Math.abs(newmin ); //Math.abs(minDiff );



if( minDiff <10 )
{
minDiff = "0"+minDiff ;
}

var timeEntry =  hrDiff+":"+minDiff ;



//---------------------------------------------------------------------- end format duration



//-----------------------------------------------------------------------overtime time check

var currentdurration =  hrDiff+"."+ parseInt(parseFloat(minDiff/60)*100) ;


  
var regularhoursworked = 0;
  
var DateRange = new Date(nlapiGetFieldValue('trandate'));
 var eDateRange = new Date(nlapiGetFieldValue('trandate'));
var timecardweekday = DateRange.getDay();
var startweekday = timecardweekday - 1;
var endweekday = parseInt(6 - timecardweekday);


var searchstartdate =   new Date(DateRange.setDate(DateRange.getDate() -timecardweekday));  
var dd = searchstartdate.getDate();
var mm = searchstartdate.getMonth()+1;
var y = searchstartdate.getFullYear();
var searchstartdateformated=  mm  + '/'+dd+ '/'+ y;
  
  var searchendate =  new Date(eDateRange.setDate(eDateRange.getDate() + endweekday));
var edd = searchendate.getDate();
var emm = searchendate.getMonth()+1;
var ey = searchendate.getFullYear();
var searchendateformated=  emm  + '/'+edd+ '/'+ ey;
  
    //alert(searchstartdateformated);
    //alert(searchendateformated);
var timeid = nlapiGetFieldValue('id') 
  
 var filter= new Array();  
  filter[0] = new nlobjSearchFilter("date", null ,"within", searchstartdateformated,searchendateformated);
  filter[1] = new nlobjSearchFilter("payitem", null ,"anyof","3");
  filter[2] = new nlobjSearchFilter("internalidnumber", null ,"notequalto", timeid);
  
var overtime = nlapiSearchRecord('timebill', 2360, filter, null );

for(y =0; overtime != null && y< overtime.length; y++)
 		{

var overtimeR = overtime[y];
var empIds= overtimeR.getValue("employee",null,"GROUP");
if(empIds == nlapiGetFieldValue('employee')  )
{
var regularhoursworked = overtimeR.getValue("durationdecimal",null,"SUM");
 //alert(regularhoursworked + " " + "reghours" );  
 //  alert(currentdurration + " " + "currentdurration" );  
}

             }

var newhoursworked =parseFloat(regularhoursworked)+ parseFloat(currentdurration);
//alert(newhoursworked);

if((parseFloat(regularhoursworked)  )>= 40  ) /// overtime
{
//alert("overtime " + timeEntry );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'hours' , timeEntry );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'custcol70' , stoptimeformat );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'payrollitem', "15");

}
else if((newhoursworked ) > 40  && regularhoursworked < 40  )
{
//alert(newhoursworked + "  " +"Split" ); //asdf
  
/////////////////////////////OT split
 var overtimehours = newhoursworked - 40;
overtimehours = overtimehours.toFixed(2);

var employees = nlapiGetFieldValue('employee');
var timecarddate = nlapiGetFieldValue('trandate');
var OTreferencetime = "Time entry was split between regular wage and overtime. Official time record is located on regular payTIME ID # " + nlapiGetFieldValue('custcol71');

var starttimecard = nlapiCreateRecord('timebill');

starttimecard.setFieldValue( 'employee',  employees );
starttimecard.setFieldValue( 'trandate', timecarddate);
starttimecard.setFieldValue( 'hours',overtimehours );
starttimecard.setFieldValue( 'payrollitem', 15);
starttimecard.setFieldValue( 'memo', OTreferencetime );
nlapiSubmitRecord(starttimecard, true); 
//----------------------------end ot on split

//regular hours worked on split
var regularhoursworkedbeforeOT = parseFloat(currentdurration) -overtimehours ;
regularhoursworkedbeforeOT = regularhoursworkedbeforeOT.toFixed(2);

nlapiSubmitField('timebill' , nlapiGetRecordId(), 'hours' , regularhoursworkedbeforeOT );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'custcol70' , stoptimeformat );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'payrollitem' , 3);


}
else if((parseFloat(regularhoursworked) + parseFloat(currentdurration)) <= 40  )
{
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'hours' , timeEntry );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'custcol70' , stoptimeformat );
nlapiSubmitField('timebill' , nlapiGetRecordId(), 'payrollitem' , 3);



}

//---------------------------------------------------------------------------------end over time check


var idd = nlapiGetRecordId();

   var response = nlapiResolveURL('RECORD', 'timebill',idd );
   window.location.assign(response);

      

}

/////////////////////////////////////////////////////////////////////