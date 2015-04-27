/**
Open multiple clients by pasting a list of LP account IDs.

*/

javascript:(function(){var clients = prompt("Enter list of clients (can paste from BoB)").split(/[\r\s]+/);for (var i=0;i<clients.length;i++) {window.open("https://launchpad.boostability.com/#/customerservice/customersearch/"+clients[i]);}})();
