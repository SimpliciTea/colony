import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import FocusCaptureGroup from '../FocusCaptureGroup';

const setup = propOverrides => {
	const props = Object.assign({
		handleOnBlur: jest.fn(),
	}, propOverrides);

	document.activeElement.blur();

	const wrapper = mount(
		<div className="parent" tabIndex="0">
			<FocusCaptureGroup {...props}>
				<button className="child"></button>
				<div className="child2" tabIndex="0"></div>
			</FocusCaptureGroup>
		</div>
	);

	return {
		props,
		wrapper,
		self: wrapper.find(FocusCaptureGroup),
		child: wrapper.find('.child'),
		child2: wrapper.find('.child2')
	}
}

it('renders without crashing', () => {
	const { self } = setup();
	expect(self).toBeTruthy();
})

describe('Class methods', () => {
	describe('handleOnBlur', () => {
		let spy;

		beforeEach(() => {
			spy = jest.spyOn(FocusCaptureGroup.prototype, 'handleOnBlur');
		});

		afterEach(() => {
			spy.mockClear();
			document.body.focus();
		})

		it('is called when self blurs', () => {
			let { self } = setup();

			self.simulate('focus');
			self.simulate('blur');

			expect(spy).toHaveBeenCalled();
		})

		it('is called when a child component blurs', () => {
			let { child } = setup();

			child.simulate('focus');
			child.simulate('blur');

			expect(spy).toHaveBeenCalled();
		})

		describe('when not capturing focus', () => {
			it('does not change state', () => {
				let { self } = setup();
				let initialState = self.instance().state;

				self.simulate('blur');

				expect(spy).toHaveBeenCalled();
				expect(self.instance().state).toEqual(initialState);
			})

			it('does not call passed handleOnBlur prop', () => {
				let { self, props } = setup();

				self.simulate('blur');

				expect(spy).toHaveBeenCalled();
				expect(props.handleOnBlur).not.toHaveBeenCalled();
			})			
		})

		describe('when capturing focus', () => {
			let mock;

			beforeEach(() => {
				mock = setup();
				let { child, self } = mock;

				child.instance().focus();
				child.simulate('focus');

				expect(self.instance().state.activeElement).toEqual(document.activeElement);
			})

			describe('when focus changes to another descendent', () => {
				it('does not call passed handleOnBlur prop', () => {
					let { child, child2, props } = mock;

					// sets document.activeElement
					child2.instance().focus();

					// invokes events with bubbling in jsDDOM
					child.simulate('blur');
					child2.simulate('focus');

					expect(spy).toHaveBeenCalled();
					expect(props.handleOnBlur).not.toHaveBeenCalled();
				})
			})

			describe('when focus changes to a non-descendent', () => {
				it('calls passed handleOnBlur prop', () => {
					jest.useFakeTimers();
					let { wrapper, self, child, props } = mock;

					// sets document.activeElement
					// to an element outside component tree
					wrapper.instance().focus();
					child.simulate('blur');

					expect(spy).toHaveBeenCalled();
					expect(props.handleOnBlur).not.toHaveBeenCalled();

					jest.runAllTimers();

					expect(props.handleOnBlur).toHaveBeenCalled();
				})
			})
		})
	})


	describe('handleOnFocus', () => {
		let spy;

		beforeEach(() => {
			spy = jest.spyOn(FocusCaptureGroup.prototype, 'handleOnFocus');
		})

		afterEach(() => {
			spy.mockClear();
		})

		it('is called when self is focused', () => {
			let { self } = setup();

			self.simulate('focus');

			expect(spy).toHaveBeenCalled();
		})

		it('is called when a child component is focused', () => {
			let { child } = setup();

			child.simulate('focus');

			expect(spy).toHaveBeenCalled();
		})

		it('is not called when a parent component is focused', () => {
			let { wrapper } = setup();

			wrapper.simulate('focus');
			expect(spy).not.toHaveBeenCalled();
		})

		it('sets state to { activeElement: document.activeElement, isManagingFocus: true }', () => {
			spy.mockClear();
			let { self, child } = setup();

			let expectedState = {
				isCapturingFocus: false,
				activeElement: undefined
			}
			expect(self.instance().state).toEqual(expectedState);
			
			// does not bubble through jsdom
			// but does set document.activeElement
			child.instance().focus();

			// does bubble through jsdom
			child.simulate('focus');

			expectedState = {
				isCapturingFocus: true,
				activeElement: document.activeElement
			}
			expect(self.instance().state).toEqual(expectedState);
		})
	})

	describe('handleOnKeyUp', () => {
		let spy;

		beforeEach(() => {
			spy = jest.spyOn(FocusCaptureGroup.prototype, 'handleOnKeyUp');
		})

		afterEach(() => {
			spy.mockClear();
		})

		it('is called by keyup in self', () => {
			let { self } = setup();

			self.simulate('keyup');

			expect(spy).toHaveBeenCalled();
		})

		it('is called by keypress in child', () => {
			let { child } = setup();

			child.simulate('keyup');
			expect(spy).toHaveBeenCalled();
		})

		it('is not called by keypress in non-self/child', () => {
			let { wrapper } = setup();

			wrapper.simulate('keyup');
			expect(spy).not.toHaveBeenCalled();
		})

		it('blurs document.activeElement if key === "Escape"', () => {
			let { self, child } = setup();
			
			child.instance().focus();
			expect(child.instance()).toEqual(document.activeElement);

			self.simulate('keyup', { key: 'Escape' });
			expect(child.instance()).not.toEqual(document.activeElement);
		})

		it('does not blur document.activeElement if key !== "Escape"', () => {
			let { self, child } = setup();

			child.instance().focus();
			expect(child.instance()).toEqual(document.activeElement);

			self.simulate('keyup', { key: 'Enter' });
			expect(child.instance()).toEqual(document.activeElement);			
		})
	})
})