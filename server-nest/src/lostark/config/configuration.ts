export default () => ({
	server: {
		name: process.env.ENV_NAME,
		port: parseInt(process.env.PORT, 10) || 3000,
	},
	database: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
	}
});