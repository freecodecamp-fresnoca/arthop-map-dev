function LeaderboardController() {
  var ctrl = this;

  /*
    TODO:
    Sort from highest to lowest
  */

   this.userslist = [{
        "displayName" : "Moist FlipFlop",
        "score" : 2
    },
    {
        "displayName" : "Not Cheating",
        "score" : 4
    },
    {
        "displayName" : "Greatest Ever",
        "score" : 5
    },
    {
        "displayName" : "Steve Jobs",
        "score" : 10
    },
    {
        "displayName" : "Steve Wozniak",
        "score" : 12
    },
    {
        "displayName" : "John Ives",
        "score" : 11
    },
    {
          "displayName" : "Independant Port",
          "score" : 18
    },
    {
          "displayName" : "Lukewarm Lasagna",
          "score" : 22
    }
  ];

}

angular.module('arthopMapApp').controller('LeaderboardController', LeaderboardController);
