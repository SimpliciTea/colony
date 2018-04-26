import React from 'react';
import PropTypes from 'prop-types';

import Avatar from './Avatar';

const styles = {
	scaling: {
		underscaled: {
			transition: 'transform 0.1s ease-in',
			transform: 'scale(0.1)'
		},
		overscaled: {
			transition: 'transform 0.15s ease-out',
			transform: 'scale(1.03)'
		},
		natural: {
			transition: 'transform 0.02s linear',
			transform: 'scale(1)'
		}
	}
}


class PickerContainer extends React.Component {
	static propTypes = {
		pickerWillClose: PropTypes.bool.isRequired,
		avatars: PropTypes.object.isRequired,
		activeAvatarId: PropTypes.number.isRequired,
		handleSelectActiveAvatar: PropTypes.func.isRequired,
		scheduleCloseSelf: PropTypes.func.isRequired,
		closeSelf: PropTypes.func.isRequired,
		requestedAvatarId: PropTypes.number
	}

	constructor() {
		super();

		this.state = {
			transitionState: 'underscaled'
		}
	}


	componentDidMount = () => {
		this.triggerTransitionTo('overscaled');
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.pickerWillClose) {
			this.triggerTransitionTo('underscaled');
		}
	}

	triggerTransitionTo = (transitionState) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.setState({
					transitionState
				});
			});
		});
	}

	handleOnTransitionEnd = () => {
		let { transitionState } = this.state;

		transitionState === 'overscaled' &&	this.triggerTransitionTo('natural');
		transitionState === 'underscaled' && this.props.closeSelf();
	}


	render = () => {
		return (
					<div className={'picker-container'} key={'picker'}
							 style={styles.scaling[this.state.transitionState]}
							 onTransitionEnd={this.handleOnTransitionEnd} >
						<h2 className="picker-container__header">Choose your avatar</h2>
						<ul className="picker-container__avatar-list">
							{Object.keys(this.props.avatars).map(id => {
								let avatar = this.props.avatars[id];
								let isActive = avatar.id === this.props.activeAvatarId;
								let isRequested = avatar.id === this.props.requestedAvatarId;
								
								return ( 
									<li key={avatar.id}>
										<Avatar {...avatar}
														handleOnClick={this.props.handleSelectActiveAvatar}
														isActive={isActive}
														isRequested={isRequested} />
										{isRequested && <div className="avatar-spinner"></div>}
									</li>
								)
							})}
						</ul>
					</div>

		)
	}
}


// class Animated extends React.Component {
// 	render() {
// 		return (
// 			<Transition 
// 				from={{ transform: 'scale(0.5)' }} 
// 				enter={{ transform: 'scale(1)' }}
// 				leave={{ transform: 'scale(0.5)' }}>
// 				{styles => <PickerContainer style={styles} {...this.props} /> }
// 			</Transition>
// 		)
// 	}
// }

// 	overbounce = async next => {
// 		await next(Transition, {
// 			from: { transform: 'scale(0.5)' },
// 			to: { transform: 'scale(1.5)' }
// 		});
// 
// 		await next(Spring, {
// 			from: { transform: 'scale(1.5)' },
// 			to: { transform: 'scale(1)' }
// 		})
// 	}

export default PickerContainer;