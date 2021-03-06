import React from 'react';
import PropTypes from 'prop-types';


const Avatar = (props) => {
	const classList = ['avatar'];
	props.isActive && classList.push('avatar--active');
	props.isRequested && classList.push('avatar--requesting');

	const handleOnClick = (props.handleOnClick)
		? () => props.handleOnClick(props.id)
		: f => f;

	return <button className={classList.join(' ')} onClick={() => handleOnClick()}>
					 <img src={props.src} alt='avatar' />
				 </button>
}

Avatar.propTypes = {
	src: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	handleOnClick: PropTypes.func,
	isActive: PropTypes.bool,
	isRequested: PropTypes.bool
}


export default Avatar;