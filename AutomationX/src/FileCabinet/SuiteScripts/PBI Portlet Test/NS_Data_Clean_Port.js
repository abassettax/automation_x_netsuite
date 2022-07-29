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
    	
    	var content = '<iframe width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=0d3ac624-d450-4f84-8c0d-2a15b5375443&groupId=c7b037aa-d826-4150-83ae-5150aa83144b&autoAuth=true&ctid=735e6886-24b2-42fc-9671-ef90b2c8173b&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtdXMtYi1wcmltYXJ5LXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9" frameborder="0" allowFullScreen="true"></iframe>'
    	
    			params.portlet.html=content;

    }

    return {
        render: render
    };
});
