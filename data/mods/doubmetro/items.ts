export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	watmelberry: {
		name: "Watmel Berry",
		megaStone: { "Rayquaza": "Rayquaza-Mega" },
		itemUser: ["Rayquaza"],
		onTakeItem(item, source) {
			return !item.megaStone?.[source.baseSpecies.baseSpecies];
		},
		gen: 9,
		spritenum: 530,
		num: 181,
	},
};