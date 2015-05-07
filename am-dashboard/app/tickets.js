Tickets = function(self){
  this.calendar = function(month, year, data) {
    if ( typeof(month) === 'object' ) {
      data = month;
      month = null;
    }
    var self = data.self;
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
          if (data) {
            var today = (this.month+1)+'/'+day+'/'+this.year;
            if (data[today]) {
              days[day].innerHTML += '<p>'+Object.keys(data[today]).length+' '+data.type+'</p><p>';
              var button = days[day].appendChild(document.createElement('button'));
              button.className = 'btn btn-primary';
              button.setAttribute('data-day', today);
              button.innerHTML = 'Show Tickets';
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
  this.getTickets = function(){
    var response = self.Tools.httpRequest({
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
      body: '{"statusId":"1,2","teamIds":"2,1,4,6,5,1085,1092,1046,1143,7,1175,1150,1162,1203,1119,1065,1036,1145,1152,1172,1124,1086,33,1113,1116,1106,1158,8,1139,1136,1130,1183,1179,1169,1070,23,1101,1045,1038,25,1155,1114,28,1107,1117,1043,1044,9,1041,1074,10,1133,11,35,27,1091,1149,1128,1160,1137,1177,1174,1176,1181,1196,1140,1199,12,1194,1093,1192,1206,1212,1069,1122,1121,1171,1201,1080,1040,1185,1082,30,1051,1066,1189,13,1195,1202,1205,1210,1144,1166,1131,1053,1170,1054,1081,1190,1042,1216,1209,1115,1207,1108,1126,1056,1059,1134,1105,1213,1098,1062,1072,1079,1097,1200,14,1217,1052,1197,1127,1148,1077,1049,1146,31,1141,1103,1099,1132,1187,1147,1157,1068,1110,1193,1161,1047,1163,1120,1168,1215,1100,1129,15,34,1064,1191,1071,1060,1050,16,1184,29,1061,1142,1188,1138,1034,1063,1057,1075,1037,1159,1102,1039,1125,1186,1153,17,1154,1035,1078,18,1090,1067,1083,1084,1055,1204,1104,19,1048,1073,1112,1111,1123,3,1088,1058,1198,1208,1118,1076,26,1167,1135,1087,1096,1178,1180,1089,1164,1182,1156,32,1173,1214,24,21,20,1165,22,1211,1151","page":1,"pageSize":1000,"startDate":"05/06/2000 06:00:00","endDate":"05/06/3000 06:00:00","ownership":"Mine"}'
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
  this.getCritical = function() {
    var tickets = this.getTickets(),
    critical = [];
    for (var i = 0; i < tickets.length; i++) {
      if (tickets[i].ScheduledEndDate < new Date()) {
        critical.push(tickets[i]);
      }
    }
    return critical;
  };
  this.countCritical = function() {
    var criticals = self.Tickets.getCritical();
    return '<a>Critical Tickets: <span style="color: #ff8888;font-weight: bolder;">' + criticals.length + '</span></a>';
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
    sorttable.makeSortable(list);
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
};
