import React, { useState, useEffect } from 'react';

const isElectron = window && window.process && window.process.type;
let ipcRenderer;

if (isElectron) {
  ipcRenderer = window.require('electron').ipcRenderer;
}

const Note = () => {
  const [noteContent, setNoteContent] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSavedNotes = async () => {
      try {
        if (ipcRenderer) {
          ipcRenderer.send('get-saved-notes');

          ipcRenderer.once('receive-saved-notes', (event, notes) => {
            setSavedNotes(notes);
          });

          ipcRenderer.once('error-receive-saved-notes', (event, err) => {
            setError(err);
          });
        }
      } catch (err) {
        setError(err);
      }
    };

    getSavedNotes();

    // Cleanup event listeners when the component is unmounted
    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('receive-saved-notes');
        ipcRenderer.removeAllListeners('error-receive-saved-notes');
      }
    };
  }, []); // Empty dependency array to run the effect only once

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleSaveNote = () => {
    try {
      if (ipcRenderer && noteContent.trim() !== '') {
        ipcRenderer.send('save-note', noteContent);
        setNoteContent('');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h2>Notes</h2>
      <textarea
        rows="4"
        cols="50"
        value={noteContent}
        onChange={handleNoteChange}
        placeholder="Write your note here..."
      />
      <br />
      <button onClick={handleSaveNote}>Save Note</button>

      {error && <div>Error: {error.message}</div>}

      <div>
        <h3>Saved Notes</h3>
        <ul>
          {savedNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Note;
