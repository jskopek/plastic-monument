Plastic Monument
----------------




Interactive Light Server
========================

The plastic monument can communicate with the lighting system to highlight the current year.

To make this work, set up an Arduino with firmata firmware ([guide](http://jeanmarc.skopek.ca/posts/programming/2019/11/09/controlling-leds-in-your-program.html)), plug a Neopixel LED strip into the arduino, and hook it up to your computer.

Now just run `node interactive-light-server.js`. You should have a very simple server running on port 3000 and listening for light commands. The plastic monument code will send requests to it when the active pillar is changed.

