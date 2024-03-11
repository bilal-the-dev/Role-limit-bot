module.exports = async function (role, member, channel) {
	const content = `Oh sorry ${member}, ${role.name} is full!`;

	await channel.send(content);
};
