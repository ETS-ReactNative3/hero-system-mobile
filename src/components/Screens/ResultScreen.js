import React, { Component }  from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import RNShakeEvent from 'react-native-shake-event';
import Header from '../Header/Header';
import { dieRoller, SKILL_CHECK, TO_HIT, NORMAL_DAMAGE, KILLING_DAMAGE } from '../../lib/DieRoller';
import { statistics } from '../../lib/Statistics';
import styles from '../../Styles';

export default class ResultScreen extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			result: props.navigation.state.params
		}

		statistics.add(this.state.result);

		this.reRoll = this._reRoll.bind(this);
	}

	componentDidMount() {
        RNShakeEvent.addEventListener('shake', () => {
            this.reRoll();
        });
	}

   	componentWillUnmount() {
   		RNShakeEvent.removeEventListener('shake');
   	}

	_reRoll() {
		this.setState({
			result: dieRoller.rollAgain(this.props.navigation.state.params)
		}, () => {
		    statistics.add(this.state.result);
		});
	}
	
	_renderToHitInfo() {
		if (this.state.result.total === 3) {
			return <Text style={styles.grey}>You have critically hit your target</Text>;
		} else if (this.state.result.total === 18) {
			return <Text style={styles.grey}>You have missed your target</Text>;
		}

		if (this.state.result.isAutofire) {
		    if (this.state.result.hits > 0) {
		        return <Text style={styles.grey}>You can hit your target up to {this.state.result.hits}x</Text>
		    } else {
		        return <Text style={styles.grey}>You have missed your target with all of your shots</Text>
		    }
		}

		return <Text style={styles.grey}>You can hit a DCV/DMCV of {this.state.result.hitCv} or less</Text>
	}
	
	_renderHitLocation() {
		let hitLocation = this.state.result.hitLocationDetails;
		
		if (this.state.result.rollType === NORMAL_DAMAGE) {
			return (
				<Text style={styles.grey}>
					{hitLocation.location} (NSTUN: x{hitLocation.nStun})
				</Text>
			);
		} else if (this.state.result.rollType === KILLING_DAMAGE) {
			return (
				<Text style={styles.grey}>
					{hitLocation.location} (STUNx: x{hitLocation.stunX}, BODYx: x{hitLocation.bodyX})
				</Text>
			);
		}
		
		return <Text />;
	}
	
	_renderDamageInfo() {
//	    if (this.state.result.damageForm.isExplosion) {
//	        return (
//	            <View style={{paddingBottom: 20}}>
//	                {this.state.result.explosion.map((entry, index) => {
//	                    return <Text>{JSON.stringify(entry)}</Text>;
//	                })}
//	            </View>
//	        );
//	    }

		return (
			<View style={{paddingBottom: 20}}>
				<View style={localStyles.lineContainer}>
					<Text style={[styles.boldGrey, localStyles.alignStart]}>Hit Location: </Text>
					{this._renderHitLocation()}
				</View>
				<View style={localStyles.lineContainer}>
					<Text style={[styles.boldGrey, localStyles.alignStart]}>Stun: </Text>
					{this._renderStun()}
				</View>	
				<View style={localStyles.lineContainer}>
					<Text style={[styles.boldGrey, localStyles.alignStart]}>Body: </Text>
					<Text style={styles.grey}>{this.state.result.body}</Text>
				</View>
				<View style={localStyles.lineContainer}>
					<Text style={[styles.boldGrey, localStyles.alignStart]}>Knockback: </Text>
					{this._renderKnockback()}
				</View>
			</View>
		);
	}

	_renderSkillCheckInfo() {
	    let overUnder = this.state.result.threshold - this.state.result.total;

	    if (overUnder >= 0) {
	        if (overUnder === 0) {
                return (
                    <Text style={styles.grey}>You made your check with no points to spare</Text>
                );
	        }

            return (
                <Text style={styles.grey}>You made your check by {overUnder} points</Text>
            );
	    }

        return (
            <Text style={styles.grey}>You <Text style={{color: 'red'}}>failed</Text> your check by {overUnder * -1} points</Text>
        );
	}

	_renderAdditionalRollInfo() {
		if (this.state.result.rollType === TO_HIT) {
			return this._renderToHitInfo();
		} else if (this.state.result.rollType === NORMAL_DAMAGE || this.state.result.rollType === KILLING_DAMAGE) {
			return this._renderDamageInfo();
		} else if (this.state.result.rollType === SKILL_CHECK && this.state.result.threshold !== -1) {
		    return this._renderSkillCheckInfo();
		}
		
		return null;
	}
	
	_renderStun() {
		let stun = this.state.result.stun < 0 ? 0 : this.state.result.stun;
		
		return <Text style={styles.grey}>{stun}</Text>;
	}
	
	_renderKnockback() {
		let knockback = this.state.result.knockback < 0 ? 0 : this.state.result.knockback;
		let knockbackText = '';

		if (this.state.result.damageForm.useFifthEdition) {
		    knockbackText = knockback / 2 + '"';
		} else {
		    knockbackText = knockback + 'm';
		}

		return <Text style={styles.grey}>{knockbackText}</Text>;
	}
	
	render() {	
		return (
			<Container style={styles.container}>
				<Header navigation={this.props.navigation} />
				<Content style={styles.content}>
				    <Text style={styles.heading}>Roll Result</Text>
					<View>
						<Text style={[styles.grey, localStyles.rollResult]}>{this.state.result.total}</Text>
                        <Text style={styles.grey}>
                            <Text style={styles.boldGrey}>Dice Rolled: </Text>{this.state.result.rolls.length} ({this.state.result.rolls.join(', ')})
                        </Text>
						{this._renderAdditionalRollInfo()}
						<View style={styles.buttonContainer}>
			    			<Button block style={styles.button} onPress={this.reRoll}>
			    				<Text uppercase={false}>Roll Again</Text>
			    			</Button>
			    		</View>
			      	</View>
			    </Content>
		    </Container>
		);
	}
}

const localStyles = StyleSheet.create({
	rollResult: {
		fontSize: 75
	},
	lineContainer: {
	    flexDirection: 'row',
	    alignItems: 'center'
	},
	alignStart: {
		alignSelf: 'flex-start'
	}
});