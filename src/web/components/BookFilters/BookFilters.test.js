import React from 'react';
import Enzyme, { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-15';
import BookFilters from './BookFilters';

Enzyme.configure({ adapter: new Adapter() });

describe('<BookFilters />', () => {
  // Snapshot testing
  test('Snapshot sould be correct', () => {
    const component = renderer.create(
      <BookFilters />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Gender Change should invoke filter change action and request new books', () => {
    const propsMock = {
      filterChange: jest.fn(),
      bookRequest: jest.fn(),
    };
    const component = mount(<BookFilters {...propsMock} />);
    component.instance().handleGenderChange();

    expect(propsMock.filterChange.mock.calls.length).toBe(1);
    expect(propsMock.bookRequest.mock.calls.length).toBe(1);
  });

  test('Genre Change should invoke filter change action and request new books', () => {
    const propsMock = {
      filterChange: jest.fn(),
      bookRequest: jest.fn(),
    };
    const component = mount(<BookFilters {...propsMock} />);
    component.instance().handleGenreChange({
      target: {
        value: 'mock',
      },
    });

    expect(propsMock.filterChange.mock.calls.length).toBe(1);
    expect(propsMock.bookRequest.mock.calls.length).toBe(1);
  });

  test('Order Change should invoke order change action and request new books', () => {
    const propsMock = {
      orderChange: jest.fn(),
      bookRequest: jest.fn(),
    };
    const component = mount(<BookFilters {...propsMock} />);
    component.instance().handleOrderChange();
    expect(propsMock.orderChange.mock.calls.length).toBe(1);
    expect(propsMock.bookRequest.mock.calls.length).toBe(1);
  });

  test('Sort Change should invoke sort change action and request new books', () => {
    const propsMock = {
      sortChange: jest.fn(),
      bookRequest: jest.fn(),
    };
    const component = mount(<BookFilters {...propsMock} />);
    component.instance().handleSortChange();
    expect(propsMock.sortChange.mock.calls.length).toBe(1);
    expect(propsMock.bookRequest.mock.calls.length).toBe(1);
  });
});
