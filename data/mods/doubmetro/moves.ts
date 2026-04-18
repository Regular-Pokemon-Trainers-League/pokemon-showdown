export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	afteryou: {
		inherit: true,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
	},
	bestow: {
		inherit: true,
		flags: { mirror: 1, bypasssub: 1, allyanim: 1, noassist: 1, failcopycat: 1, metronome: 1 },
	},
	craftyshield: {
		inherit: true,
		flags: { metronome: 1 },
	},
	kingsshield: {
		inherit: true,
		flags: { noassist: 1, failcopycat: 1, failinstruct: 1, metronome: 1 },
	},
	powershift: {
		inherit: true,
		flags: { snatch: 1, metronome: 1 },
	},
	ragingbull: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
	},
	relicsong: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
	},
	technoblast: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1 },
	},
	metronome: {
		inherit: true,
		num: 118,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Metronome",
		pp: 10,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(pokemon) {
			const moves = this.dex.moves.all().filter(move => (
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable' || move.isNonstandard === 'Past') &&
				move.flags['metronome']
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			this.actions.useMove(randomMove, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
};