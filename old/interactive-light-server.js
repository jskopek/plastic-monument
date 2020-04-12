var pixel = require("node-pixel");
var five = require("johnny-five");


// set up strip
var board = new five.Board();
var strip = null;

board.on("ready", function() {
  // Define our hardware.
  // It's a 12px ring connected to pin 6.
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 60}, ],
    gamma: 2.8,
  });

  // Just like DOM-ready for web developers.
  strip.on("ready", function() {
      console.log('strip ready!')
  });
});
// end setup strip




// start server
const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/
app.use(cors())

app.get('/leds/:led', function (req, res) {
    let ledIndex = parseInt(req.params.led)

    strip.color("#000"); // blanks it out
    strip.pixel(ledIndex).color('#ff0000')
    strip.show()
    res.send(`activating light ${req.params.led}`)
})

app.listen(3000, function(){
  console.log("Listening on port 3000!")
});
// end server
