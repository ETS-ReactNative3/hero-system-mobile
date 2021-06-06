import CharacterTrait from '../CharacterTrait';
import {SKILL_CHECK} from '../../lib/DieRoller';
import {heroDesignerCharacter} from '../../lib/HeroDesignerCharacter';

export default class EnhancedPerception extends CharacterTrait {
    constructor(characterTrait) {
        super(characterTrait.trait, characterTrait.listKey, characterTrait.getCharacter);

        this.characterTrait = characterTrait;
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
        let attributes = this.characterTrait.attributes();

        attributes.push({
            label: 'PER Bonus',
            value: `+${this.characterTrait.trait.levels}`,
        });

        return attributes;
    }

    definition() {
        return this.characterTrait.definition();
    }

    roll() {
        let characteristics = this.characterTrait.getCharacter().characteristics;
        let base = 0;

        for (let characteristic of characteristics) {
            if (characteristic.shortName === 'INT') {
                let totalRoll = heroDesignerCharacter.getRollTotal(characteristic, this.characterTrait.getCharacter());

                base += parseInt(totalRoll.substring(0, totalRoll.length - 1), 10);

                break;
            }
        }

        return {
            roll: `${base + this.characterTrait.trait.levels}-`,
            type: SKILL_CHECK,
        };
    }

    advantages() {
        return this.characterTrait.advantages();
    }

    limitations() {
        return this.characterTrait.limitations();
    }
}
