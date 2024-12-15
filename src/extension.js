const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const foldStart = '<!-- #region drawinline -->'
const foldEnd = '<!-- #endregion -->'

function getRandomString() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
const getNonce = getRandomString;
const generateSVGName = getRandomString;

function foldingMod() {
  return vscode.workspace.getConfiguration('draw-inline')['auto-folding']
}

function loadWebviewFiles(root) {
  let main = fs.readFileSync(path.join(root, 'board', 'index.html'), { encoding: 'utf8' })
  main = main.replace(/<[^\n]*"\.\/assets\/[^\n]*>/g, s => {
    let m = /"\.\/assets\/(.*?\.)(.*?)"/.exec(s)
    let content = fs.readFileSync(path.join(root, 'board', 'assets', m[1] + m[2]), { encoding: 'utf8' })
    switch (m[2]) {
      case 'css':
        return '<style>\n' + content + '\n</style>'
      case 'js':
        return '<script type="module" crossorigin nonce="ToBeReplacedByRandomToken">\n' + content + '\n</script>'
      default:
        return s
    }
  })
  main = main.replace(/ToBeReplacedByRandomToken/g, getNonce())
  return main
}
const webviewContent = loadWebviewFiles(path.join(__dirname, '..'));

/** @param {vscode.ExtensionContext} context */
function activate(context) {

  // values for webview status
  /** @type {vscode.WebviewPanel | undefined} */
  let currentPanel = undefined;

  // values for editing status
  /** @type {vscode.TextEditor | undefined} */
  let currentEditor = undefined;
  let currentLine = 0;
  let currentInFolding = false;
  let currentText = "";
  let updateHandle = undefined;

  function createNewPanel() {
    // Create and show panel
    currentPanel = vscode.window.createWebviewPanel(
      'drawInline',
      'Draw Inline',
      vscode.ViewColumn.Two,
      {
        // Enable scripts in the webview
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'board'))]
      }
    );

    currentPanel.webview.html = getWebviewContent(currentPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'board/cdn'))));
    // Handle messages from the webview
    currentPanel.webview.onDidReceiveMessage(
      message => {

        switch (message.command) {
          case 'requestCurrentLine':
            pushCurrentLine()
            return;
          case 'requestCustom':
            pushCustom()
            return;
          case 'editCurrentLine':
            setEditorText(message.text, message.control, message.file);
            return;
          case 'readSVGFile':
            currentPanel.webview.postMessage({ command: 'readSVGFile', content: readFile(message.file) });
            return;
        }
      },
      undefined,
      context.subscriptions
    );

    realTimeCurrentEditorUpdate()

    currentPanel.onDidDispose(
      () => {
        if (updateHandle != undefined) {
          clearInterval(updateHandle)
          updateHandle = undefined
        }
        currentPanel = undefined;
      },
      undefined,
      context.subscriptions
    );
  }

  function showPanel() {
    currentPanel.reveal();
  }

  function getEditorText(show) {
    let currentEditor_ = currentEditor
    let currentLine_ = currentLine
    let activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
      currentEditor_ = activeTextEditor;
    }
    if (!currentEditor_ || currentEditor_.document.isClosed) {
      if (show) vscode.window.showErrorMessage('No active line');
      return {};
    }
    currentLine_ = currentEditor_.selection.active.line

    let text = currentEditor_.document.getText(new vscode.Range(currentLine_, 0, currentLine_ + 1, 0))
    currentInFolding = false
    if (text.startsWith(foldStart)){
      currentLine_ += 1
      currentInFolding = true
      text = currentEditor_.document.getText(new vscode.Range(currentLine_, 0, currentLine_ + 1, 0))
    }
    if (text.startsWith(foldEnd)){
      currentLine_ -= 1
      currentInFolding = true
      text = currentEditor_.document.getText(new vscode.Range(currentLine_, 0, currentLine_ + 1, 0))
    }
    currentText = text
    return { text, currentEditor_, currentLine_ }
  }

  function pushCurrentLine() {
    let { text, currentEditor_, currentLine_ } = getEditorText(true)
    if (typeof text === 'string' && currentPanel) {
      currentEditor = currentEditor_
      currentLine = currentLine_
      currentPanel.webview.postMessage({ command: 'currentLine', content: text });
    }
  }

  let updateCheckStrings = ['', '']
  function resetCheckStrings(str) {
    updateCheckStrings[0] = updateCheckStrings[1] = str
  }
  function realTimeCurrentEditorUpdate() {
    updateHandle = setInterval(() => {
      let { text, currentEditor_, currentLine_ } = getEditorText(false)
      if (typeof text === 'string' && currentPanel) {
        let topush = false
        if (updateCheckStrings[0] !== updateCheckStrings[1] && text === updateCheckStrings[0]) {
          topush = true
        }
        updateCheckStrings[1] = updateCheckStrings[0]
        updateCheckStrings[0] = text
        currentEditor = currentEditor_
        currentLine = currentLine_
        if (topush) {
          currentPanel.webview.postMessage({ command: 'currentLine', content: text });
        }
      }
    }, 100)
  }

  // write text to filename
  function writeFile(text, filename) {
    let settings = vscode.workspace.getConfiguration('draw-inline');
    let dir = path.join(vscode.workspace.rootPath, settings.directory);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(path.join(dir, filename), text, { encoding: 'utf8' });
  }

  // return contents of filename
  function readFile(filename) {
    return fs.readFileSync(path.join(vscode.workspace.rootPath, filename), { encoding: 'utf8' });
  }

  function setEditorText(text, control, file) {
    let settings = vscode.workspace.getConfiguration('draw-inline');
    if (file) {
      let filename = `${generateSVGName()}.svg`
      let alt = "";

      // reuse existing alt and filename, if available
      if (match = currentText.match(/!\[(.*)\]\((.*\.svg)\)/)) {
        alt = match[1]
        filename = match[2].replace(/^.*[\\\/]/, '')
      }

      writeFile(text, filename)
      text = `![${alt}](${settings.directory}/${filename})`
      if (settings.directory=='') {
        text = `![${alt}](${filename})`
      }
    } else if (currentInFolding == false && foldingMod()) {
      text = foldStart +'\n'+ text +'\n'+ foldEnd
      currentInFolding = true
    }

    if (!currentEditor || currentEditor.document.isClosed) {
      vscode.window.showErrorMessage('The text editor has been closed');
      return;
    }
    let p = vscode.window.showTextDocument(currentEditor.document, {
      viewColumn: currentEditor.viewColumn,
      selection: new vscode.Range(currentLine, 0, currentLine, 0)
    })
      .then((editor) => editor.edit(edit => {
        let lf = '\n'
        edit.replace(new vscode.Range(currentLine, 0, currentLine + 1, 0), text + lf);
        resetCheckStrings(text.split('\n')[0] + '\n')
      }))
    if (control !== 0) {
      p = p
        .then(() => vscode.window.showTextDocument(currentEditor.document, {
          viewColumn: currentEditor.viewColumn,
          selection: new vscode.Range(currentLine + control, 0, currentLine + control, 0)
        })) // the next line somehow not working, so use this line
        // .then(() => currentEditor.revealRange(
        //   new vscode.Range(currentLine + control, 0, currentLine + control, 0)
        // )) 
        .then(() => {
          pushCurrentLine()
        })
    }
    if(foldingMod())p=p.then(()=>vscode.commands.executeCommand('editor.foldAllMarkerRegions'))
  }

  function pushCustom() {
    currentPanel.webview.postMessage({ command: 'custom', content: { operate: [] } });
  }


  context.subscriptions.push(
    vscode.commands.registerCommand('drawInline.editCurrentLineAsSVG', () => {
      if (currentPanel) {
        showPanel()
        pushCurrentLine()
        if(foldingMod())vscode.commands.executeCommand('editor.foldAllMarkerRegions')
      } else {
        // vscode.commands.executeCommand('workbench.action.editorLayoutTwoRowsRight')
        //   .then(() => {
            createNewPanel()
            pushCurrentLine()
            if(foldingMod())vscode.commands.executeCommand('editor.foldAllMarkerRegions')
          // })
      }
    })
  );

}
exports.activate = activate;

function getWebviewContent(cdnpath) {
  return webviewContent.replace('./cdn',cdnpath)
}