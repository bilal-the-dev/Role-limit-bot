const {
	Client,
	Events,
	IntentsBitField: { Flags },
} = require("discord.js");
const dotenv = require("dotenv");
const notifyMessage = require("./notifyMessage");

dotenv.config({ path: ".env" });

const { TOKEN, ROLE_LIMIT, GUILD_ID, NOTIFY_CHANNEL_ID, ROLE_IDS } =
	process.env;

const client = new Client({
	intents: [
		Flags.Guilds,
		Flags.MessageContent,
		Flags.GuildMessages,
		Flags.GuildMembers,
	],
});

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	// Filling the cache with members
	const targetGuild = readyClient.guilds.cache.get(GUILD_ID);
	await targetGuild.members.fetch();
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
	try {
		console.log("listening to event");
		if (oldMember.roles.cache.size >= newMember.roles.cache.size) return;
		console.log("Role was added");

		const addedRole = newMember.roles.cache.find(
			(role) => !oldMember.roles.cache.has(role),
		);

		console.log(ROLE_IDS.split(","));
		console.log(addedRole.id);
		console.log(ROLE_IDS.split(",").includes(addedRole.id));
		if (!ROLE_IDS.split(",").includes(addedRole.id)) return;

		console.log("Target role found");

		if (addedRole.members.size <= ROLE_LIMIT) return;

		console.log("Limit hit");

		await newMember.roles.remove(addedRole);

		const notifyChannel = await newMember.guild.channels.fetch(
			NOTIFY_CHANNEL_ID,
		);

		await notifyMessage(addedRole, newMember, notifyChannel);
	} catch (error) {
		console.log(error);
	}
});

client.login(TOKEN);
