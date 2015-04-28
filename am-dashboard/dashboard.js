/* call using the following enclosure:
(function(){
  var url = 'https://rawgit.com/jamesona/SEO-Tools/am-dashboard/dashboard.js';
  document.head.appendChild(document.createElement('script')).src=url;
})();
*/

function Dashboard() {
  
	this.createElement = function(parent, tag, attributes){
		var element = parent.appendChild(document.createElement(tag));
		for (var attribute in attributes){
			if (attributes.hasOwnProperty(attribute)){
				element[attribute] = attributes[attribute];
			}
		}
    return element;
  };
	
	this.getCSS = function httpGet() {
			if (window.XMLHttpRequest)
			{// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
			}
			else
			{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange=function()
			{
					if (xmlhttp.readyState==4 && xmlhttp.status==200)
					{
							return xmlhttp.responseText;
					}
			};
			xmlhttp.open("GET", "https://rawgit.com/jamesona/SEO-Tools/am-dashboard/dashboard.css", false );
			xmlhttp.send();    
	};
	
	
  this.Nav = this.createElement(document.body, 'ul', {
		className: 'navbar navbar-inverse navbar-fixed-bottom',
		id: 'dashboard',
	});
	this.Style = this.createElement(this.Nav, 'style', {
		innerHTML: this.getCSS(),
	});
  this.Tools = this.createElement(this.Nav, 'li');
  this.Tickets = this.createElement(this.Nav, 'li');
  this.Calendar = this.createElement(this.Nav, 'li');
  this.Critical = this.createElement(this.Nav, 'li');
}
