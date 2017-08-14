After finishing my previous project ahead of schedule, I was ahead of pace in my Front End JavaScript course so I decided to do what Bloc refers to as a Capstone Project. This is a project of the student's choosing that will show off their skills as a developer.

Not knowing how hard it would be but seeing how it would benefit students in an online learning situation, I chose to create an app to allow both student and and teacher to code together. At http://www.pairprogrammingapp.com/ they can do exactly that.

The app, when I wrote this blog post, utilizes <a target="_blank" href="https://nodejs.org/en/">NodeJS</a> as the server. My mentor wanted me to avoid using Express so that I could learn more about how a server works.

The appearance was created using <a target="_blank" href="http://getbootstrap.com/">Bootstrap</a> with a <a target="_blank" href="https://bootswatch.com/">Bootswatch</a> theme. Bootstrap and the theme did most of the heavy lifting but to make it look closer to the way I wanted it, I had to modify the theme's CSS file a bit. It also utilizes a generic CSS file I created to format the text editor.

The WebSocket connection necessary to make it a viable pair programming app uses <a target="_blank" href="https://github.com/websockets/ws">WS</a>. It creates and verifies the connection so data can be sent almost instantaneously when someone types in the box without needing to create a new connection or send a new header with every edit.

Because the MEAN stack is relatively popular right now, I chose to go with <a target="_blank" href="https://www.mongodb.com/">MongoDB</a> as the database, and <a target="_blank" href="http://mongoosejs.com/">MongooseJS</a> to interface with MongoDB.
