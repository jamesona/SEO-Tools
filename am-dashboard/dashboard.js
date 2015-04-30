/* load and initialize using this closure (add var before "db" on line 6, to privatize scope)
  (function(){
    var url = 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/dashboard.js';
    document.head.appendChild(document.createElement('script')).src=url;
    function initialize(){
      if (
          typeof(Dashboard) !== 'undefined' &&
          typeof(bootbox) !== 'undefined' &&
          typeof(ko) !== 'undefined' &&
          ko.dataFor(app) !== undefined
          ) {
          db = new Dashboard(ko.dataFor(app), ko, bootbox);
      } else {
          setTimeout(function(){initialize()}, 100);
      }
    }
    initialize();
  })();
*/

function Dashboard(application, ko, bootbox) {
  var self = this;
  this.app = application;
  console.log(this.app);
  this.Tools = {
    bobParse: function(raw){ 
      var clients = [], data = {type: 'Clients'};
      // exit on null entry
      if ( raw === null ) return;
      for (var cells = raw.replace(/Basic[\r\n\s\ta-z]*Partner ID[\t\s]+/i, '').split(/\t/),
        client = {}, cols = ['Account ID',  'Account Start Date',  'Account Bucket',  'Account Spend',
        'Date of Next Ticket',  'Engaged Status',  'Timezone',  'Welcome Call',  'Keyword Research',
        'Local Profile Tab',  'Obtain or Create Google Logins',  'Create and Verify Google Profile',
        'Obtain Site Access',  'Implement Onsite Edits',  'Create Yahoo Account',  'Create and Verify Yahoo Profile',
        'Create and Verify Bing Profile',  'Install Analytics',  'Company Name',  'Contact Name',  'Website URL',  
        'Email Address',  'Phone Number',  'Partner ID',];
        cells.length>0;){
        var keys = Object.keys(client).length;
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
        var date = clients[i]['Date of Next Ticket'];
        if (data[date] === undefined) data[date] = [];
        data[date].push(clients[i]);
      }
      return data;
    },
    todoistExport: function (){
      var view, data,
      taskDate = function(day){
        var days = [new Date(),new Date(),new Date()];
        if (days[0].getDay() == 5) {
          days[1].setDate(days[0].getDate()+3);
          days[2].setDate(days[0].getDate()+4);
        } else if (days[0].getDay() == 4) {
          days[1].setDate(days[0].getDate()+1);
          days[2].setDate(days[0].getDate()+4);
        } else {
          days[1].setDate(days[0].getDate()+1);
          days[2].setDate(days[0].getDate()+2);
        }
        return 'date '+days[day].toDateString().substring(4);
      },
      textarea = document.createElement('textarea'), text = '',
      modal = bootbox.alert({ 
          size: 'large',
          message: 'placeholder', 
          callback: function(){},
      })[0].children[0].children[0].children[0].children[1];
      if (ko.dataFor(window.app) !== undefined){
        view = ko.dataFor(window.app).contentViewModel();
      } else if (ko.dataFor(self.app) !== undefined){
        view = ko.dataFor(self.app).contentViewModel();
      } 
      if (! view.hasOwnProperty('customersDataTable')){
        modal.remove();
        bootbox.alert('No client data available in active view.<br />Try running this tool after searching for a client.');
        return 1;
      } else {
        if (typeof(view.customersDataTable) === undefined) {
          console.log('No customersDataTable');
          return;
        } else {
          data = view.customersDataTable.dataSource()[0];
        }
        text += data.CustomerId+' - '+data.Name;
        text += '[[NOTE]]: https://launchpad.boostability.com/#customerservice/customersearch/'+data.CustomerId;
        text += '\n...'+data.CustomerId+' Welcome Call [['+taskDate(2)+']]';
        text += '\n......'+data.CustomerId+' 1st Welcome Call [['+taskDate(0)+']]';
        text += '\n......'+data.CustomerId+' 1st Welcome Email [['+taskDate(0)+']]';
        text += '\n......'+data.CustomerId+' 2nd Welcome Call [['+taskDate(1)+']]';
        text += '\n......'+data.CustomerId+' 2nd Welcome Email [['+taskDate(1)+']]';
        text += '\n......'+data.CustomerId+' 3rd Welcome Call [['+taskDate(2)+']]';
        text += '\n......'+data.CustomerId+' 3rd Welcome Email [['+taskDate(2)+']]';
        text += '\n...'+data.CustomerId+' Keyword Research';
        text += '\n...'+data.CustomerId+' Local Profile';
        textarea.value = text;
        modal.parentNode.parentNode.parentNode.style.width = "65.5em";
        modal.innerHTML = '<pre>'+text+'</pre>';
      }
    },
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
  };
  this.Tickets = {
    calendar: function(month, year, data) {
      if ( typeof(month) === 'object' ) {
        data = month;
        month = null;
      }
      this.current_date = new Date();
      this.day_labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      this.month_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.month = (isNaN(month) || month === null) ? this.current_date.getMonth() : month;
      this.year = (isNaN(year) || year === null) ? this.current_date.getFullYear() : year;
      this.draw = function(ele){
          // get dates
          var startingDay = new Date(this.year, this.month, 1).getDay(),
          endingDate = new Date(this.year, this.month + 1, 0),
          monthLength = endingDate.getDate(),
          inLastRow = 6 - endingDate.getDay();
          if (this.month > 11) {
            this.month -= 12;
            this.year += 1;
          } else if (this.month < 0) {
            this.month += 12;
            this.year -= 1;
          }
       
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
            if (data[today]) {
              html += '<p>'+Object.keys(data[today]).length+' '+data.type+'</p>';
              html += '<p><button class="btn btn-primary" onclick="db.Tickets.showTickets(db.Tickets.sortTickets()[\''+today+'\']);">Show Tickets</button></p>';
            }
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
        } 
      } else if (localStorage.getItem('ticketCache') !== null){
        self.Tickets.ticketArray = JSON.parse(localStorage.getItem('ticketCache'));
      }
      //return results
      if (self.Tickets.ticketArray) {
        localStorage.setItem('ticketCache', JSON.stringify(self.Tickets.ticketArray));
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
      var data = {type: 'Tickets'};
      for (var i=0;i<tickets.length;i++){
        var ticket = tickets[i],
        date = new Date(ticket.ScheduledEndDate),
        day = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
        if (! data[day]){ data[day] = [];}
        data[day].push(ticket);
      }
      return data;
    },
    listTickets: function(tickets){
      var list = document.createElement('table'),
      head = list.appendChild(document.createElement('tr'));
      head.innerHTML = '<th>Business Name</th><th>Ticket Type</th><th>Due Date</th>';
      for (var i=0;i<tickets.length;i++){
        var ticket = tickets[i],
        listItem = document.createElement('tr'),
        content = '<td>'+ticket.CompanyName+'</td><td>'+ticket.TicketTypeName+'</td>';
        content += '<td>'+(ticket.ScheduledEndDate.getMonth()+1);
        content += '/'+ticket.ScheduledEndDate.getDate()+'/';
        content += ticket.ScheduledEndDate.getFullYear()+'</td>';
        listItem.innerHTML = content;
        listItem.onclick = function(){
          self.Tools.openClient(ticket.CustomerId);
          var modals = document.getElementsByClassName('bootbox-close-button');
          for (var i=0;i<modals.length;i++){modals[i].click();}
        };
        list.appendChild(listItem);
      }
      return list;
    },
    showTickets: function(tickets){
      bootbox.dialog({
        message: self.Tickets.listTickets(tickets),
        title: "Tickets",
        className: "ticket-list",
        buttons: {},
      });
    },
    tryCache: function(){
      try {
        if (self.Tickets.ticketArray) {
          localStorage.setItem('ticketCache', JSON.stringify(self.Tickets.ticketArray));
        }
      } catch(err) {
        setTimeout(function(){self.Tickets.tryCache();}, 1000);
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
  });
  this.HTML.nav = this.Tools.createElement(this.HTML.dashboard, 'ul', {
    className: 'nav navbar-nav',
  });
  this.HTML.tools = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: '<a class="dropdown-toggle" data-toggle="dropdown">Tools</a>',
    className: 'dropup',
  });
  this.HTML.toolsMenu = this.Tools.createElement(this.HTML.tools, 'ul', {
    className: 'dropdown-menu',
  });
  this.HTML.todoistExport = this.Tools.createElement(this.HTML.toolsMenu, 'li', {
    innerHTML: '<a>Todoist Export</a>',
    onclick: function(){
      self.Tools.todoistExport();
    },
  });
  this.HTML.bobCalendar = this.Tools.createElement(this.HTML.toolsMenu, 'li', {
    innerHTML: '<a>BoB Calendar</a>',
    onclick: function(){
      bootbox.dialog({
        message: " ",
        title: "",
        className: "big-modal",
        buttons: {},
      });
      var modals = document.getElementsByClassName('bootbox-body'), modal = modals[modals.length-1],
      data = self.Tools.bobParse(prompt('Paste BoB data')),
      calendar = new self.Tickets.calendar(data);
      calendar.draw(modal);
    },
  });
  this.HTML.tickets = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: '<a class="dropdown-toggle" data-toggle="dropdown">Tickets</a>',
    className: 'dropup',
  });
  this.HTML.ticketsMenu = this.Tools.createElement(this.HTML.tickets, 'ul', {
    className: 'dropdown-menu',
  });
  this.HTML.ticketCalendar = this.Tools.createElement(this.HTML.ticketsMenu, 'li', {
    innerHTML: '<a>Calendar</a>',
    onclick: function(){
      bootbox.dialog({
        message: " ",
        title: "",
        className: "big-modal",
        buttons: {},
      });
      var modals = document.getElementsByClassName('bootbox-body'), modal = modals[modals.length-1],
      data = self.Tickets.sortTickets(),
      calendar = new self.Tickets.calendar(data);
      calendar.draw(modal);
    },
  });
  this.HTML.critical = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: '<a>Show Critical Count</a>',
    id: 'critical',
    onclick: function(){
      self.HTML.critical.innerHTML = self.Tickets.countCritical();
    },
  });
  
  window.beforeunload = function(){
    self.Tickets.tryCache();
  };
  window.onhashchange = function(){
    if (window.location.href == 'https://launchpad.boostability.com/#/customerservice/activetickets'){
      self.Tickets.tryCache();  
    }
  };
  if (localStorage.getItem('ticketCache') !== null) self.Tickets.ticketArray = JSON.parse(localStorage.getItem('ticketCache'));
}
