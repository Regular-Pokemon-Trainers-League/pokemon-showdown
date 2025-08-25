import RandomGen7Teams from '../gen7/teams';

const Tapus = ['tapukoko', 'tapulele', 'tapubulu', 'tapufini'] as const;
const Tapu_Colors = {
    tapukoko: 'Yellow',
    tapulele: 'Pink',
    tapubulu: 'Red',
    tapufini: 'Purple'
} as const;

export class RandomMonocolorTeams extends RandomGen7Teams {
    override getTeam(options?: PlayerOptions): PokemonSet[] {
        const tapuId = this.sample(Tapus);
        const tapuSpecies = this.dex.species.get(tapuId);
        const tapuColor = Tapu_Colors[tapuId];

        const originalSets = this.randomSets;
        const colorPool: string[] = [];

        // Build the color pool from all legal species
        for (const id in originalSets) {
            const species = this.dex.species.get(id);
            if (
                species.gen <= 7 &&
                species.color === tapuColor &&
                !species.battleOnly &&
                !species.isNonstandard &&
                originalSets[id]?.sets?.length
            ) {
                colorPool.push(id);
            }
        }

        // Sample 5 others that aren't the Tapu
        const poolA = colorPool.filter(id => id !== tapuId);
        const others: string[] = [];
        while (others.length < 5 && poolA.length > 0) {
            const choice = this.sampleNoReplace(poolA);
            others.push(choice);
        }

        const finalPool = [tapuId, ...others];
        this.randomSets = {};
        for (const id of finalPool) {
            this.randomSets[id] = originalSets[id];
        }

        // Manually assemble team so Tapu gets priority Z-Move role
        const team: PokemonSet[] = [];
        const teamDetails: RandomTeamsTypes.TeamDetails = {};

        const tapuSet = this.randomSet(tapuSpecies, teamDetails, true) as PokemonSet;
        team.push(tapuSet);
        teamDetails.zMove = 1;

        for (let i = 1; i < finalPool.length; i++) {
            const species = this.dex.species.get(finalPool[i]);
            team.push(this.randomSet(species, teamDetails) as PokemonSet);
        }

        this.randomSets = originalSets;
        this.prng.shuffle(team);
        return team;
    }
}

export default RandomMonocolorTeams;
