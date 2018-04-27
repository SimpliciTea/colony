import React from 'react';


class FocusCaptureGroup extends React.Component {
	timeoutId;

	constructor() {
		super()

		this.state = {
			isCapturingFocus: false,
			activeElement: this.container
		}
	}

	handleOnBlur = (e) => {
		this.timeoutId = setTimeout(() => {
			if (this.state.isManagingFocus && document.activeElement !== this.state.activeElement) {
				this.setState({
					isManagingFocus: false
				}, this.props.handleOnBlur);
			}
		}, 0);
	}

	handleOnFocus = () => {
		clearTimeout(this.timeoutId);

		if (!this.state.isManagingFocus) {
			this.setState({
				isManagingFocus: true,
				activeElement: document.activeElement
			});
		}
	}

	render() {
		return (
			<div className='capture-group' 
					 onBlur={this.handleOnBlur}
					 ref={(div) => { this.container = div; }}
			 		 onFocus={this.handleOnFocus}>
			 	{this.props.children}
			</div>
		)
	}
}



export default FocusCaptureGroup;