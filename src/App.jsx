import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link
import Calculator from './component/Calculator/Calculator.jsx';
import Note from './component/Note/Note.jsx';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calculator">Calculator</Link>
            </li>
            <li>
              <Link to="/note">Note</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/note" element={<Note />} />
          <Route path="/" element={<h1>Home</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
