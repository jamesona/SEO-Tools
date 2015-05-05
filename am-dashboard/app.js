  (function(){
    /*
    Loader and dependency config
    */
    var basePath = 'https://rawgit.com/jamesona/SEO-Tools/master/am-dashboard/',
    includes = [ //scripts to load, relative to base path
      'lib/sorttable.js',
      'app/dashboard.js',
      'app/tools.js',
      'app/tickets.js'
    ],
    dependencies = [ //namespace dependencies (check that scripts and Launchpad are loaded)
      'Dashboard',
      'Tools',
      'Tickets',
      'bootbox',
      'ko',
    ];
    /*
    Methods
    */
    function loadScripts(){
      for (var i=0;i<includes.length;i++){
        var url = basePath + includes[i];
        document.head.appendChild(document.createElement('script')).src = url;
      }
    }
    function depends(deps){
      for (var i=0;i<deps.length;i++){
        if (eval('typeof(' + dependencies[i] + ')') !== 'undefined') continue;
        else return false;
      }
      return true;
    }
    function initialize(){
      if (depends(dependencies)){
          db = new Dashboard();
          console.log('AM Dashboard loaded');
      } else {
          setTimeout(function(){initialize()}, 100);
      }
    }
    /*
    Init
    */
    loadScripts();
    initialize();
  })();
