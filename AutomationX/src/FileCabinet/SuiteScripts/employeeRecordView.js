function EmployeeRecord()
{


var user = nlapiGetUser();
var roles = nlapiGetRole();

if ( roles != "10599" && roles != "10954" && user != 3354  && user != 3004 && user != 27693 && user != 32977)
{

var author = 3354;
 
var fname = nlapiLookupField('employee', user, 'firstname');
var lname = nlapiLookupField('employee', user, 'lastname');
var recName = nlapiGetFieldValue('entityid');
var form=  nlapiGetFieldValue('custentity159');


//UserRole = nlapiLookupField('userrole', roles, 'rolename');

var rec = "mike.harris@automation-x.com";

var sub =  ("NOTICE: " + fname + " " + lname + " " + "has viewed employees record(s)."); 


var body = (  fname + " " + lname + " Has viewed the employee record for " + recName + " <br><br> Viewing Role: " + roles );

 

nlapiSendEmail(author, rec, sub, body );
return(true);


}
return(true);
}
