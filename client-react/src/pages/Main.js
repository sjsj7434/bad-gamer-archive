const Main = () => {
	async function call(){
		// const test: HTMLDialogElement = document.querySelector("#dialog")!; //the value is never null by adding the [!] operator

		const result = await fetch("http://localhost:3000/api/users/");
		console.log(result);
		const jsonResult = await result.json();

		alert(jsonResult.message);
	}

	return(
		<>
			<h2>Here is Main</h2>

			<button onClick={() => { call() }}>Call API</button>
		</>
	);
}

export default Main;