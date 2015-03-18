var body = document.getElementsByTagName('body')[0]; body.setAttribute('ng-app', 'calendar');
(function(){
  var url = 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js';
  document.body.appendChild(document.createElement('script')).src=url;
})();
(function(){
  var url = 'https://rawgit.com/jamesona/SEO-Tools/Book-Of-Business/bookmarklets/bobCalendar/app.js';
  document.body.appendChild(document.createElement('script')).src=url;
})();
body.innerHTML += "<p>{{'this is a '+'string'}}</p>";
