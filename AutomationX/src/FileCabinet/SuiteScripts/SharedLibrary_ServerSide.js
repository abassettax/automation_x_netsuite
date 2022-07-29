/// <reference path="References\Explore\SuiteScript\SuiteScriptAPI.js" />

var Logger =
{
	LogType:
	{
		Debug: "DEBUG"
		, Error: "ERROR"
		, Audit: "AUDIT"
	},
	Write: function(type, title, details)
	{
		/// <summary>Writes a message to the execution log.</summary>
		/// <param name="type" type="Logger.LogType">Log Type</param>
		/// <param name="title" type="string"></param>
		/// <param name="details" type="string"></param>

		nlapiLogExecution(type, title, details);
	},
	FormatException: function(ex)
	{
		/// <summary>Returns the formatted error message.</summary>
		/// <param name="ex" type="Error">Error</param>

		var msg = "";

		if (ex instanceof nlobjError)
			msg += "Script Name: " + ex.getUserEvent() + "\nError Code: " + ex.getCode() + "\nError Details: " + ex.getDetails() + "\n\nStack Trace: " + ex.getStackTrace();
		else
			msg += ex.toString();

		return msg;
	}
}

var Messaging =
{
	SendMessage: function(from, to, subject, body)
	{
		/// <summary>Sends an email to specified recipient.</summary>
		/// <param name="from" type="string" mayBeNull="false">The Internal ID of an employee indicating the sender of the email.</param>
		/// <param name="to" type="string" mayBeNull="false">Recipients email address.</param>
		/// <param name="subject" type="string" mayBeNull="false">Email subject</param>
		/// <param name="body" type="string" mayBeNull="false">Email body</param>

		nlapiSendEmail(from, to, subject, body, null, null, null);
	}
}

var Governance =
{
	StartTime: new Date(),
	ElapsedTime: function()
	{
		/// <summary>Gets the number of seconds elapsed since the script has started.</summary>
		/// <returns type="Number" mayBeNull="false">Number in seconds.</returns>

		var elapsedTime = ((new Date().getTime() - this.StartTime.getTime()) / 1000);
		Logger.Write(Logger.LogType.Debug, "Governance.ElapsedTime()", "Time elapsed since script start: " + elapsedTime);
		return elapsedTime;
	},
	RemainingUsage: function()
	{
		/// <summary>Gets the number of units remaining for script execution.</summary>
		/// <returns type="Number" mayBeNull="false">Number of units remaining.</returns>

		var unitRemaining = parseInt(nlapiGetContext().getRemainingUsage());
		Logger.Write(Logger.LogType.Debug, "Governance.RemainingUsage()", unitRemaining + " units remaining for this script execution.");
		return unitRemaining;
	}
}


function is_int(value) {
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
}

function round_decimals(original_number, decimals) {
    var result1 = original_number * Math.pow(10, decimals)
    var result2 = Math.round(result1)
    var result3 = result2 / Math.pow(10, decimals)
    return pad_with_zeros(result3, decimals)
}

function pad_with_zeros(rounded_value, decimal_places) {

    // Convert the number to a string
    var value_string = rounded_value.toString()

    // Locate the decimal point
    var decimal_location = value_string.indexOf(".")

    // Is there a decimal point?
    if (decimal_location == -1) {

        // If no, then all decimal places will be padded with 0s
        decimal_part_length = 0

        // If decimal_places is greater than zero, tack on a decimal point
        value_string += decimal_places > 0 ? "." : ""
    }
    else {

        // If yes, then only the extra decimal places will be padded with 0s
        decimal_part_length = value_string.length - decimal_location - 1
    }

    // Calculate the number of decimal places that need to be padded with 0s
    var pad_total = decimal_places - decimal_part_length

    if (pad_total > 0) {

        // Pad the string with 0s
        for (var counter = 1; counter <= pad_total; counter++)
            value_string += "0"
    }
    return value_string
}
