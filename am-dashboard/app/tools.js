Tools = function(self){
  this.calendar = function(data) {
    if (typeof(data.self) !== undefined) this.self = data.self;
    if (typeof(data.data) !== undefined) this.data = data.data;
    this.current_date = new Date();
    this.day_labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.month_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.month = (isNaN(data.month) || month === null) ? this.current_date.getMonth() : data.month;
    this.year = (isNaN(data.year) || year === null) ? this.current_date.getFullYear() : data.year;
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
        var days = [], rows = [];
        rows[0] = document.createElement('tr');
        if ( startingDay ) {
          days[0] = rows[0].appendChild(document.createElement('td'));
          days[0].colSpan = startingDay; 
        }
        for (var day = 1; day <= monthLength; day++) {
          var row = rows[rows.length - 1];
          days[day] = row.appendChild(document.createElement('td'));
          var number = days[day].appendChild(document.createElement('div'));
          number.innerHTML = day;
          //if data argument present, append key value for current day
          if (this.data) {
            var today = (this.month+1)+'/'+day+'/'+this.year;
            if (this.data[today]) {
              days[day].innerHTML += '<p>'+Object.keys(this.data[today]).length+' '+this.data.type+'</p><p>';
              var button = days[day].appendChild(document.createElement('button'));
              button.className = 'btn btn-primary';
              button.setAttribute('data-day', today);
              button.setAttribute('data-data', this.data[today]);
              button.innerHTML = 'Show '+this.data.type;
              //this.self.Tickets.showTickets(this.tickets[today])
              //this.self.Tickets.showClients(this.tickets[today])
              button.setAttribute('onclick', 'db.Tickets.showTickets(db.Tickets.sortTickets()[this.dataset.day]);');
              days[day].innerHTML += '</p>';
            }
          }
          if ( (day + startingDay) % 7 === 0 && day != monthLength ) rows[rows.length] = document.createElement('tr');
        }
        if ( inLastRow ) {
          var day = days.length - 1, row = rows.length - 1;
          days[day] = rows[row].appendChild(document.createElement('td'));
          days[day].colSpan = inLastRow;
        }
        for (var i=0;i<rows.length;i++) {this.table.appendChild(rows[i])};
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
  this.bobParse = function(raw){ 
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
  };
  this.todoistExport = function (){
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
    } else if (ko.dataFor(app) !== undefined){
      view = ko.dataFor(app).contentViewModel();
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
      text += '\n[[NOTE]]: https://launchpad.boostability.com/#customerservice/customersearch/'+data.CustomerId;
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
      modal.parentNode.parentNode.parentNode.style.width = "50em";
      modal.innerHTML = '<pre>'+text+'</pre>';
    }
  };
  this.openClient = function(client) {
    var lp = ko.dataFor(app);
    lp.showManageCustomer(client);
  };
  this.closeClient = function() {
    var buttons = document.getElementsByClassName('close'),
    i = buttons.length - 1;
    if (i >= 1) buttons[i - 1].click();
  };
  this.createElement = function(parent, tag, attributes) {
    var element = parent.appendChild(document.createElement(tag));
    for (var attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        element[attribute] = attributes[attribute];
      }
    }
    return element;
  };
  this.nextTicket = function(tickets){
    self.Tools.closeClient();
    self.Tools.openClient(tickets[0].CustomerId);
  };
  this.httpRequest = function(data){
    var request = new XMLHttpRequest();
    request.open( data.method, data.url, false );
    for (var header in data.headers) {
      if (data.headers.hasOwnProperty(header)) {
          request.setRequestHeader(header, data.headers[header]);
      }
    }
    request.send( data.body );
    return request.responseText;
  };
  this.getClient = function(client){
    var response = this.httpRequest({
      method: 'GET',
      url:'https://launchpad.boostability.com/CustomerApi/Customer_Select?customerId='+client,
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cookie': document.cookie,
        'Referer': 'https://launchpad.boostability.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });
    return JSON.parse(response);
  };
  this.getKeywords = function(client){ 
    var activeResponse = this.httpRequest({
      method: 'GET',
      url:'https://launchpad.boostability.com/WebsiteUrlApi/WebsiteUrl_SelectActiveUrls?customerId='+client,
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cookie': document.cookie,
        'Referer': 'https://launchpad.boostability.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }),
    trackingResponse = this.httpRequest({
      method: 'GET',
      url:'https://launchpad.boostability.com/WebsiteKeywordTrackingApi/WebsiteKeywordTracking_Select?customerId='+client,
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cookie': document.cookie,
        'Referer': 'https://launchpad.boostability.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });
    return {active: JSON.parse(activeResponse).Data, tracking: JSON.parse(trackingResponse).Data};
  };
};
