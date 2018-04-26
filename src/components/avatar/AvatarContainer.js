import React from 'react';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import PickerContainer from './PickerContainer';


class AvatarContainer extends React.Component {
	static propTypes = {
		avatars: PropTypes.arrayOf(PropTypes.object)
	}

	constructor(props) {
		super(props);

		const normalized = props.avatars.reduce((avatars, curr) => {
			return {
				...avatars,
				[curr.id]: {
					id: curr.id,
					label: curr.label,
					src: curr.src
				}
			};
		}, {});

		this.state = {
			avatars: normalized,
			activeAvatarId: 1,
			hasOpenPicker: false,
			pickerWillClose: false,
			isRequestingAvatarChange: false,
			requestedAvatarId: null
		}
	}


	handleTogglePickerContainer = () => {
		if (this.state.pickerWillClose || this.state.isRequestingAvatarChange) return;

		if (this.state.hasOpenPicker) {
			this.scheduleClosePickerContainer();
		} else {
			this.openPickerContainer();
		}
	}

	openPickerContainer = () => {
		this.setState({
			hasOpenPicker: true
		})
	}

	closePickerContainer = () => {
		this.setState({
			pickerWillClose: false,
			hasOpenPicker: false
		})
	}

	scheduleClosePickerContainer = () => {
		this.setState({
			pickerWillClose: true
		})
	}


	handleSelectActiveAvatar = async (id) => {
		if (this.state.isRequestingAvatarChange) {
			return;
		}

		if (id === this.state.activeAvatarId) {
			this.scheduleClosePickerContainer();
			return;
		}

		let res = await this.requestAvatarChange(id);

		res.success && this.setState({
			activeAvatarId: id,
			isRequestingAvatarChange: false,
			requestedAvatarId: null
		}, this.handleTogglePickerContainer);

		!res.success && this.setState({
			isRequestingAvatarChange: false,
			requestedAvatarId: null
		});
	}


	requestAvatarChange = (id) => {
		this.setState({
			isRequestingAvatarChange: true,
			requestedAvatarId: id
		});

		return new Promise(resolve => {
			setTimeout(() => {
				resolve({ success: true });
			}, 1000)
		});
	}


	render = () =>
		<div className="avatar-container">
			<Avatar {...this.state.avatars[this.state.activeAvatarId]} 
							handleOnClick={this.handleTogglePickerContainer} />
			
			{this.state.hasOpenPicker &&
				<PickerContainer pickerWillClose={this.state.pickerWillClose}
												 avatars={this.state.avatars} 
												 activeAvatarId={this.state.activeAvatarId}
												 handleSelectActiveAvatar={this.handleSelectActiveAvatar}
												 scheduleCloseSelf={this.scheduleClosePickerContainer}
												 closeSelf={this.closePickerContainer}
												 requestedAvatarId={this.state.isRequestingAvatarChange ? this.state.requestedAvatarId : undefined} />
			}
		</div>
}


export default AvatarContainer;