
(function(window) {
  var menu = [
    {
      title: 'ES5',
      url: 'apps/es5/index.html'
    },
    {
      title: 'ES6',
      url: 'apps/es6/index.html'
    },
    {
      title: 'jQuery',
      url: 'apps/jquery/index.html',
      badge: 'ES5'
    },
    {
      title: 'Backbone',
      url: 'apps/backbone/index.html',
      badge: 'ES5'
    },
    {
      title: 'Angular',
      url: 'apps/angular/index.html',
      badge: 'ES5'
    },
    {
      title: 'Angular 2',
      url: 'apps/angular2/dist/index.html',
      badge: 'TypeScript'
    }
  ];

  function App(event) {
    var $menu = $('#menu');
    var $frame = $('#frame');

    menu.forEach(function(menuItem, index) {
      var $item = $('<li/>');
      var $itemLink = $('<a/>');
      var title = menuItem.title;

      if (menuItem.badge) {
        title += '<span class="badge">' + menuItem.badge + '</span>';
      }

      $itemLink.attr('href', menuItem.url);
      $itemLink.html(title);
      $itemLink.click(function(event) {
        event.preventDefault();
        $frame.attr('src', menuItem.url);
        $menu.children('li').removeClass('active');
        $item.addClass('active');
      });

      $item.append($itemLink);
      $menu.append($item);
    });

    $menu.children('li:first-child')
      .find('a')
      .click();
  }

  window.onload = App;
})(window)
