const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendSaveNote: (note) => {
    ipcRenderer.send('save-note', note);
  },

  getSavedNotes: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('receive-saved-notes', (event, notes) => {
        resolve(notes);
      });

      ipcRenderer.once('error-receive-saved-notes', (event, error) => {
        reject(error);
      });

      ipcRenderer.send('get-saved-notes');
    });
  },
});
