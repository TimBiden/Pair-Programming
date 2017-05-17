let editorInstance = new Editor({
  session: sessionID,
  codeBox: textareaToDB,
});

function onEditorSave(error, model) {
  if (error) {
    return console.error(error);
  }
  console.log(model);
}

editorInstance.save(onEditorSave);
