import CharacterTrait from './CharacterTrait';

export default class EffectRoll extends CharacterTrait {
    constructor(characterTrait, rollType) {
        super(characterTrait.trait, characterTrait.listKey, characterTrait.getCharacter);

        this.characterTrait = characterTrait;
        this.rollType = rollType;
    }

    cost() {
        return this.characterTrait.cost();
    }

    costMultiplier() {
        return this.characterTrait.costMultiplier();
    }

    activeCost() {
        return this.characterTrait.activeCost();
    }

    realCost() {
        return this.characterTrait.realCost();
    }

    label() {
        return this.characterTrait.label();
    }

    attributes() {
        return this.characterTrait.attributes();
    }

    definition() {
        return this.characterTrait.definition();
    }

    roll() {
        const baseDice = this.characterTrait.trait.levels;
        const partialDie = this._getPartialDie(this.characterTrait.trait.adder);
        let roll = `${baseDice}d6`;

        if (partialDie === '½') {
            roll = `${baseDice}${partialDie}d6`;
        } else if (partialDie === '1') {
            roll = `${baseDice}d6+${partialDie}`;
        } else if (partialDie === '-1') {
            roll = `${baseDice + 1}d6${partialDie}`;
        }

        return {
            roll: roll,
            type: this.rollType,
        };
    }

    advantages() {
        return this.characterTrait.advantages();
    }

    limitations() {
        return this.characterTrait.limitations();
    }

    _getPartialDie(adder) {
        let partialDie = null;

        if (adder === undefined || adder === null) {
            return partialDie;
        }

        if (Array.isArray(adder)) {
            for (let a of adder) {
                partialDie = this._getPartialDie(a);

                if (partialDie !== null) {
                    break;
                }
            }
        } else {
            if (adder.xmlid === 'PLUSONEHALFDIE') {
                partialDie = '½';
            } else if (adder.xmlid.toUpperCase() === 'PLUSONEPIP') {
                partialDie = '1';
            } else if (adder.xmlid.toUpperCase() === 'MINUSONEPIP') {
                partialDie = '-1';
            }
        }

        return partialDie;
    }
}
