/* call using this enclosure
  (function(){
    var url = 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.js';
    document.head.appendChild(document.createElement('script')).src=url;
    function initialize(){
      if (typeof(Dashboard) !== 'undefined' && typeof(ko) !== 'undefined' && ko.dataFor(app) !== undefined) {
          //console.log('Knockout:');console.log(ko);console.log('App:');console.log(ko.dataFor(app));
          db = new Dashboard(ko.dataFor(app))
      } else {
          setTimeout(function(){initialize()}, 100);
      }
    }
    initialize();
  })();
*/

function Dashboard(app) {
  var self = this;
  this.app = app;
  console.log(this.app);
  this.Tools = {
    bobCal: function(){},
    openClient: function(client) {
      self.app.showManageCustomer(client);
    },
    closeClient: function() {
      var buttons = document.getElementsByClassName('close'),
      i = buttons.length - 1;
      if (i >= 1) buttons[i - 1].click();
    },
    createElement: function(parent, tag, attributes) {
      var element = parent.appendChild(document.createElement(tag));
      for (var attribute in attributes) {
        if (attributes.hasOwnProperty(attribute)) {
          element[attribute] = attributes[attribute];
        }
      }
      return element;
    },
    bobParse: function(raw){ 
      var clients = [], data = {};
      // exit on null entry
      if ( raw == null ) return;
      for (var cells = raw.replace(/Basic[\r\n\s\ta-z]*Partner ID[\t\s]+/i, '').split(/\t/),
        client = {}, cols = ['Account ID',	'Account Start Date',	'Account Bucket',	'Account Spend',
        'Date of Next Ticket',	'Engaged Status',	'Timezone',	'Welcome Call',	'Keyword Research',
        'Local Profile Tab',	'Obtain or Create Google Logins',	'Create and Verify Google Profile',
        'Obtain Site Access',	'Implement Onsite Edits',	'Create Yahoo Account',	'Create and Verify Yahoo Profile',
        'Create and Verify Bing Profile',	'Install Analytics',	'Company Name',	'Contact Name',	'Website URL',	
        'Email Address',	'Phone Number',	'Partner ID',];
        cells.length>0;){
        keys = Object.keys(client).length;
        if (keys<cols.length-1){
          var param = cols[keys];
          client[param] = cells[0];
          cells.shift();
        } else {
          client.count = keys;
          clients.push(client);
          client = {};
        }
      }
      for (var i=0;i<clients.length;i++){
        var date = clients[i]['Date of Next Ticket']
        if (data[date] === undefined) data[date] = [];
        data[date].push(clients[i]);
      }
      return data;
    },
  };
  this.Tickets = {
    calendar: function(month, year, data) {
      console.log(data);
      if (typeof(month) == Object) {data = month, month = null;}
      this.current_date = new Date();
      this.day_labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      this.month_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.month = (isNaN(month) || month === null) ? this.current_date.getMonth() : month;
      this.year = (isNaN(year) || year === null) ? this.current_date.getFullYear() : year;
      this.draw = function(ele){
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
          for (var i = 0; i <= 6; i++ ) this.cells += '<td>' + this.day_labels[i] + '</td>';
          this.days.innerHTML = this.cells;
       
          //generate calendar
          var html = '<tr>';
          if ( startingDay ) html += '<td colspan="' + startingDay + '"></td>'; 
          for (var day = 1; day <= monthLength; day++) {
          html += '<td><div>' + day + '</div>';
          //if data argument present, append key value for current day
          if (data) {
            var today = (this.month+1)+'/'+day+'/'+this.year;
            if (data[today]) html += '<p>'+Object.keys(data[today]).length+' Clients</p>';
          }
          html += '</td>';
          if ( (day + startingDay) % 7 === 0 && day != monthLength ) html += '</tr><tr>';
          }
          if ( inLastRow ) html += '<td colspan="' + inLastRow + '"></td>';
          html += '</tr>';
          this.table.innerHTML += html;
          if (ele) {
            ele.innerHTML = this.table.outerHTML;
          } else {
            return this.table.outerHTML;
          }
          // save reference to dom node in object
          this.node = ele;
          // save reference to calendar object for enclosure scope
          var cal = this;
              (function(){
            // save calendar object reference for listeners
            var self = this;
                self.prev.addEventListener('click', function(){
              cal.month--;
                    cal.draw(cal.node);
                });
            self.next.addEventListener('click', function(){
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
        };
    },
    getTickets: function() {
      //get tickets
      if (self.app.contentViewModel() !== undefined){
        if (typeof(self.app.contentViewModel().myTickets) === "function"){
          self.Tickets.ticketArray = self.app.contentViewModel().myTickets();
        } else if (localStorage.ticketCache) {
          self.Tickets.ticketArray = JSON.parse(localStorage.ticketCache);
        }
      } else {
        self.Tickets.ticketArray = JSON.parse(localStorage.ticketCache);
      }
      //return results
      if (self.Tickets.ticketArray) {
        localStorage.ticketCache = JSON.stringify(self.Tickets.ticketArray);
        return self.Tickets.ticketArray;
      } else {
        alert('Unable to access tickets at this time!');
        return [];
      }
    },
    getCritical: function() {
      var tickets = this.getTickets(),
      critical = [];
      for (var i = 0; i < tickets.length; i++) {
        if (tickets[i].ScheduledEndDate < new Date()) {
          critical.push(tickets[i]);
        }
      }
      if (tickets.length > 0){
        return critical;
      } else {
        return false;  
      }
    },
    countCritical: function() {
      var criticals = self.Tickets.getCritical();
      if (criticals) {
        return '<a>Critical Tickets: <span style="color: #ff8888;font-weight: bolder;">' + criticals.length + '</span></a>';
      } else {
        return '<a>Error loading tickets!</a>';
      }
    },
    sortTickets: function(tickets){
      if (! tickets){
        tickets = this.getTickets();
      }
      var data = {};
      for (var i=0;i<tickets.length;i++){
        var ticket = tickets[i],
        date = new Date(ticket.ScheduledEndDate),
        day = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        if (! data[day]){ data[day] = [];}
        data[day].push(ticket);
      }
      return data;
    },
    listTickets: function(tickets){
      var list = document.createElement('ul');
      for (var i=0;i<tickets.length;i++){
        var ticket = tickets[i],
        listItem = document.createElement('li'),
        text = ticket.CompanyName+': '+ticket.TicketTypeName;
        text += ' (Due: '+(ticket.ScheduledEndDate.getMonth()+1);
        text += '/'+ticket.ScheduledEndDate.getDate()+'/';
        text += ticket.ScheduledEndDate.getFullYear()+')';
        listItem.innerHTML = text;
        list.appendChild(listItem);
      }
      return list;
    },
    tryCache: function(){
      try {
        if (self.Tickets.ticketArray) {
          localStorage.ticketCache = JSON.stringify(self.Tickets.ticketArray);
        }
      } catch(err) {
        setTimeout(function(){self.Tickets.tryCache()}, 1000);
      }
    },
  };
  this.HTML = {};
  this.HTML.dashboard = this.Tools.createElement(document.body, 'div', {
        className: 'navbar navbar-inverse navbar-fixed-bottom',
        id: 'dashboard',
  });
  this.HTML.style = this.Tools.createElement(this.HTML.dashboard, 'link', {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.css',
  }),
  this.HTML.nav = this.Tools.createElement(this.HTML.dashboard, 'ul', {
    className: 'nav navbar-nav',
  }),
  this.HTML.tools = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: '<a class="dropdown-toggle" data-toggle="dropdown">Tools</a>',
    className: 'dropup',
  }),
  this.HTML.toolsMenu = this.Tools.createElement(this.HTML.tools, 'ul', {
    className: 'dropdown-menu',
  }),
  this.HTML.tickets = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: '<a class="dropdown-toggle" data-toggle="dropdown">Tickets</a>',
    className: 'dropup',
  }),
  this.HTML.ticketsMenu = this.Tools.createElement(this.HTML.tickets, 'ul', {
    className: 'dropdown-menu',
  }),
  this.HTML.ticketCalendar = this.Tools.createElement(this.HTML.ticketsMenu, 'li', {
    innerHTML: '<a>Calendar</a>',
    onclick: function(){
      var node = bootbox.alert('none')[0].children[0].children[0].children[0],
      data = self.Tickets.sortTickets(),
      calendar = new self.Tickets.calendar(data);
      calendar.draw(node);
    }
  }),
  this.HTML.critical = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: '<a>Click to show Critical</a>',
    id: 'critical',
    onclick: self.Tickets.countCritical(),
  });
  
  window.beforeunload = function(){
    self.Tickets.tryCache();
  };
  window.onhashchange = function(){
    if (window.location.href == 'https://launchpad.boostability.com/#/customerservice/activetickets'){
      self.Tickets.tryCache();  
    }
  };
  if (localStorage.ticketCache) self.Tickets.ticketArray = JSON.parse(localStorage.ticketCache);
}
