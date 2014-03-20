var king = {name: 'Elvis', score: 9};

var highScores = [
  {
    name: "Ace",
    score: 4000
  },
  {
    name: "Barney",
    score: 2306
  },
  {
    name: "Riley",
    score: 1001
  },
  {
    name: 'Elvis', score: 9
  },
  {
    name: "Todd",
    score: 1
  }
];

var officialScoreKeeper = setInterval(function() {
  highScores[getTableIndex(king.name)].score++;
}, 1000);

function getTableIndex(name) {
  var i = highScores.length, isPresent = false;
  while(i--) {
    if (highScores[i].name === name) {
      isPresent = true;
      break;
    }
  }
  return isPresent ? i : -1;
}

module.exports = {
  getHighScores: function() {
    return highScores.slice(0, 10);
  },
  getKing: function() {
    return king;
  },
  setKing: function(name) {
    var tableIndex = getTableIndex(name);
    if (tableIndex === -1 ) {
      tableIndex = highScores.push({
        name: name,
        score: 0
      }) - 1;
    }
    console.log(tableIndex);
    return king = highScores[tableIndex];
  }
};

/*
var request = new XMLHttpRequest();
    request.open('POST', this.props.url, true);
    request.setRequestHeader('Content-Type', 'json');
    request.send(name);
    */

/*

  loadScoresFromServer: function() {
    var component = this;

    request = new XMLHttpRequest();
    request.open('GET', this.props.url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
        component.setState({
          scores: JSON.parse(request.responseText)
        });
      } else {
        // We reached our target server, but it returned an error
        console.error(component.props.url, status, err.toString());
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      console.error(component.props.url, status, err.toString());
    };

    request.send();
  },

  */