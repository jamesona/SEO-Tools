Tools = function(self){
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
  this.getTickets = (){
    var response = this.httpRequest({
      method: 'POST',
      url:'https://launchpad.boostability.com/TicketApi/Ticket_SelectRange',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cookie': document.cookie,
        'Referer': 'https://launchpad.boostability.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
      },
      body: '{"statusId":"1,2","teamIds":1055,"page":1,"pageSize":1000,"startDate":"05/06/2014 06:00:00","endDate":"05/06/2017 06:00:00","ownership":"Mine"}'
    });
    tickets = JSON.parse(response).Data;
    for (var i=0;i<tickets.length;i++){
      tickets[i].DueDate = new Date(tickets[i].DueDate);
      tickets[i].StartDate = new Date(tickets[i].StartDate);
      tickets[i].ScheduledEndDate = new Date(tickets[i].ScheduledEndDate);
      tickets[i].StatusDate = new Date(tickets[i].StatusDate);
    }
    return tickets;
  };
};
