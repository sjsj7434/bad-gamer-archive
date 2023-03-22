import React, {useState} from 'react';
import logo from './images/loading.gif';
import './App.css';

async function call(): Promise<void> {

  const test: HTMLDialogElement = document.querySelector("#dialog")!; //the value is never null by adding the [!] operator
  test.showModal();

  const result = await fetch("http://localhost:3000/users/");
  console.log(result)
  const jsonResult = await result.json();

  alert(jsonResult.message);
}

const App = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="App">
      <dialog id="dialog">dialog</dialog>

      <header className="App-header">
        <img src={logo} width={200} height={200} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <input type="text" id="sendVal" defaultValue={""} />
        <button onClick={() => call()}>call api</button>

        <div>
          <div>value : {value}</div>
          <button onClick={() => setValue(value + 1)}>+</button>
          <button onClick={() => setValue(value - 1)}>-</button>
        </div>
      </header>
    </div>
  );
}

export default App;
