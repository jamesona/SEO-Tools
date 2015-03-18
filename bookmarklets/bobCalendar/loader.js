(function(){
  (function(){
    var url = 'https://rawgit.com/jamesona/SEO-Tools/Book-Of-Business/bookmarklets/bobCalendar/bobcal.css';
    document.head.appendChild(document.createElement('link')).href=url;
  })();
  function Calendar(ele, month, year) {
      this.current_date = new Date();
      this.ele = ele;
      this.setDate(month, year);
      this.day_labels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      this.month_labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  };
  Calendar.prototype.setDate = function(month, year) {
      if (month > 11) {
          month -= 12;
          year += 1;
      } else if (month < 0) {
          month += 12;
          year -= 1;
      }
      this.month = (isNaN(month) || month == null) ? this.current_date.getMonth() : month;
      this.year  = (isNaN(year) || year == null) ? this.current_date.getFullYear() : year;
  };
  Calendar.prototype.draw = function (self, data) {
      document.getElementById(this.ele).innerHTML = (data) ? this.getHTML() : this.getHTML(data); 
      prev = document.getElementById('prev');
      prev.onclick = function(){
         self.setDate(self.month-1, self.year);
         self.draw(self);
      };
      next = document.getElementById('next')
      next.onclick = function(){
         self.setDate(self.month+1, self.year);
         self.draw(self);
      };
  };
  Calendar.prototype.getHTML = function(data){
      var startingDay = new Date(this.year, this.month, 1).getDay();
      var endingDate = new Date(this.year, this.month + 1, 0);
      var monthLength = endingDate.getDate();
      var inLastRow = 6 - endingDate.getDay();
  
      // generate header
      var html = '<table class="calendar"><tr>';
      html += '<th class="btn" id="prev">&laquo;</th>'
      html += '<th colspan="5">' + this.month_labels[this.month] + "&nbsp;" + this.year + '</th>';
      html += '<th class="btn" id="next">&raquo;</th>'
      html += '</tr><tr class="header">';
      for (var i = 0; i <= 6; i++ )
          html += '<td title="' + this.day_labels[i] + '">' + this.day_labels[i].charAt() + '</td>';
      html += '</tr><tr>';
  
      // generate calendar
      if ( startingDay ) html += '<td colspan="' + startingDay + '"></td>';
      for (var day = 1; day <= monthLength; day++) {
          html += '<td><div>' + day + '</div>';
          if (data) {
            html += data[(this.month+1)+'/'+day+'/'+this.year];
          }
          html += '</td>';
          if ( (day + startingDay) % 7 == 0 && day != monthLength ) html += '</tr><tr>';
      }
      if ( inLastRow ) html += '<td colspan="' + inLastRow + '"></td>';
      return html + '</tr></table>';
  };
  div = document.createElement('div')
  div.id = 'calendar';
  document.body.appendChild(div); 
  calendar = new Calendar('calendar');
  calendar.draw(calendar);
})();
