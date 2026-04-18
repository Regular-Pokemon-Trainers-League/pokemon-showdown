export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	watmelberry: {
		name: "Watmel Berry",
		megaStone: "Rayquaza-Mega",
		megaEvolves: "Rayquaza",
		itemUser: ["Rayquaza"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		gen: 9,
		spritenum: 530,
		num: 181,
	},
};