/* call using the following enclosure:
(function(){
  var url = 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.js';
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
	

  this.getTickets = function(){
		return ko.dataFor(app).statsViewModel().myTickets();
	};

  this.getCritical = function(){
    var tickets = this.getTickets(),
        critical = [];
    for (var i=0;i<tickets.length;i++){
      if (tickets[i].ScheduledEndDate < new Date()){
          critical.push(tickets[i]);
      } 
    }
    return critical;
  };

  this.openClient = function(client){
    ko.dataFor(app).showManageCustomer(client);
  };    

    this.closeClient = function (){
        var buttons = document.getElementsByClassName('close'),
            i = buttons.length - 1;
        if (i >= 1) buttons[i-1].click();
    };
	
  this.Dashboard = this.createElement(document.body, 'div', {
    className: 'navbar navbar-inverse navbar-fixed-bottom',
    id: 'dashboard',
	});
  this.Nav = this.createElement(this.Dashboard, 'ul', {
    className: 'nav navbar-nav',
	});
  this.Style = this.createElement(this.Nav, 'link', {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.css',
	});
  this.Tools = this.createElement(this.Nav, 'li',{
    innerHTML: '<a>Tools</a>',
  });
  this.Tickets = this.createElement(this.Nav, 'li',{
    innerHTML: '<a>Tickets</a>',
  });
  this.Calendar = this.createElement(this.Nav, 'li',{
    innerHTML: '<a>Calendar</a>',
  });
  this.Critical = this.createElement(this.Nav, 'li',{
    innerHTML: '<a>Click to get Critical</a>',
    id: 'critical',
    onclick: function(){this.innerHTML = '<a>Critical Tickets: <span style="color: #ff8888;font-weight: bolder;">'+db.getCritical().length+'</span></a>';}
  });
}
