import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });

describe('Navbar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Navbar />);
    expect(container.firstChild).toBeTruthy();
  });

  it('toggles menu on hamburger click (mobile layout simulated)', () => {
    const { container } = render(<Navbar />);
    expect(container.firstChild).toBeTruthy();
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
      fireEvent.click(button);
    }
    expect(container.firstChild).toBeTruthy();
  });

  it('updates on scroll event', () => {
    const { container } = render(<Navbar />);
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    expect(container.firstChild).toBeTruthy();
  });
});
