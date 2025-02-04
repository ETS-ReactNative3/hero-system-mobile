import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView} from 'react-native';
import {Button, Text} from 'native-base';
import Modal from 'react-native-modal';
import {verticalScale} from 'react-native-size-matters';
import styles from '../../Styles';

export default class ConfirmationDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        onOk: PropTypes.func,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            scrollOffset: 0,
        };
    }

    _handleOnScroll = (event) => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y,
        });
    };

    _handleScrollTo = (p) => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };

    _renderOkButton() {
        if (typeof this.props.onOk === 'function') {
            return (
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={() => this.props.onOk()}>
                        <Text uppercase={false} style={styles.buttonText}>
                            OK
                        </Text>
                    </Button>
                </View>
            );
        }

        return null;
    }

    render() {
        return (
            <Modal
                isVisible={this.props.visible}
                onBackButtonPress={() => this.props.onClose()}
                onBackdropPress={() => this.props.onClose()}
                scrollTo={this._handleScrollTo}
                scrollOffsetMax={300 - 200}
            >
                <View style={styles.modal}>
                    <Text style={styles.modalHeader}>{this.props.title}</Text>
                    <View style={[styles.modalContent, {minHeight: verticalScale(170)}]}>
                        <ScrollView ref={(ref) => (this.scrollViewRef = ref)} onScroll={this._handleOnScroll} scrollEventThrottle={16}>
                            <Text style={styles.grey}>{this.props.info}</Text>
                        </ScrollView>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                            {this._renderOkButton()}
                            <View style={styles.buttonContainer}>
                                <Button style={styles.button} onPress={() => this.props.onClose()}>
                                    <Text uppercase={false} style={styles.buttonText}>
                                        {this.props.onOk === null ? 'OK' : 'Cancel'}
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
