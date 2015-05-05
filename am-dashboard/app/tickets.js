Tickets = function(self){
  this.calendar = function(month, year, data) {
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
  };
  this.getTickets = function() {
    var lp = ko.dataFor(app);
    //get tickets
    if (lp.contentViewModel() !== undefined){
      if (typeof(lp.contentViewModel().myTickets) === "function"){
        self.Tickets.ticketArray = lp.contentViewModel().myTickets();
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
  };
  this.getCritical = function() {
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
  };
  this.countCritical = function() {
    var criticals = self.Tickets.getCritical();
    if (criticals) {
      return '<a>Critical Tickets: <span style="color: #ff8888;font-weight: bolder;">' + criticals.length + '</span></a>';
    } else {
      return '<a>Error loading tickets!</a>';
    }
  };
  this.sortTickets = function(tickets){
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
  };
  this.listTickets = function(tickets){
    var list = document.createElement('table'),
    head = list.appendChild(document.createElement('thead')),
    body = list.appendChild(document.createElement('tbody'));
    head.innerHTML = '<tr><th>Business Name</th><th>Ticket Type</th><th>Due Date</th></tr>';
    sorttable.makeSortable(list);
    for (var i=0;i<tickets.length;i++){
      var ticket = tickets[i],
      listItem = document.createElement('tr'),
      content = '<td>'+ticket.CompanyName+'</td><td>'+ticket.TicketTypeName+'</td>';
      content += '<td>'+(ticket.ScheduledEndDate.getMonth()+1);
      content += '/'+ticket.ScheduledEndDate.getDate()+'/';
      content += ticket.ScheduledEndDate.getFullYear()+'</td>';
      listItem.innerHTML = content;
      listItem.setAttribute('data-client', ticket.CustomerId);
      listItem.onclick = function(){
        self.Tools.openClient(this.dataset.client);
        var modals = document.getElementsByClassName('bootbox-close-button');
        for (var i=0;i<modals.length;i++){modals[i].click();}
      };
      body.appendChild(listItem);
    }
    return list;
  };
  this.showTickets = function(tickets){
    bootbox.dialog({
      message: self.Tickets.listTickets(tickets),
      title: "Tickets (click row to open client)",
      className: "ticket-list",
      buttons: {},
    });
  };
  this.tryCache = function(){
    try {
      if (self.Tickets.ticketArray) {
        localStorage.setItem('ticketCache', JSON.stringify(self.Tickets.ticketArray));
      }
    } catch(err) {
      setTimeout(function(){self.Tickets.tryCache();}, 1000);
    }
  };
};
