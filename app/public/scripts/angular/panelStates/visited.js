function VisitedController($scope) {
  $.getScript("bower_components/progressbar.js/dist/progressbar.js").then(
    function(){
      var ctrl = this;

      let venues = $scope.$parent.venues
      let user = $scope.$parent.user

      // progress bar
      var bar = new ProgressBar.Circle(container, {
        color: '#aaa',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 14,
        trailWidth: 11,
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: 'rgb(238, 30, 123)', width: 11 },
        to: { color: 'rgb(238, 30, 123)', width: 14 },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);

          var value = Math.round(circle.value() * 100);
          if (value === 0) {
            circle.setText('%');
          } else {
            circle.setText(value + '%');
          }
        }
      });
      bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
      bar.text.style.fontSize = '2rem';
      let percentage = user.points / venues.length
      bar.animate(percentage);  // Number from 0.0 to 1.0
     // end of progress bar
    }

  );
}

angular.module('arthopMapApp').controller('VisitedController', VisitedController);
