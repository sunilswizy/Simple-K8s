import logo from './logo.svg';
import './App.css';
import { Link, Outlet } from "react-router-dom";


function App() {
  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div className='link-con'>
          <Link
            className="App-link"
            to="/fib"
          >
            Fib Calculator
          </Link>
          <Link
            className="App-link"
            to="/other"
          >
            About
          </Link>
        </div>
       <Outlet />
      </header>
    </div>
  );
}

export default App;
