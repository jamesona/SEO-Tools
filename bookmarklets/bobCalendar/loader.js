
(function(){
  var url = 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.js';
  document.head.appendChild(document.createElement('script')).src=url;
})();
(function(){
  var url = 'https://rawgit.com/jamesona/SEO-Tools/Book-Of-Business/bookmarklets/bobCalendar/app.js';
  document.head.appendChild(document.createElement('script')).src=url;
})();

(function() {
  var calendar = angular.module('calendar', ['ngRoute']);
  
  var html = document.getElementsByTagName('html')[0]; html.setAttribute('ng-app', 'calendar');
  
  body.innerHTML += "<p>{{'this is a '+'string'}}</p>";

})();
