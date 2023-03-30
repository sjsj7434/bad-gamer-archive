import Table from 'react-bootstrap/Table';

const MainTable = (props) => {
	const tableRows = props.guilds.map((guild) => {
		return(
			<tr key={guild.GuildName}>
				<td>{guild.Rank}</td>
				<td>{guild.GuildName}</td>
				<td>{guild.MasterName}</td>
				<td>{guild.GuildMessage}</td>
			</tr>
		);
	});

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>Rank</th>
					<th>GuildName</th>
					<th>MasterName</th>
					<th>GuildMessage</th>
				</tr>
			</thead>
			<tbody>
				{tableRows}
			</tbody>
		</Table>
	);
}

export default MainTable;