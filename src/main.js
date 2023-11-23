const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();

  let savedNotes = loadSavedNotes();

  mainWindow.webContents.send('receive-saved-notes', savedNotes);

  ipcMain.on('save-note', (event, note) => {
    savedNotes.push(note);
    saveNotesToFile(savedNotes);
    event.sender.send('receive-saved-notes', savedNotes); // Send updated notes back to the renderer process
  });

  ipcMain.on('get-saved-notes', (event) => {
    event.reply('receive-saved-notes', savedNotes);
  });

  // Cleanup when the window is closed
  mainWindow.on('closed', () => {
    saveNotesToFile(savedNotes);
    app.quit();
  });
};

const loadSavedNotes = () => {
  try {
    const data = fs.readFileSync(path.join(app.getPath('userData'), 'notes.json'), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveNotesToFile = (notes) => {
  fs.writeFileSync(path.join(app.getPath('userData'), 'notes.json'), JSON.stringify(notes));
};

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Additional main process code goes here.
