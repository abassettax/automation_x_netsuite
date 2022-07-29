/**
 * @NApiVersion 2.x
 * @NScriptType Portlet
 * @NModuleScope SameAccount
 */
define([],

function() {
   
    /**
     * Definition of the Portlet script trigger point.
     * 
     * @param {Object} params
     * @param {Portlet} params.portlet - The portlet object used for rendering
     * @param {number} params.column - Specifies whether portlet is placed in left (1), center (2) or right (3) column of the dashboard
     * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
     * @Since 2015.2
     */
    function render(params) {

    	var content = '<iframe width="933" height="700" src="https://app.powerbi.com/view?r=eyJrIjoiODA4M2U1ZTEtMDdlNy00MjM1LTlkZGQtNDVjNmVhY2FlM2Q2IiwidCI6IjczNWU2ODg2LTI0YjItNDJmYy05NjcxLWVmOTBiMmM4MTczYiIsImMiOjZ9" frameborder="0" allowFullScreen="true"></iframe>';
    	
		params.portlet.html=content;
    }

    return {
        render: render
    };
    
});
