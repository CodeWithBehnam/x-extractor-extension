import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusIndicator from '../components/StatusIndicator';

describe('StatusIndicator', () => {
  it('renders inactive status', () => {
    render(<StatusIndicator status="inactive" />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders active status', () => {
    render(<StatusIndicator status="active" />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders extracting status with spinner', () => {
    const { container } = render(<StatusIndicator status="extracting" />);
    expect(screen.getByText('Extracting...')).toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders complete status', () => {
    render(<StatusIndicator status="complete" />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('renders error status', () => {
    render(<StatusIndicator status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies correct CSS class based on status', () => {
    const { container, rerender } = render(<StatusIndicator status="active" />);
    expect(container.querySelector('.status-badge.active')).toBeInTheDocument();
    
    rerender(<StatusIndicator status="error" />);
    expect(container.querySelector('.status-badge.error')).toBeInTheDocument();
  });
});
