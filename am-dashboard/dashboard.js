/* call using the following enclosure:
(function(){
  var url = 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.js';
  document.head.appendChild(document.createElement('script')).src=url;
})();
*/

function Dashboard() {
	var self = this;
	this.createElement = function(parent, tag, attributes) {
		var element = parent.appendChild(document.createElement(tag));
		for (var attribute in attributes) {
			if (attributes.hasOwnProperty(attribute)) {
				element[attribute] = attributes[attribute];
			}
		}
		return element;
	};

	this.openClient = function(client) {
		ko.dataFor(app).showManageCustomer(client);
	};

	this.closeClient = function() {
		var buttons = document.getElementsByClassName('close'),
		i = buttons.length - 1;
		if (i >= 1) buttons[i - 1].click();
	};

	this.calendar = function(month, year, data) {
		if (typeof(month) == Object) data = month, month = null;
		this.current_date = new Date();
		this.day_labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.month_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		this.month = (isNaN(month) || month === null) ? this.current_date.getMonth() : month;
		this.year = (isNaN(year) || year === null) ? this.current_date.getFullYear() : year;
		this.draw = function(callback) {
			if (this.month > 11) {
				this.month -= 12;
				this.year += 1;
			} else if (month < 0) {
				this.month += 12;
				this.year -= 1;
			}
			// get dates
			var startingDay = new Date(this.year, this.month, 1).getDay(),
				endingDate = new Date(this.year, this.month + 1, 0),
				monthLength = endingDate.getDate(),
				inLastRow = 6 - endingDate.getDay();
			// generate header
			this.table = document.createElement('table');
			this.head = document.createElement('thead');
			this.prev = document.createElement('th');
			this.next = document.createElement('th');
			this.title = document.createElement('th');
			this.days = document.createElement('tr');
			this.body = document.createElement('tbody');
			this.cells = '';
			this.table.setAttribute('class', 'calendar');
			this.table.appendChild(this.head);
			this.head.appendChild(this.prev);
			this.prev.innerHTML = "&#171;";
			this.prev.id = 'prev';
			this.head.appendChild(this.title);
			this.head.appendChild(this.next);
			this.next.innerHTML = "&#187;";
			this.next.id = 'next';
			this.table.appendChild(this.days);
			this.title.innerHTML = this.month_labels[this.month] + "&#160;" + this.year;
			this.title.setAttribute('colspan', '5');
			this.days.setAttribute('class', 'header');
			for (var i = 0; i <= 6; i++) this.cells += '<td>' + this.day_labels[i] + '</td>';
			this.days.innerHTML = this.cells;
			//generate calendar
			var html = '<tr>';
			if (startingDay) html += '<td colspan="' + startingDay + '"></td>';
			for (var day = 1; day <= monthLength; day++) {
				html += '<td><div>' + day + '</div>';
				//if data argument present, append key value for current day
				if (data) {
					var today = (this.month + 1) + '/' + day + '/' + this.year;
					if (data[today]) html += '<p>' + Object.keys(data[today]).length + ' Tickets</p>';
				}
				html += '</td>';
				if ((day + startingDay) % 7 === 0 && day != monthLength) html += '</tr><tr>';
			}
			if (inLastRow) html += '<td colspan="' + inLastRow + '"></td>';
			html += '</tr>';
			this.table.innerHTML += html;
			if (typeof(callback) == function) callback();
		};
		this.getContent = function(){
              		return this.table.outerHTML;
		};
		this.registerTriggers = function(ele){
			// save reference to dom node in object
			this.node = ele;
			// save reference to calendar object for enclosure scope
			var cal = this;
			(function() {
				// save calendar object reference for listeners
				var self = this;
				self.prev.addEventListener('click', function() {
					cal.month--;
					cal.draw(cal.node);
				});
				self.next.addEventListener('click', function() {
					cal.month++;
					cal.draw(cal.node);
				});
				document.onkeydown = function(e) {
					e = e || window.event;
					if (e.keyCode == '37') {
						// left arrow
						cal.month--;
						cal.draw(cal.node);
					} else if (e.keyCode == '39') {
						// right arrow
						cal.month++;
						cal.draw(cal.node);
					}
				};
			})();
		}
	};
	this.HTML = {};
	this.HTML.dashboard = this.createElement(document.body, 'div', {
		className: 'navbar navbar-inverse navbar-fixed-bottom',
		id: 'dashboard',
	});
	this.HTML.style = this.createElement(this.HTML.dashboard, 'link', {
		rel: 'stylesheet',
		type: 'text/css',
		href: 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.css',
	});
	this.HTML.nav = this.createElement(this.HTML.dashboard, 'ul', {
		className: 'nav navbar-nav',
	});
	this.HTML.tools = this.createElement(this.HTML.nav, 'li', {
		innerHTML: '<a class="dropdown-toggle" data-toggle="dropdown">Tools</a>',
		className: 'dropup',
	});
	this.HTML.toolsMenu = this.createElement(this.HTML.tools, 'ul', {
		className: 'dropdown-menu',
	});
	this.HTML.tickets = this.createElement(this.HTML.nav, 'li', {
		innerHTML: '<a class="dropdown-toggle" data-toggle="dropdown">Tickets</a>',
		className: 'dropup',
	});
	this.HTML.ticketsMenu = this.createElement(this.HTML.tickets, 'ul', {
		className: 'dropdown-menu',
	});
	this.HTML.ticketCalendar = this.createElement(this.HTML.ticketsMenu, 'li', {
		innerHTML: '<a>Calendar</a>',
	});
	this.HTML.critical = this.createElement(this.HTML.nav, 'li', {
		innerHTML: '<a>Click to get Critical</a>',
		id: 'critical',
		onclick: function() {
			this.innerHTML = '<a>Critical Tickets: <span style="color: #ff8888;\
        font-weight: bolder;">' + self.Tickets.getCritical().length + '</span></a>';
		},
	});


	this.Tickets = {
		getTickets: function() {
			self.Tickets.ticketArray = ko.dataFor(app).contentViewModel().myTickets();
			return self.Tickets.ticketArray;
		},
		getCritical: function() {
			var tickets = this.getTickets(),
			critical = [];
			for (var i = 0; i < tickets.length; i++) {
				if (tickets[i].ScheduledEndDate < new Date()) {
					critical.push(tickets[i]);
				}
			}
			return critical;
		},
		sortTickets: function(){
			var data = {};
			if (! this.ticketArray) this.getTickets();
			for (var i=0;i<this.ticketArray.length;i++){
				var ticket = this.ticketArray[i],
				date = new Date(ticket.ScheduledEndDate),
				day = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
				if (! data[day]){ data[day] = []};
				data[day].push(ticket);
			}
			return data;
		}
	}
}
