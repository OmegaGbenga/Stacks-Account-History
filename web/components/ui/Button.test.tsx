import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
