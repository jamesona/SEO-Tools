Tools = function(){return {
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
};