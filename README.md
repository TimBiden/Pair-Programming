# Pair Programming

I created a pair programming app for school because screen sharing isn't pair programming, it's show and tell.
It's still missing a few things I think are necessary for it to be a working app, but for the school project, and the time being, it's completed.

A few things it still needs to be truly usable:
- Voice communications
- Notification of what line is being edited by other person
- Text highlighting
- Language specific highlighting

## MVP Implementation:

- Create useable text editor. ✅
- Create NodeJS web server. ✅
- Set up WebSocket server. ✅
  - WebSockets route data to correct session, not general broadcast. ✅

- Timer to reset after updating stops for set period of time. ✅
  - Allow other user to update text. ✅
  - While not allowed to update, text highlighting prevented. ✅
  - User shown appropriate message when they can and can't edit code. ✅

- Set up database to track changes. ✅
  - Read & pushes entire document to the Digital Ocean/MongoDB database. ✅
  - Needs to recall entire documents by URL. ✅

- Scope session to unique key from URL. ✅
- Generate unique URL and store in database. ✅
- Redirect root directory visitors to their specific URL. ✅

## Beyond MVP:

- Change textarea to contenteditable div
- Make it attractive
- Add shared text highlighting
- Add voice communications
- Add language specific highlighting
- Keep session open for specified amount of time
