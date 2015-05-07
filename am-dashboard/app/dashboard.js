function Dashboard() {
  var self = this;
  this.Tools = new Tools(this);
  this.Tickets = new Tickets(this);
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
      data = {
        data: self.Tools.bobParse(prompt('Paste BoB data')),
        self: self,
        month: NaN,
        year: NaN,
      },
      calendar = new self.Tools.calendar(data);
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
      data = {
        data: self.Tickets.sortTickets(),
        self: self,
        month: NaN,
        year: NaN,
      },
      calendar = new self.Tools.calendar(data);
      calendar.draw(modal);
    },
  });
  this.HTML.nextTicket = this.Tools.createElement(this.HTML.ticketsMenu, 'li', {
    innerHTML: '<a>Next Ticket</a>',
    onclick: function(){
      self.Tools.nextTicket(self.Tickets.sortTickets()[new Date().toLocaleDateString()]);
    },
  });
  this.HTML.critical = this.Tools.createElement(this.HTML.nav, 'li', {
    innerHTML: self.Tickets.countCritical(),
    id: 'critical',
    onclick: function(){
      self.Tickets.showTickets(self.Tickets.getCritical());
    },
  });
  this.HTML.openTicketFromURL = this.Tools.createElement(this.HTML.toolsMenu, 'li', {
    innerHTML: '<a>Open Ticket from URL</a>',
    onclick: function(){
      var lookup = {},
      tickets = db.Tickets.getTickets();
      for (var i=0;i<tickets.length;i++){
        lookup[tickets[i].TicketId] = tickets[i];
      }
      self.Tickets.editTicket(lookup[parseInt(self.Tools.checkOpts().ticket)]);
    },
  }); 
}
