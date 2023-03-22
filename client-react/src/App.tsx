import logo from './logo.svg';
import './App.css';

async function call(): Promise<void>{
	const result = await fetch("http://localhost:3000/users/");
	const jsonResult = await result.json();

	alert(jsonResult.message);
}

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
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
					REACT_APP_HOST : {process.env.REACT_APP_HOST}
					<br />
					REACT_APP_PASSWORD : {process.env.REACT_APP_PASSWORD}
				</div>
			</header>
		</div>
	);
}

export default App;
