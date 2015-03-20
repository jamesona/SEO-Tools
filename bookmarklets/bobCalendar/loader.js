// call using the following enclosure:
(function(){
  var url = 'https://rawgit.com/jamesona/SEO-Tools/Book-Of-Business/bookmarklets/bobCalendar/loader.js';
  document.head.appendChild(document.createElement('script')).src=url;
})();
// End enclosure
(function(){
  // load parser class
  var BobParse = function(){ 
      this.dates = {}; 
      this.raw = prompt('Copy all data (Ctrl+A, Ctrl+C) and paste'); 
      this.parse = this.raw.split("\n").filter(function(str){return (/\S/).test(str);}); 
      this.parse.shift(); this.parse.shift(); 
      for (var l=0; l < this.parse.length; l++){ 
      	this.parse[l] = this.parse[l].split(/\t/);
      } 
      for (var i=0;i<this.parse.length;i++) { 
      	if (!(this.parse[i][4] in this.dates)) this.dates[this.parse[i][4]] = {}; 
      	if (!(this.dates[this.parse[i][0]] in this.dates[this.parse[i][4]])) { 
      		var date = {}; 
      		date.start = this.parse[i][1]; 
      		date.bucket = this.parse[i][2]; 
      		date.spend = this.parse[i][3]; 
      		date.due = this.parse[i][4]; 
      		this.dates[this.parse[i][4]][this.parse[i][0]] = date; 
      	} 
      }
  }; 
  // load modal class
  var Modal = function(title, body, callback) {
    this.modalContainer = document.createElement('div');
    this.modalContainer.id = 'modal-container';
    this.modalBox = document.createElement('div');
    this.modalBox.id = 'modal';
    this.modalTitle = document.createElement('h1');
    this.modalTitle.innerHTML = (title !== null && title !== 'undefined' && typeof(title) === 'string') ? title : 'Modal';
    this.modalClose = document.createElement('button');
    this.modalClose.innerHTML = 'X';
    this.modalTitle.appendChild(this.modalClose);
    this.modalBody = document.createElement('div');
    if (typeof(body) === 'object') {
      this.modalBody.innerHTML = body.outerHTML;
    } else if (typeof(body) === 'string'){
      this.modalBody.innerHTML = body;
    }
    this.modalContainer.appendChild(this.modalBox);
    this.modalBox.appendChild(this.modalTitle);
    this.modalBox.appendChild(this.modalBody);
    this.destroy = function(){
      this.modalBox.parentNode.removeChild(this.modalBox);
    };
    this.attach = function(ele){
      var self = this;
      if (ele) {ele.appendChild(this.modalBox);} else {document.body.appendChild(this.modalBox);}
      (function(){
        self.modalClose.addEventListener('click', function(){
          self.destroy();
        });
      })();
    };
    if (callback) callback();
  };
  // load calendar class
  var Calendar = function(month, year, data) {
  	this.current_date = new Date();
  	this.day_labels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  	this.month_labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  	this.month = (isNaN(month) || month === null) ? this.current_date.getMonth() : month;
  	this.year  = (isNaN(year) || year === null) ? this.current_date.getFullYear() : year;
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
  		this.prev.innerHTML = "&laquo;";
  		this.prev.id = 'prev';
  		this.head.appendChild(this.title);
  		this.head.appendChild(this.next);
  		this.next.innerHTML = "&raquo";
  		this.next.id = 'next';
   
  		this.table.appendChild(this.days);
  		this.title.innerHTML = this.month_labels[this.month] + "&nbsp;" + this.year;
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
      ele.innerHTML = this.table.outerHTML;
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
      })();
  	};
  };
  var date = new Date(), modal = new Modal('Client Calendar'), calendar = new Calendar(date.getMonth(),date.getFullYear(),new BobParse().dates), style = document.createElement('style');
	style.innerHTML = 'body, #modal {width:100%;height:100%;padding:0;margin:0;}';
  style.innerHTML += '#modal {font-family: sans-serif;background: rgba(0,0,0,0.5);padding-top:5em;}';
  style.innerHTML += '#modal button {float:right;}';
	style.innerHTML += '#modal>div, #modal>h1 {width: 70%;background:rgb(50,50,50);color:#fff;display:inline-block;margin:0;text-align: center;margin-left:15%;border:1px solid rgb(50,50,50);padding:5px;}';
	style.innerHTML += '#modal .calendar{background:#fff;width:100%;height:80%;em;border-collapse:collapse;padding:0px;margin:0;}';
	style.innerHTML += '#modal .calendar td {border:1px solid black;width:14%;vertical-align:top;padding:5px;}';
	style.innerHTML += '#modal .calendar td div {float:right;border:1px solid black;width:1.5em;height:1.5em;margin:-6px;text-align:center;vertical-align:middle;}';
	style.innerHTML += '#modal .calendar td p {font-weight:bold;text-align:center;}'
	modal.attach();
  modal.modalBox.appendChild(style);
  calendar.draw(modal.modalBody);
})();
