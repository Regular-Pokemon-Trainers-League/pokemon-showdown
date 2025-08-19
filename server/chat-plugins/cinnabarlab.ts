import {FS} from '../../lib';

const EMOTES_FILE = 'config/chat-plugins/emotes.json';

function loadEmotes(): {[name: string]: string} {
	try {
		return JSON.parse(FS(EMOTES_FILE).readSync());
	} catch (e: any) {
		if (e.code !== 'ENOENT') throw e;
		return {};
	}
}
const emotes = loadEmotes();
function saveEmotes() {
	FS(EMOTES_FILE).safeWriteSync(JSON.stringify(emotes));
}

const SIZE = 32;

export function parseEmotes(str: string) {
	const regex = /:(.+?):/g;
	if (!regex.test(str)) return '';
	return str.replace(/:(.+?):/g, (match, name) => {
		if (!emotes[name]) return match;
		else return `<img src="${emotes[name]}" width="${SIZE}" height="${SIZE}" alt="${name}" title=":${name}:">`;
	});
}

export const commands: Chat.ChatCommands = {
	cinnabar: 'cinnabarlab',
	cinnabarlab: {
		'': 'view',
		view() {
			this.parse(`/join cinnabarlab`);
		},
		help() {
			this.parse(`/help cinnabarlab`);
		},
	},

	cinnabarlabhelp: [
		`/cinnabarlab - Enters the lab room.`,
		`/cinnabarlab help - Displays this help command.`,
	],
};
export const pages: Chat.PageTable = {
	cinnabarlab(query, user) {
		this.title = 'Cinnabar Lab';

		let buf = `<div class="pad"><button style="float:right" class="button" name="send" value="/j cinnabarlab"><i class="fa fa-refresh"></i> Refresh</button><h2>Emotes</h2><hr />`;

		if (user.can('lock')) {
			buf += `<h3>Add an emote</h3>`;
			buf += `<form data-submitsend="/emotes add {name}, {url}">`;
			buf += `<h4>Name</h4><input type="text" name="name"></input><br />`;
			buf += `<h4>URL</h4><input type="text" name="url"></input><br />`;
			buf += `<button class="button" style="margin: 5px" type="submit">Add new emote</button></form>`;
			buf += `<hr />`;
		}

		buf += `<div class="ladder pad"><table><tr><th>Image</th><th>Name</th>`;
		if (user.can('lock')) buf += `<th>Manage</th>`;
		buf += `</tr>`;
		for (const name in emotes) {
			const url = emotes[name];
			buf += `<tr>`;
			buf += `<td><img src="${url}" width="${SIZE}" height="${SIZE}" alt="${name}" title=":${name}:"></td>`;
			buf += `<td>:${name}:</td>`;
			if (user.can('lock')) buf += `<td><button class="button" name="send" value="/emotes delete ${name}">Delete</button></td>`;
			buf += `</tr>`;
		}
		buf += `</table></div>`;

		return buf;
	},
};

export const roomSettings: Chat.SettingsHandler = room => ({
	label: "Emotes",
	permission: 'editroom',
	options: [
		[`disabled`, room.settings.emotesDisabled || 'emotes disable'],
		[`enabled`, !room.settings.emotesDisabled || 'emotes enable'],
	],
});