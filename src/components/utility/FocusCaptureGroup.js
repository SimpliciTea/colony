import React from 'react';
import PropTypes from 'prop-types';


class FocusCaptureGroup extends React.Component {
	static propTypes = {
		handleOnBlur: PropTypes.func.isRequired
	}

	timeoutId;

	constructor() {
		super()

		this.state = {
			isCapturingFocus: false,
			activeElement: this.container
		}

		this.handleOnBlur = this.handleOnBlur.bind(this);
		this.handleOnFocus = this.handleOnFocus.bind(this);
		this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
	}

	handleOnBlur() {
		this.timeoutId = setTimeout(() => {
			if (this.state.isCapturingFocus && document.activeElement !== this.state.activeElement) {
				this.setState({
					isCapturingFocus: false
				}, this.props.handleOnBlur);
			}
		}, 0);
	}

	handleOnFocus() {
		clearTimeout(this.timeoutId);

		if (!this.state.isCapturingFocus) {
			this.setState({
				isCapturingFocus: true,
				activeElement: document.activeElement
			});
		}
	}

	handleOnKeyUp(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			document.activeElement.blur();
		}
	}

	render() {
		return (
			<div className='capture-group' 
					 onBlur={this.handleOnBlur}
					 ref={(div) => { this.container = div; }}
			 		 onFocus={this.handleOnFocus}
			 		 onKeyUp={this.handleOnKeyUp}>
			 	{this.props.children}
			</div>
		)
	}
}



export default FocusCaptureGroup;