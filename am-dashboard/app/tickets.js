Tickets = function(self){
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
  this.editTicket = function(ticket){
    ko.dataFor(app).headerViewModel().editTicket(ticket)
  };
};
