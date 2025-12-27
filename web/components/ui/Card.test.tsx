import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card><div>Content</div></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Res Title">Content</Card>);
    expect(screen.getByText('Res Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
