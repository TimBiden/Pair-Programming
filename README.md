# Pair Programming #

I'm a creating pair programming app for school because screen sharing isn't pair programming, it's show and tell.

Work in progress.

## Need to add: ##
- Create useable text editor. ✅
- Set up WebSocket server. ✅
- Connect to WebSocket server from the application. ✅
- Set up database to track changes
  - Reading & writing entire documents
  - Split by line in database
  - Updated line gets sent to local collection of lines before gets to database.
  - Timer to reset after updating stops so other user can update text
- Scope session to unique key from URL.
- Generate unique URL and store in database.
