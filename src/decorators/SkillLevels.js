import CharacterTrait from './CharacterTrait';

// Copyright 2018-Present Philip J. Guinchard
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export default class SkillLevels extends CharacterTrait {
    constructor(characterTrait) {
        super(characterTrait.trait, characterTrait.listKey, characterTrait.getCharacter);

        this.characterTrait = characterTrait;
    }

    cost() {
        let levelCost = 0;
        let levelValue = 0;

        for (let option of this.characterTrait.trait.template.option) {
            if (option.xmlid.toUpperCase() === this.characterTrait.trait.optionid.toUpperCase()) {
                levelCost = option.lvlcost;
                levelValue = option.lvlval;
                break;
            }
        }

        return this.characterTrait.trait.levels / levelValue * levelCost;
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
        return `+${this.characterTrait.trait.levels} ${this.characterTrait.trait.optionAlias}`;
    }

    attributes() {
        let attributes = this.characterTrait.attributes();

        attributes.push({
            label: `+${this.characterTrait.trait.levels} ${this.characterTrait.label()}`,
            value: '',
        });

        return attributes;
    }

    definition() {
        return this.characterTrait.definition();
    }

    roll() {
        return this.characterTrait.roll();
    }

    advantages() {
        return this.characterTrait.advantages();
    }

    limitations() {
        return this.characterTrait.limitations();
    }
}
