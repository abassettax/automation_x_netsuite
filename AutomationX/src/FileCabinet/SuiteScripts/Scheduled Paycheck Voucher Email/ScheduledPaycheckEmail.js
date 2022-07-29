/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/email', 'N/file', 'N/record', 'N/render', 'N/runtime', 'N/search'],
/**
 * @param {email} email
 * @param {file} file
 * @param {record} record
 * @param {render} render
 * @param {runtime} runtime
 * @param {search} search
 */
function(email, file, record, render, runtime, search) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
	
	
    function execute(scriptContext) {
   //	 var searchId = runtime.getCurrentScript().getParameter("customsearch2385");
    	
    //verify that this is working!
    	
    	function numberToWords(number) {
    		  var result = [];

    		  var fraction = number.toFixed(2).split('.');
    		  var integer_part = parseInt(fraction[0]);
    		  var fractional_part = parseInt(fraction[1]);

    		  var previousNumber = null;
    		  for (var f = 0; f < fraction[0].length; f++) {
    		    var reminder = Math.floor(integer_part % 10);
    		    integer_part /= 10;
    		    var name = getNumberName(reminder, f, fraction[0].length, previousNumber);
    		    previousNumber = reminder;
    		    if (name)
    		      result.push(name);
    		  }

    		  result.reverse();
    		  result.push('dollars');

    		  if (fractional_part != 0) {
    		    result.push('and ' + fraction[1] + ' cents');
    		  }

    		  return result.join(' ');
    		}
////create written out number
    		function getNumberName(number, power, places, previousNumber) {
    		  var result = "";
    		  if (power == 1) {
    		    result = handleTeensAndTys(number, previousNumber);
    		  } else if (power == 0 && places != 1 || number == 0) {
    		    // skip number that was handled in teens and zero
    		  } else {
    		    result = locale.numberNames[number.toString()] + locale.powerNames[power.toString()];
    		  }

    		  return result;
    		}

    		function handleTeensAndTys(number, previousNumber) {
    		  var result = "";
    		  if (number == 1) { // teens
    		  	if (previousNumber in locale.specialTeenNames) {
    		      result = locale.specialTeenNames[previousNumber];    
    		    } else if (previousNumber in locale.specialTyNames) {
    		    	result = locale.specialTyNames[previousNumber] + locale.teenSuffix;
    		    } else {
    		    	result = locale.numberNames[previousNumber] + locale.teenSuffix;    
    		    }
    		  } else if (number == 0) { // previousNumber was not handled in teens
    		    result = locale.numberNames[previousNumber.toString()];
    		  } else { // other tys
    		    if (number in locale.specialTyNames) {
    		    	result = locale.specialTyNames[number];
    		    } else {
    		    	result = locale.numberNames[number];
    		    }
    		    result += locale.powerNames[1];
    		    if (previousNumber != 0) {
    		      result += " " + locale.numberNames[previousNumber.toString()];
    		    }
    		  }
    		  return result;
    		}

    		var locale = { // English
    		  numberNames: {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine" },
    		  powerNames: {0: "", 1: "ty", 2: " hundred", 3: " thousand" },
    		  specialTeenNames: {0: "ten", 1: "eleven", 2: "twelve" },
    		  specialTyNames: {2: "twen", 3: "thir", 5: "fif" },
    		  teenSuffix: "teen"
    		};
/////////////////////////////////////////////////
//////////////////Employee List
    		var SearchtheEmp = search.create({
    			   type: "paycheck",
    			   filters: [
    			      ["checkdate","within","daysago14","daysago2"], 
    			      "AND", 
    			      ["payrollitemtype","anyof","1"], 
    			      "AND", 
    			      ["formulanumeric: ABS({amount})","greaterthan","0"]
    			   ],
    			   columns: [
    			      search.createColumn({
    			        name: "internalid",
 			      	    join: 'employee'
    			      })
    			   ]
    			});
    		

	          var resultSet25= SearchtheEmp.run();
	          
	             var Resalts = resultSet25.getRange({
	           	    start: 0,
	           	    end: 100
	           	});
    		


    		/////////////////////
    		var brutesquad='';
    		var thievesforest='1';
           	for (var j = 0; j < Resalts.length; j++) {
	          	  var brutesquad = Resalts[j].getValue({
	            	    name: 'internalid',
			      	    join: 'employee'
	            	  });

    		if (brutesquad!=thievesforest)
    		{
    			thievesforest=brutesquad;

    			
    		//brutesquad="4453"; 
    		/////////////////////////////////////////////////////////////
    		//////////////////////////Yearly Paycheck Numbers///////////////////////////
    		
   // 		  var mySearch2 = search.load({
   // 	           	 id: 'customsearch2440'
   // 	           	 });
    		var mySearch2 = search.create({
    			   type: "paycheck",
    			   filters: [
    			      [["checkdate","within","thisyeartodate"],"AND",["employee","anyof",brutesquad],"AND",["formulanumeric: {amount}","greaterthan","0"],"OR",["payrollitem","anyof","@NONE@","75","74","-49","-6","30","-53","-8","-89","-23","-102","-65","134","44","-109","-74","-81","-83","-85","-11","-19","-4","138","34"]], 
    			      "AND", 
    			      ["employee","anyof",brutesquad], 
    			      "AND", 
    			      ["checkdate","within","thisyear"]
    			   ],
    			   columns: [
    			      "payrollitem",
    			      "amount",
    			      search.createColumn({
    			         name: "checkdate",
    			         sort: search.Sort.ASC
    			      }),
    			      "hours"
    			   ]
    			});
    		  

    	          var resultSet2= mySearch2.run();
    	          var firstResult2 = resultSet2.getRange({
    	       	    start: 0,
    	       	    end: 14
    	       	    })[0];


    	       	  firstResult2.columns.forEach(function(col){ // log each column
    	       	  }); 
    	            
    	              
    	              var searchResults2 = resultSet2.getRange({
    	           	    start: 0,
    	           	    end: 999
    	           	});
    	              
    	 	    	  var salarywage3=0;
    	 	    	  var salarywage2=0;
    		    	  var execwage2=0;
    		    	  var HSACont2='';
    		    	  var salaryvaca2=0;
    		    	  var timenhalf2=0;
    		    	  var hourwage2=0;
    		    	  var hoursick2=0;
    		    	  var hourvaca2=0;
    		    	  var hrvacaamt='';
    		    	  var hoholidaytime='';
    		    	  var hoholidayamt='';
    		    	  var hoursickamt='';
    		    	  var salarysick2=0;
    		    	  var sicktimeho=0;
    		    	  var reimbursement2=0;
    		    	  var vehicleallow2=0;
    		    	  var commision2=0;
    		    	  var YearFedWithholding=0;
    		    	  var YearMedicare=0;
    		    	  var YearSocial=0;
    		    	  var YearState=0;
    		    	  var YearVision=0;
    		    	  var YearHSAEmp= '';
    		    	  var YearDental= 0;
    		    	  var YearHealth=0;
    		    	  var YearNet= 0;
    		    	  var HSAEMPC='';
    		    	  var sicktime='';
    		    	  var vacatime='';
    		    	  var holidaytime='';
    		    	  var yearAdv='';
    		    	  var yearFourOK='';
    		    	  var FourOK='';
    		    	  var 	HSAEMPCext='';
    		    	  var 	YearNetext='';
    		    	  var 	YearVisionext='';
    		    	  var 	YearHSAEmpext='';
    		    	  var 	YearStateext='';
    		    	  var 	YearSocialext='';
    		    	  var 	YearMedicareext='';
    		    	  var 	YearFedWithholdingext='';
    		    	  var 	YearDentalext='';
    		    	  var 	YearHealthext='';
    		    	  var 	yearAdvext='';
    		    	  var	yearFourOKext='';
    		    	  var	FederalWithholding='';
    		    	  var	State='';
    		    	  var	vision='';
    		    	  var	HSAS='';
    		    	  var	Dental='';
    		    	  var	Health='';
    		    	  var	Net='';
    		    	  var	Social='';
    		    	  var	Medicare='';
    		    	  var	AdvanceMe='';
    		    	  
    		    	  
    		    	  
    		    	  
    	           	for (var i = 0; i < searchResults2.length; i++) {
    	          	  var amount2 = searchResults2[i].getValue({
    	            	    name: 'amount'
    	            	  });
    	          	  var hours2 = searchResults2[i].getValue({
    	          	    name: 'hours'
    	          	  });
    	          	  
    	          	  var amount3 =Math.abs(amount2);
    		    	  var payrollitem2 = searchResults2[i].getValue({
    		      	    name: 'payrollitem'
    		      	  });
    		    	  var addressee2 = searchResults2[i].getValue({
    			      	    name: 'addressee',
    			      	    join: 'employee'
    			      	  });

  		           	 var item3=payrollitem2.indexOf("R - ");
		           	 if (item3>-1) 
		           		 {
		    	        		 var salarywage3=  Number(salarywage3) + Number(amount3);
		       			 }
    		    	  
    		    	  
 		           	 var item3=payrollitem2.indexOf("R - Salary - Wage");
		           	 if (item3>-1) 
		           		 {
		    	        		 var salarywage2=  Number(salarywage2) + Number(amount3);
		    	        		 var salwageitem=payrollitem2;
		           	 	 }
		           	 var item3=payrollitem2.indexOf("E - Salary - Wage");
		           	 if (item3>-1) 
		           		 {
		    	        		 var execwage2=  Number(execwage2) + Number(amount3);
		    	        		 var exewageitem=payrollitem2;
		       			 }
		           	 var item3=payrollitem2.indexOf("HSA Employer Contribution");
		           	 if (item3>-1) 
		           		 {
		    	        		 var HSACont2=  Number(HSACont2) + Number(amount3);
		    	        		 var hsacontitem=payrollitem2;
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Salary - Holiday");
		           	 if (item3>-1) 
		           		 {
		           		 		var salaryhol2=  Number(salaryhol2) + Number(amount3); 
		           		 		var salaryholtime=Number(salaryholtime)+Number(hours2);
		    	        		var salaryholitem=payrollitem2;
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Salary - Bere");
		           	 if (item3>-1) 
		           		 {
		           		 		var salarybev2=  Number(salarybev2) + Number(amount3); 
		           		 		var salarybevtime=Number(salarybevtime)+Number(hours2);
		    	        		var salarybevitem=payrollitem2;
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Salary - Vacation");
		           	 if (item3>-1) 
		           		 {
		           		 		var vacasalamt=  Number(vacasalamt) + Number(amount3); 
		           		 		var vacatime=Number(vacatime)+Number(hours2);
		    	        		var vacaitem=payrollitem2;
		       			 }
		           	 
		           	 
		           	 var item3=payrollitem2.indexOf("R - Hourly OT - Time & Half");
		           	 if (item3>-1) 
		           		 {
	    	        		 	var timenhalf2=  Number(timenhalf2) + Number(amount3);
		    	        		var timenhalftime=Number(timenhalftime)+Number(hours2);
			    	        	var timenhalfitem=payrollitem2;       
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Hourly - Wage");
		           	 if (item3>-1) 
		           		 {
	    	        		 	var hourwage2=  Number(hourwage2) + Number(amount3);
		    	        		var hrwagetime=Number(hrwagetime)+Number(hours2);
			    	        	var hrwageitem=payrollitem2;        	
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Hourly - Sick");
		           	 if (item3>-1) 
		           		 {
		    	        		var hoursickamt=  Number(hoursickamt)+Number(amount3);
		    	        		var sicktimeho=Number(sicktimeho)+Number(hours2);
			    	        	var hrsickitem=payrollitem2;        		 
		       			 }
	 	          	 var iteme=payrollitem2.indexOf("Holiday");
		           	 if (iteme>-1) 
		           		 {
		    	        		  var holidaytime=Number(holidaytime)+Number(hours2);
		    	        		  var holidayamt=  holidayamt + Number(amount3);
		    	        		  var holidayitem=payrollitem2; 
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Hourly - Vacation");
		           	 if (item3>-1) 
		           		 {
		    	        		 var vacatime=Number(vacatime)+Number(hours2);
		    	        		 var hrvacaamt=Number(hrvacaamt)+Number(amount3);
		    	        		 var hrvacaitem=payrollitem2; 
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Hourly - Holiday");
		           	 if (item3>-1) 
		           		 {
		    	        		 var hoholidaytime=Number(hoholidaytime)+Number(hours2);
		    	        		 var hoholidayamt=  Number(hoholidayamt) + Number(amount3);
		    	        		 var hoholidayitem=payrollitem2; 
		       			 }
		           	 var item3=payrollitem2.indexOf("R - Salary - Sick");
		           	 if (item3>-1) 
		           		 {
		    	        		 var sicktime=Number(sicktime)+Number(hours2); 
			   	        		 var sicktimeamt=  sicktimeamt + Number(amount3);
				        		 var sicktimeitem=payrollitem2; 
		       			 }
		          	 var item3=payrollitem2.indexOf("Expense Reimbursement");
		           	 if (item3>-1) 
		           		 {
		    	        		 var reimbursement2=  reimbursement2 + Number(amount3);
				        		 var reimburseitem=payrollitem2; 
		       			 }
		           	 var item3=payrollitem2.indexOf("Vehicle Allowance");
		           	 if (item3>-1) 
		           		 {
		    	        		 var vehicleallow2=  vehicleallow2 + Number(amount3);
				        		 var vehicleitem=payrollitem2; 
		       			 }
		           	 var item3=payrollitem2.indexOf("Salary - Commission");
		           	 if (item3>-1) 
		           		 {
		    	        		 var commision2=  commision2 + Number(amount3);
				        		 var comitem=payrollitem2; 
		       			 }
    		    	  
		           	 
		           	 
		           	 var item3=payrollitem2.indexOf("Federal Withholding");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearFedWithholding=  Number(YearFedWithholding) + Number(amount3);
		    	        		 var YearFedWithholdingext="<div style=\"float:right\">"+YearFedWithholding.toFixed(2)+"</div>";
		    	        		 var FederalWithholding="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totFederalWithholding=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("Medicare Employee");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearMedicare=  Number(YearMedicare) + Number(amount3);
		    	        		 var YearMedicareext="<div style=\"float:right\">"+YearMedicare.toFixed(2)+"</div>";
		    	        		 var Medicare="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totMedicare=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("Social Security Employee");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearSocial=  Number(YearSocial) + Number(amount3);
		    	        		 var YearSocialext="<div style=\"float:right\">"+YearSocial.toFixed(2)+"</div>";
		    	        		 var Social="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totSocial=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("Withholding");
		           	var item3NOT=payrollitem2.indexOf("Federal");
		           	 if (item3>-1&&item3NOT==-1) 
		           		 {
		    	        		 var YearState=  Number(YearState) + Number(amount3);
		    	        		 var YearStateext="<div style=\"float:right\">"+YearState.toFixed(2)+"</div>";
		    	        		 var State="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totState=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("125 -Vision Insurance");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearVision=  Number(YearVision) + Number(amount3);
		    	        		 var YearVisionext="<div style=\"float:right\">"+YearVision.toFixed(2)+"</div>";
		    	        		 var vision="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totvision=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("HSA - Employee");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearHSAEmp=  Number(YearHSAEmp)  + Number(amount3);
		    	        		 var YearHSAEmpext="<div style=\"float:right\">"+YearHSAEmp.toFixed(2)+"</div>";
		    	        		 var HSAS="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totHSA=Number(amount);

		           		 }
		           	 var item3=payrollitem2.indexOf("125 -Dental Insurance");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearDental=  Number(YearDental) + Number(amount3);
		    	        		 var YearDentalext="<div style=\"float:right\">"+YearDental.toFixed(2)+"</div>";
		    	        		 var Dental="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totDental=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("125 -Health Insurance");
		           	 if (item3>-1) 
		           		 {
		    	        		 var YearHealth=  Number(YearHealth) + Number(amount3);
		    	        		 var YearHealthext="<div style=\"float:right\">"+YearHealth.toFixed(2)+"</div>";
		    	        		 var Health="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totHealth=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("Net Pay");
		           	 if (item3>-1) 
		           		 {

		    	        		 var YearNet=  Number(YearNet) + Number(amount3);
		    	        		 var YearNetext="<div style=\"float:right\">"+YearNet.toFixed(2)+"</div>";
		    	        		 var Net="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var accountamount=Number(amount);
		           		 }
		           	 var item3=payrollitem2.indexOf("HSA Employer Contribution");
		           	 if (item3>-1) 
		           		 {
		    	        		 var HSAEMPC=  Number(HSAEMPC) + Number(amount3);
		    	        		 var HSAEMPCext="<div style=\"float:right\">"+HSAEMPC.toFixed(2)+"</div>";
		       			 }
		           	 var item3=payrollitem2.indexOf("Employee Advance Repayment");
		           	 if (item3>-1) 
		           		 {

		    	        		 var yearAdv=  Number(yearAdv) + Number(amount3);
		    	        		 var yearAdvext="<div style=\"float:right\">"+yearAdv.toFixed(2)+"</div>";
		    	        		 var AdvanceMe="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totAdvance=Number(amount);
		           		 }
			         var item3Not=payrollitem2.indexOf("Employer Contribution");
		           	 var item3=payrollitem2.indexOf("401K");
		           	 if (item3>-1&&item3Not==-1) 
		           		 {

		    	        		 var yearFourOK=  Number(yearFourOK) + Number(amount3);
		    	        		 var yearFourOKext="<div style=\"float:right\">"+yearFourOK.toFixed(2)+"</div>";
		    	        		 var FourOK="<span style=\"float:left; width:60%;\">"+payrollitem2+":</span>";
		    	        		 var totFourOK=Number(amount);
		    	        }	 
		           	 
    		
    	           	}
    	/////////////////////////////////////////////////////////////////////
    	///////////////////////////Monthly Paycheck numbers//////////////////	
    		
    	           	
    	           	var mySearch1 = search.create({
    	           	   type: "paycheck",
    	           	   filters: [
    	           	      ["checkdate","within","daysago10","daysago0"], 
    	           	      "AND", 
    	           	      ["payrollitemtype","anyof","1","@NONE@","16","8"], 
    	           	      "AND", 
    	           	      ["payrollitem","noneof","-5","108","109","110","-7","134","85","140"], 
    	           	      "AND", 
    	           	      ["formulanumeric: ABS({amount})","greaterthan","0"], 
    	           	      "AND", 
    	           	      ["employee","anyof",brutesquad]
    	           	   ],
    	           	   columns: [
    	           	      "checkdate",
    	           	      "employee",
    	           	      "payrollitem",
    	           	      "payrollitemtype",
    	           	      "hours",
    	           	      "amount",
    	           	      search.createColumn({
    	           	         name: "billaddress",
    	           	         join: "employee"
    	           	      }),
    	           	      search.createColumn({
    	           	         name: "class",
    	           	         join: "employee"
    	           	      }),
    	           	      search.createColumn({
    	           	         name: "custentity167",
    	           	         join: "employee"
    	           	      }),
    	           	      search.createColumn({
    	           	         name: "periodending",
    	           	         join: "payrollBatch"
    	           	      }),
    	           	      search.createColumn({
    	           	         name: "addressee",
    	           	         join: "employee"
    	           	      })
    	           	   ]
    	           	});
    	           	
    	  var resultSet1= mySearch1.run();
          var firstResult1 = resultSet1.getRange({
       	    start: 0,
       	    end: 14
       	    })[0];
       	// log.debug({
       	//   details: firstResult.columns.length
       	//    });

  //     	  firstResult1.columns.forEach(function(col){ // log each column
      // 	    log.debug({
      // 	    details: col
      // 	    });
 //      	  }); 
            //  log.debug('record type: ' + mySearch.searchType);
              
              var searchResults1 = resultSet1.getRange({
           	    start: 0,
           	    end: 199
           	});
              var	empty="<span style=\"float:left; width:23%;\"> "+" "+"</span><br>";
              var 	classy='';
 	    	  var 	salarywage='';
 	    	  var 	salaryhol='';
 	    	  var 	salarybev='';
	    	  var 	execwage='';
	    	  var 	HSACont='';
	    	  var 	salaryvaca='';
	    	  var 	timenhalf='';
	    	  var 	hourwage='';
	    	  var 	hoursick='';
	    	  var 	hourvaca='';
	    	  var 	hourho='';
	    	  var 	salarysick='';
	    	  var 	reimbursement='';
	    	  var 	vehicleallow='';
	    	  var 	commision='';
	    	  var 	rate='';
	    	  var 	payitem='';
	    	  var 	vacatimeaccrued='';
	    	  var 	sicktimeaccrued='';
	    	  var 	timehours='';
	    	  var 	vacarate1='';
	    	  var 	accruedtimeoff1='';
	    	  var 	vacarateh='';
	    	  var 	accruedtimeoffh='';
	    	  var 	vacarates='';
	    	  var 	accruedtimeoffs='';
	    	  var 	totexecwage='';
	    	  var	tottimenhalf='';
	    	  var	tothourwage='';
	    	  var 	HSACont='';
	    	  var 	tothoursick='';
	    	  var	totsalarysick='';
	    	  var	totreimbursement='';
	    	  var	totvehicleallow='';
	    	  var	totcommision='';
	    	  var	totHSACont='';
	    	  var	totsalaryvaca='';
	    	  var	totsalwage='';
	    	  var	totMedicare='';
	    	  var	totSocial='';
	    	  var	totHealth='';
	    	  var	totFederalWithholding='';
	    	  var	totState='';
	    	  var	totvision='';
	    	  var	totHSA='';
	    	  var	totDental='';
//	    	  var	salarywage2='';
	    	  var	Advance='';
	    	  var	totAdvance='';
	    	  var	totFourOK='';
//	    	  var	FourOK='';
	    	  var	FourOKMon='';
	    	  var	AdvanceMon='';
	    	  var 	FederalWithholdingMon=empty;
	    	  var 	StateMon='';
	    	  var 	visionMon=empty;
	    	  var	 HSAMon='';
	    	  var	DentalMon=empty;
	    	  var	HealthMon='';
	    	  var	NetMon=empty;
	    	  var	SocialMon=empty;
	    	  var	MedicareMon=empty;
	    	  var	totsalvacahr='';
	    	  var	tothrlysickhr='';
	    	  var	totalhrlyvaca='';
	    	  var	totsalsickhr='';
	    	  
	    	  
	    	  
	    	  
	    	  
              
           	for (var i = 0; i < searchResults1.length; i++) {
           		
	          var trandate= searchResults1[i].getValue({
	        	    name: 'checkdate'
	      	  });	
           		
          	  var amount1 = searchResults1[i].getValue({
            	    name: 'amount'
            	  });
          	  var hours = searchResults1[i].getValue({
          	    name: 'hours'
          	  });
          	  var address2 = searchResults1[i].getValue({
            	    name: 'billaddress',
		      	    join: 'employee'
            	  });
          	  
          	  var amount =Math.abs(amount1);
	    	  var payrollitem = searchResults1[i].getValue({
	      	    name: 'payrollitem'
	      	  });
	    	  var addressee = searchResults1[i].getValue({
		      	    name: 'addressee',
		      	    join: 'employee'
		      	  });
	    	  var classy = searchResults1[i].getText({
		      	    name: 'class',
		      	    join: 'employee'
		      	  });
	    	  if (hours&&amount)
	    		  {rate=amount/hours;
	    		  rate=rate.toFixed(2);
	    		  }
//////////////////////////////////////////////////////////////
	    	  //////////////////////////////////////////////
	    	  /////////////////////////////////////////////

	    		  
	          	 var item=payrollitem.indexOf("R - Salary - Wage");
	           	 if (item>-1) 
	           		 {
	    	        		  var salarywage="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+Number(salarywage2).toFixed(2)+"</span><br>";
	    	        		  var totsalwage=Number(amount);
	           		 }
	          	 var item=payrollitem.indexOf("R - Salary - Holiday");
	           	 if (item>-1) 
	           		 {
	    	        		  var salaryhol="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+Number(salaryhol2).toFixed(2)+"</span><br>";
	    	        		  var totsalhol=Number(amount);
	           		 }
	          	 var item=payrollitem.indexOf("R - Salary - Bereavement");
	           	 if (item>-1) 
	           		 {
	    	        		  var salarybev="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+Number(salarybev2).toFixed(2)+"</span><br>";
	    	        		  var totsalbev=Number(amount);
	           		 }
	           	 
	           	 

	          	 var item1=payrollitem.indexOf("E - Salary - Wage");
	           	 if (item1>-1) 
	           		 {
	    	        		 var execwage="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+execwage2.toFixed(2)+"</span><br>";
	    	        		 var totexecwage=Number(amount);
	           		 }
	          	 var item2=payrollitem.indexOf("HSA Employer Contribution");
	           	 if (item2>-1) 
	           		 {
	    	        		 var HSACont="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+Number(HSACont2).toFixed(2)+"</span><br>";
	    	        		 var totHSACont=Number(amount);
	           		 }
	          	 var item3=payrollitem.indexOf("R - Salary - Vacation");
	           	 if (item3>-1) 
	           		 {
	    	        		 var salaryvaca="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+salaryvaca2.toFixed(2)+"</span><br>";
	    	        		 var totsalaryvaca=Number(amount);
	    	        		 var totsalvacahr=hours;
	           		 }
	          	 var item4=payrollitem.indexOf("R - Hourly OT - Time & Half");
	           	 if (item4>-1) 
	           		 {
	    	        		 var timenhalf="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+timenhalf2.toFixed(2)+"</span><br>";
	    	        		 var tottimenhalf=Number(amount);
	           		 }
	          	 var item5=payrollitem.indexOf("R - Hourly - Wage");
	           	 if (item5>-1) 
	           		 {
	    	        		 var hourwage="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+hourwage2.toFixed(2)+"</span><br>";
	    	        		 var tothourwage=Number(amount);
	           		 }
	          	 var item6=payrollitem.indexOf("R - Hourly - Sick");
	           	 if (item6>-1) 
	           		 {
	    	        		 var hoursick="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+hoursickamt.toFixed(2)+"</span><br>";
	    	        		 var tothoursick=Number(amount);
	    	        		 var tothrlysickhr=hours;
	    	        		 
	           		 }
	          	 var item7=payrollitem.indexOf("R - Hourly - Vacation");
	           	 if (item7>-1) 
	           		 {
	    	        		 var hourvaca="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+hrvacaamt.toFixed(2)+"</span><br>";
	    	        		 var tothourvaca=Number(amount);
	    	        		 var totalhrlyvaca=hours;
	           		 }
	          	 var item7=payrollitem.indexOf("R - Hourly - Holiday");
	           	 if (item7>-1) 
	           		 {
	    	        		 var hourho="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+Number(hoholidayamt).toFixed(2)+"</span><br>";
	    	        		 var tothourho=Number(amount);
	    	        		 var totalhrlyho=hours;
	           		 }
	          	 var item8=payrollitem.indexOf("R - Salary - Sick");
	           	 if (item8>-1) 
	           		 {
	    	        		 var salarysick="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+salarysick2.toFixed(2)+"</span><br>";
	    	        		 var totsalarysick=Number(amount);
	    	        		 var totsalsickhr=hours;
	           		 }
	          	 var item9=payrollitem.indexOf("Expense Reimbursement");
	           	 if (item9>-1) 
	           		 {
	    	        		 var reimbursement="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+reimbursement2.toFixed(2)+"</span><br>";
	    	        		 var totreimbursement=Number(amount);
	           		 }
	          	 var item=payrollitem.indexOf("Vehicle Allowance");
	           	 if (item>-1) 
	           		 {
	    	        		 var vehicleallow="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+vehicleallow2.toFixed(2)+"</span><br>";
	    	        		 var totvehicleallow=Number(amount);
	           		 }
	          	 var item=payrollitem.indexOf("Salary - Commission");
	           	 if (item>-1) 
	           		 {
	    	        		 var commision="<span style=\"width:30%;float:left;\">"+payrollitem+":</span><span style=\"width:20%;float:left;\">"+hours+"</span><span style=\"width:16%;float:left;\">"+rate+"</span><span style=\"width:22%;float:left;\">"+Number(amount)+"</span><span style=\"float:right;\">"+commision2.toFixed(2)+"</span><br>";
	    	        		 var totcommision=Number(amount);
	           		 }
	           	 
	           	 var itemNot=payrollitem.indexOf("Employee Advance Repayment");
	          	if (item>-1) 
	           		 {
	    	        		 var AdvanceMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	    	        		 var totAdvance=Number(amount);
	    	      			log.debug('AdvanceMon ' + AdvanceMon); 
	           		 }	 
	           	 

	           	var itemNot=payrollitem.indexOf("Employer Contribution");
	          	 var item=payrollitem.indexOf("401K");
	           	 if (item>-1&&itemNot==-1) 
	           		 {
	    	        		 var FourOKMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	    	        		 var totFourOK=Number(amount);
	           		 }

      	 
	           	 
	           	 
	           		  
/////////////////Below are period taxes and deductions///////
           	 var item=payrollitem.indexOf("Federal Withholding");
       	 if (item>-1) 
       		 {
	        		 var FederalWithholdingMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totFederalWithholding=Number(amount);
       		 }
       	 
 
       	 
       	 	var item=payrollitem.indexOf("Withholding");
       	 	var itemnot=payrollitem.indexOf("Federal");
       	 if (item>-1&&itemnot==-1) 
       		 {
	        		 var StateMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totState=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("125 -Vision Insurance (pre-tax)");
       	 if (item>-1) 
       		 {
	        		 var visionMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totvision=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("HSA - Employee");
       	 if (item>-1) 
       		 {
	        		 var HSAMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totHSA=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("125 -Dental Insurance (pre-tax)");
       	 if (item>-1) 
       		 {
	        		 var DentalMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totDental=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("125 -Health Insurance (pre-tax)");
       	 if (item>-1) 
       		 {
	        		 var HealthMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totHealth=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("Net Pay");
       	 if (item>-1) 
       		 {
	        		 var NetMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var accountamount=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("Social Security Employee");
       	 if (item>-1) 
       		 {
	        		 var SocialMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totSocial=Number(amount);
       		 }
       	 var item=payrollitem.indexOf("Medicare Employee");
       	 if (item>-1) 
       		 {
	        		 var MedicareMon="<span style=\"float:left; width:23%;\"> "+Number(amount)+"</span><br>";
	        		 var totMedicare=Number(amount);
       		 }
       	 
       	 
           	}
           	
           	
////////////////////////////////////////////////////////////////////////////
   	     //////////////Monthly Paycheck numbers end//////////////////////
   	        ///////////////////////////////////////////////////////

           	
        ///Early Earnings compensation with no weekly earnings//
         if (salarywage==""&&salarywage2>0)
        	 {
        	 salarywage="<span style=\"float:left;\">"+salwageitem+"</span><span style=\"float:right;\">"+Number(salarywage2).toFixed(2)+"</span><br>";
        	 }
         if (salaryhol==""&&salaryhol2>0)
    	 {
        	 salaryhol="<span style=\"float:left;\">"+salaryholitem+"</span><span style=\"float:right;\">"+Number(salaryhol2).toFixed(2)+"</span><br>";
    	 }
         if (salarybev==""&&salarybev2>0)
    	 {
        	 salarybev="<span style=\"float:left;\">"+salarybevitem+"</span><span style=\"float:right;\">"+Number(salarybev2).toFixed(2)+"</span><br>";
    	 }
         if (execwage==""&&execwage2>0)
    	 {
        	 execwage="<span style=\"float:left;\">"+exewageitem+"</span><span style=\"float:right;\">"+execwage2.toFixed(2)+"</span><br>";
    	 }
         if (HSACont==""&&HSACont2>0)
    	 {
        	 HSACont="<span style=\"float:left;\">"+hsacontitem+"</span><span style=\"float:right;\">"+Number(HSACont2.toFixed(2))+"</span><br>";
    	 }
         if (salaryvaca==""&&salaryvaca2>0)
    	 {
        	 salaryvaca="<span style=\"float:left;\">"+vacaitem+"</span><span style=\"float:right;\">"+salaryvaca2.toFixed(2)+"</span><br>";
    	 }
         if (timenhalf==""&&timenhalf2>0)
    	 {
        	 timenhalf="<span style=\"float:left;\">"+timenhalfitem+"</span><span style=\"float:right;\">"+timenhalf2.toFixed(2)+"</span><br>";
    	 }
         if (hourwage==""&&hourwage2>0)
    	 {
        	 hourwage="<span style=\"float:left;\">"+hrwageitem+"</span><span style=\"float:right;\">"+hourwage2.toFixed(2)+"</span><br>";
    	 }
         if (hoursick==""&&hoursickamt>0)
    	 {
        	 hoursick="<span style=\"float:left;\">"+hrsickitem+"</span><span style=\"float:right;\">"+hoursickamt.toFixed(2)+"</span><br>";
    	 }
         if (hourvaca==""&&hrvacaamt>0)
    	 {
        	 hourvaca="<span style=\"float:left;\">"+hrvacaitem+"</span><span style=\"float:right;\">"+hrvacaamt.toFixed(2)+"</span><br>";
    	 }
         if (hourho==""&&hoholidayamt>0)
    	 {
        	 hourho="<span style=\"float:left;\">"+hoholidayitem+"</span><span style=\"float:right;\">"+hoholidayamt.toFixed(2)+"</span><br>";
    	 }
         if (salarysick==""&&salarysick2>0)
    	 {
        	 salarysick="<span style=\"float:left;\">"+sicktimeitem+"</span><span style=\"float:right;\">"+salarysick2.toFixed(2)+"</span><br>";
    	 }
         if (reimbursement==""&&reimbursement2>0)
    	 {
        	 reimbursement="<span style=\"float:left;\">"+reimburseitem+"</span><span style=\"float:right;\">"+reimbursement2.toFixed(2)+"</span><br>";
    	 }
         if (vehicleallow==""&&vehicleallow2>0)
    	 {
        	 vehicleallow="<span style=\"float:left;\">"+vehicleitem+"</span><span style=\"float:right;\">"+vehicleallow2.toFixed(2)+"</span><br>";
    	 }
         if (commision==""&&commision2>0)
    	 {
        	 commision="<span style=\"float:left;\">"+comitem+"</span><span style=\"float:right;\">"+commision2.toFixed(2)+"</span><br>";
    	 }

         if(YearMedicareext){YearMedicareext="<span style=\"float:left;width:100%;\">"+YearMedicareext+Medicare+MedicareMon+"</span>"}
         if(YearSocialext){YearSocialext="<span style=\"float:left;width:100%;\">"+YearSocialext+Social+SocialMon+"</span>"}
         if(YearFedWithholdingext){YearFedWithholdingext="<span style=\"float:left;width:100%;\">"+YearFedWithholdingext+FederalWithholding+FederalWithholdingMon+"</span>"}
         if(YearStateext){YearStateext="<span style=\"float:left;width:100%;\">"+YearStateext+State+StateMon+"</span>"}
         if(YearVisionext){YearVisionext="<span style=\"float:left;width:100%;\">"+YearVisionext+vision+visionMon+"</span>"}
         if(YearHSAEmpext){YearHSAEmpext="<span style=\"float:left;width:100%;\">"+YearHSAEmpext+HSAS+HSAMon+"</span>"}
         if(YearDentalext){YearDentalext="<span style=\"float:left;width:100%;\">"+YearDentalext+Dental+DentalMon+"</span>"}
         if(YearHealthext){YearHealthext="<span style=\"float:left;width:100%;\">"+YearHealthext+Health+HealthMon+"</span>"}
         if(yearAdvext){yearAdvext="<span style=\"float:left;width:100%;\">"+yearAdvext+AdvanceMe+AdvanceMon+"</span>"}
         if(yearFourOKext){yearFourOKext="<span style=\"float:left;width:100%;\">"+yearFourOKext+FourOK+FourOKMon+"</span>"}
         if(YearNetext){YearNetext="<span style=\"float:left;width:100%;\">"+(YearNet.toFixed(2)-Number(reimbursement2))+Net+NetMon+"</span>"}
           	
    	/////////////////////////////////////////////////////////////
        ////////////////////////////Load employee record starts////////   	
           	
          	  
            	  
            	  var company="Automation-X Corporation, 620 S. Carlton , Farmington, NM 87401, Phone: (505) 327-1224";


     //       		   18040

           		 var emp=record.load({
            			 type: record.Type.EMPLOYEE,
            			 id: brutesquad,
            			 isDynamic: true,
            			 });
           		 
           		
           		var lineCount = emp.getLineCount({
           		    sublistId: 'accruedtime'
           		});//parseInt( emp.getLineItemCount('accruedtime'));
           		lineCount=lineCount-1;

           		for(var x =0; x<=lineCount; x++)
           			{
           			var payitem = emp.getSublistText('accruedtime', 'payrollitem',x);
           			var accruerate = emp.getSublistValue('accruedtime', 'accrualrate',x);
           			var accruedtimeoff = emp.getSublistValue('accruedtime', 'accruedhours',x);
           			//var maxtime = emp.getSublistValue('accruedtime', 'maximumaccruedhours',x);

	          	 var iteme=payitem.indexOf("Vacation");
	           	 if (iteme>-1) 
	           		 {
	           		 			var vacarate1=accruerate;
	    	        		  	var accruedtimeoff1=accruedtimeoff;
	       			 }
 	          	 var iteme=payitem.indexOf("Holiday");
	           	 if (iteme>-1) 
	           		 {
	           		 			var vacarateh=accruerate;
	           		 			var accruedtimeoffh=accruedtimeoff;
	       			 }
	           	 
 	          	 var iteme=payitem.indexOf("Sick");
	           	 if (iteme>-1) 
	           		 {
    		 			var vacarates=accruerate;
       		 			var accruedtimeoffs=accruedtimeoff;
	       			 }
           		
           			} 

           		var totperiodearn=Number(totsalwage)+Number(totexecwage)+Number(tottimenhalf)+Number(tothourwage)+Number(tothoursick)+Number(totsalarysick)+Number(totreimbursement)+Number(totvehicleallow)+Number(totcommision)+Number(totHSACont)+Number(totsalaryvaca);
           		var totperioddud=Number(totMedicare)+Number(totSocial)+Number(totHealth)+Number(totFederalWithholding)+Number(totState)+Number(totvision)+Number(totHSA)+Number(totDental)+Number(totFourOK)
           		//var yeartotalearn=YearMedicare+YearSocial+YearFedWithholding+YearState+YearVision+YearHSAEmp+YearDental+YearHealth+YearNet+HSAEMPC;
           		var yeartotalearn=Number(salarywage3)+Number(execwage2)+Number(HSACont2)+Number(vehicleallow2)+Number(commision2);
           		var yeartotaldud=Number(YearMedicare)+Number(YearSocial)+Number(YearFedWithholding)+Number(YearState)+Number(YearVision)+Number(YearHSAEmp)+Number(YearDental)+Number(YearHealth)+Number(HSAEMPC)+Number(yearAdv)+Number(yearFourOK);

     			
	        	var word= numberToWords(Math.abs(accountamount));
             	 var printstuff="<div width:1200px;><div>"+"<div style=\"width:100%;height:150px;\"><span style=\"float:right;text-align:right;height:150px; width:1200px;\">"+trandate+"</span></div><div>"
             	 +"<span style=\"float:left;width:50%;\">"+addressee+"</span>"
             	 +"<span style=\"width:50%;float:left;\">**$"+Math.abs(accountamount)+"</span><br>"
             	 +"<span style=\"width:50%;float:left;\"><br>"+word+"******************</span><br><div style=\"width:51%;float:left;\"><br>"
             	 +"<span style=\"width:20%;float:left;\">"+address2+"</span></div><br>"
             	 +"<span style=\"width:100%;height:100px;float:left;\">"+"</span><br></div>"
             	 +"<div><div style=\"float:left;border-style:solid;border-width:2px; width:95%;\">"+company+"<br>"+"<div style=\"border-top:solid 2px;\"><div style=\"float:left;border-right:solid;padding-left: 1%;width:24%;\">"+addressee+"</div><div style=\"float:left;border-right:solid;padding-left: 1%;width:24%;\">"+classy+"</div><div style=\"float:left;border-right:solid;padding-left: 1%;width:24%;\">"+"xx-xx-xxxx"+"</div><div style=\"float:left;padding-left: 1%;width:23%;\">"+trandate+"</div>"+"</div></div></div>"
             	 +"<div style=\"float:left;width:49%;\"><strong>Earnings</strong><br><div style=\"border-style:solid;border-width:2px;float:left;width:100%;\">"
             	 +"<div style=\"\"><div style=\"float:left;width:30%;\">Description</div>"
             	 +"<div style=\"float:left;width:18%;border-left:solid;padding-left:2px;\">Hours</div><div style=\"float:left;width:16%;border-left:solid;padding-left:2px;\"> Rate</div>"
             	 +"<div style=\"float:left;width:22%;border-left:solid;padding-left:2px;\"> Amount</div><div style=\"float:left;border-left:solid;padding-left:2px;\"> YTD</div></div>"
             	 +"<div style=\"border-top:solid;float:left;width:100%;\">"
             	+salarywage
             	+salaryhol
             	+salarybev
             	+execwage
             	+HSACont
             	+salaryvaca
             	+timenhalf
             	+hourwage
             	+hoursick
             	+hourvaca
             	+hourho
             	+salarysick
             	+reimbursement
             	+vehicleallow
             	+commision
             	+"</div></div>"
             	//accrued time
             	+"<div style=\"float:left;width:100%;\"><strong>Accrued Time</strong><br><div style=\"border-style:solid;border-width:2px;float:left;width:100%;\">"
            	+"<div style=\"\"><div style=\"float:left;width:30%;\">Description</div>"
            	+"<div style=\"float:left;padding-left:2px;border-left:solid;border-right:solid;border-width:2px;width:30%;\"><div style=\"float:left;width:100%;padding-left:2px;\">This Period</div><div style=\"float:left;width:50%;padding-left:2px;\"> Used</div>"
            	+"<div style=\"float:left;width:22%;padding-left:2px;\">Accrued</div></div><div style=\"float:left;padding-left:2px;width:30%;\"><div style=\"float:left;padding-left:2px;width:100%;\"> Year to Date</div><div style=\"float:left;width:50%;padding-left:2px;\"> Used</div><div style=\"float:left;width:22%;padding-left:2px;\">Accrued</div></div></div></div></div>"
            	
            	+"<div style=\"border-left:solid 2px;border-right:solid 2px;border-bottom:solid 2px;float:left; width:100%;\"><div style=\"width:100%;display:inline-block;\"><div style=\"float:left;width:30%;\">Sick</div><div style=\"float:left;width:31%;\">"+"<div style=\"float:left;width:53%;\">"+Number(tothrlysickhr)+Number(totsalsickhr)+"</div><div style=\"float:left;width:22%;\">"+vacarates+"</div></div><div style=\"float:left;width:30%;\"><div style=\"float:left;width:50%;\">"+Number(sicktimeho)+Number(sicktime)+"</div><div style=\"float:right;width:22%;\">"+accruedtimeoffs+"</div></div></div>"
            	+"<div style=\"float:left; width:100%;\"><div style=\"width:100%;display:inline-block;\"><div style=\"float:left;width:30%;\">Vacation</div><div style=\"float:left;width:31%;\">"+"<div style=\"float:left;width:53%;\">"+Number(totsalvacahr)+Number(totalhrlyvaca)+"</div><div style=\"float:left;width:22%;\">"+vacarate1+"</div></div><div style=\"float:left;width:30%;\"><div style=\"float:left;width:50%;\">"+vacatime+"</div><div style=\"float:right;width:22%;\">"+accruedtimeoff1+"</div></div></div></div></div>"

            	
            	//This period totals
            	+"<div style=\"float:left;width:100%;\"><strong>This Period</strong><br></div>"
            	+"<div style=\"border:solid 2px;float:left;width:100%;\"><div style=\"border-right:solid 2px;float:left;width:33.33%;\"><div style=\"border-bottom:solid 2px;\">Earnings</div>$"+totperiodearn.toFixed(2)+"</div><div style=\"border-right:solid 2px;float:left;width:33.33%;\"><div style=\"border-bottom:solid 2px;\">Deductions</div>$"+totperioddud.toFixed(2)+"</div>"
            	+"<div style=\"\"><div style=\"border-bottom:solid 2px;\">Net Pay</div>$"+Math.abs(accountamount)+"</div>"
            	
            	
            	+"</div>"//end period total table//
            	+"</div>"///end earnings column//
             	
             	
             	 +"<div style=\"float:right;width:49%;\"><strong>Taxes and Deductions</strong><br><div style=\"border-style:solid;border-width:2px;float:left;width:90%;\">"
             	 +"<div style=\"\"><div style=\"float:left;width:60%;\">Description</div>"
             	 +"<div style=\"float:left;width:25%;border-left:solid;padding-left:2px;\"> Amount</div><div style=\"float:left;border-left:solid;padding-left:2px;\"> YTD</div></div>"
             	 +"<div style=\"border-top:solid;float:left;width:100%;\">"
             	
             	+YearMedicareext
             	+YearSocialext
             	+YearFedWithholdingext
             	+YearStateext
             	+YearVisionext
             	+YearHSAEmpext
             	+YearDentalext
             	+YearHealthext
             	+yearAdvext
             	+yearFourOKext
             	+YearNetext
             	//+"</span></div>" 
             	 +"</div></div>"
             	 
             	 //start year total table
             	 
             	+"<div style=\"float:left;width:90%;\"><strong>Year to Date</strong><br></div>"
            	+"<div style=\"border:solid 2px;float:left;width:90%;\"><div style=\"border-right:solid 2px;float:left;width:33.33%;\"><div style=\"border-bottom:solid 2px;\">Earnings</div>$"+yeartotalearn.toFixed(2)+"</div><div style=\"border-right:solid 2px;float:left;width:33.33%;\"><div style=\"border-bottom:solid 2px;\">Deductions</div>$"+yeartotaldud.toFixed(2)+"</div>"
            	+"<div style=\"\"><div style=\"border-bottom:solid 2px;\">Net Pay</div>$"+(YearNet.toFixed(2)-Number(reimbursement2))+"</div>"
            	
            	
            	+"</div>"//end year total table//
             	 
             	 
             	 
             	 +"</div>";
             	//log.debug('printstuff ' + printstuff);
  //removed          	}

        	/* 	var trandate = result.getValue('date');
         	log.debug('trandate: ' + result.trandate);
         	var employee = result.getValue('employee');
         	log.debug('employee: ' + result.employee);
         	var hours = result.getValue('hours');
         	log.debug('hours: ' + result.hours);
         	var amount = result.getValue('amount');
         	log.debug('amount: ' + result.amount);
         	var address = result.getValue('address');
         	log.debug('address: ' + result.address);
         	var class1 = result.getValue('class');
         	log.debug('class: ' + result.class1);
         	var companyname = result.getValue('companyname');
         	log.debug('companyname: ' + result.companyname); */
            
            
    	
//	var newId =  scriptContext.newRecord;
//	var didiship=newId.getValue('shipstatus');
//	if (didiship!== "C")
//	          return;
//	var recordid=newId.getValue('id');
//	var entityid=newId.getValue('entity');
//	var entityidnum=parseInt(entityid);
//	var recordidnum=parseInt('1233964');
	var myMergeResult = render.mergeEmail({
	templateId: 116,
	entity: {
	type: 'employee',
	id: 18040
	},
	recipient: {
	type: 'employee',
	id: 18040
	},
	supportCaseId: null,
	transactionId: 1233964,
	customRecord: null
	});
	
//	log.debug('trandate: ' + trandate); 
       var everyother=j%2;
   	log.debug('everyother ' + everyother);
		if(everyother==1)
		{
			var whotosendto="jason.feucht@automation-x.com";
		}	
		else
			{var whotosendto="jasonmfeucht@gmail.com";}
	

	var comesfrom="Paycheck";
	log.debug('brutesquademailed ' + brutesquad);
	    email.send({
	               author: 18040,
	                //recipients: tobeemailedto,
	                recipients: whotosendto,//18040,
	               //subject: myMergeResult.subject,
	               subject: comesfrom,
	               //body: myMergeResult.body,
	               body: printstuff,
//	                attachments: [transactionFile],
//	                relatedRecords: {
//	                    entityid: recipientEmail
//	                }
	            })
	    ////////////////////
	    var delay = 50000; // milliseconds
	    var before = Date.now();

	    while (Date.now() < before + delay) {};

	    ///////////////////
    		}

    		
    }    	
}
    return {
        execute: execute
    };
    
});
