import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExtractorPanel from '../components/ExtractorPanel';

describe('ExtractorPanel', () => {
  const defaultProps = {
    status: 'active',
    progress: { current: 0, total: 0 },
    onStart: vi.fn(),
    onStop: vi.fn()
  };

  it('renders with default limit of 100', () => {
    render(<ExtractorPanel {...defaultProps} />);
    const input = screen.getByLabelText(/POSTS/i);
    expect(input).toHaveValue(100);
  });

  it('calls onStart with limit when start button clicked', () => {
    const onStart = vi.fn();
    render(<ExtractorPanel {...defaultProps} onStart={onStart} />);

    const input = screen.getByLabelText(/POSTS/i);
    fireEvent.change(input, { target: { value: '50' } });

    const startButton = screen.getByText('EXTRACT');
    fireEvent.click(startButton);

    expect(onStart).toHaveBeenCalledWith(50);
  });

  it('shows stop button when extracting', () => {
    render(<ExtractorPanel {...defaultProps} status="extracting" />);
    expect(screen.getByText('STOP')).toBeInTheDocument();
    expect(screen.queryByText('EXTRACT')).not.toBeInTheDocument();
  });

  it('shows progress when extracting', () => {
    const progress = { current: 25, total: 100 };
    render(<ExtractorPanel {...defaultProps} status="extracting" progress={progress} />);
    expect(screen.getByText('25 / 100')).toBeInTheDocument();
  });

  it('disables input when extracting', () => {
    render(<ExtractorPanel {...defaultProps} status="extracting" />);
    const input = screen.getByLabelText(/POSTS/i);
    expect(input).toBeDisabled();
  });

  it('disables start button when status is inactive', () => {
    render(<ExtractorPanel {...defaultProps} status="inactive" />);
    const startButton = screen.getByText('EXTRACT');
    expect(startButton).toBeDisabled();
  });

  it('validates limit range (1-1000)', () => {
    render(<ExtractorPanel {...defaultProps} />);
    const input = screen.getByLabelText(/POSTS/i);

    fireEvent.change(input, { target: { value: '150' } });
    expect(input).toHaveValue(150);

    fireEvent.change(input, { target: { value: '1500' } });
    expect(input).toHaveValue(150);

    fireEvent.change(input, { target: { value: '0' } });
    expect(input).toHaveValue(150);
  });
});
