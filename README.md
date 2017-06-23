# Pair Programming

I'm a creating pair programming app for school because screen sharing isn't pair programming, it's show and tell.

Work in progress.

## Need to add:

- Create useable text editor. ✅
- Set up WebSocket server. ✅
- Connect to WebSocket server from the application. ✅
- Timer to reset after updating stops for set period of time. ✅

  - Allow other user to update text. ✅
  - While unallowed to update, text highlighting prevented. ✅
  - User shown appropriate message when they can and can't edit code. ✅

- Set up database to track changes. ⏯

  - Read & pushes entire document to the Digital Ocean/MongoDB database. ✅
  - Needs to recall entire documents by URL

- Keep session open for specified amount of time.
- Scope session to unique key from URL.
- Generate unique URL and store in database.

## Beyond MVP:
- Make it attractive
- Add shared text highlighting
- Add voice communications
- Add custom session URLs
- Add language specific highlighting (prismjs.com)
