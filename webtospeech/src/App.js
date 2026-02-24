import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/*<p>
            Edit <code>src/App.js</code> and save to reload.
          </p>*/}
          <p>Hello World! From CSCI 4805, Brady Byrd, John Hurley, Chandler Boone, and Danny Lee</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
