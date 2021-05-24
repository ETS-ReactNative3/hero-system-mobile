import CharacterTrait from '../CharacterTrait';
import { common } from '../../lib/Common';

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

export default class LightningReflexes extends CharacterTrait {
    constructor(characterTrait) {
        super(characterTrait.trait, characterTrait.listKey, characterTrait.getCharacter);

        this.characterTrait = characterTrait;
    }

    cost() {
        let cost = 0;
        let option = null;

        for (let o of this.characterTrait.trait.template.option) {
            if (o.xmlid.toUpperCase() === this.characterTrait.trait.option.toUpperCase()) {
                option = o;
                break;
            }
        }

        if (this.characterTrait.trait.option.toUpperCase() === 'ALL') {
            cost += this.characterTrait.trait.levels * option.lvlcost;
        } else {
            cost += common.getMultiplierCost(
                this.characterTrait.trait.levels,
                option.lvlval,
                option.lvlcost
            );
        }

        return cost < 1 ? 1 : cost;
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
            label: `+${this.characterTrait.trait.levels} DEX to act first`,
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
