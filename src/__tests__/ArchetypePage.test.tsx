import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ArchetypePage, ARCHETYPES_DATA } from '../pages/ArchetypePage';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock ThreeSculpture to avoid WebGL context issues in jsdom
vi.mock('../components/ThreeSculpture', () => ({
  ThreeSculpture: () => <div data-testid="three-sculpture-mock" />,
}));

describe('ArchetypePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ArchetypePage />
      </BrowserRouter>
    );
  };

  it('renders product hero headline and subhead', () => {
    renderComponent();
    expect(screen.getByText('ONE SUBAGENT IS NOT A SYSTEM.')).toBeInTheDocument();
    expect(screen.getByText('Give the task the kind of mind it needs.')).toBeInTheDocument();
  });

  it('renders all 5 archetype tabs with correct labels', () => {
    renderComponent();
    ARCHETYPES_DATA.forEach((arch) => {
      expect(screen.getByRole('tab', { name: new RegExp(arch.id, 'i') })).toBeInTheDocument();
    });
  });

  it('updates selected archetype when a tab is clicked', () => {
    renderComponent();
    const consultantTab = screen.getByRole('tab', { name: /consultant/i });
    fireEvent.click(consultantTab);

    expect(consultantTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Resolve ambiguity').length).toBeGreaterThan(0);
    expect(screen.getByText('Raw nuance, architecture, intent distillation, near-completion synthesis.')).toBeInTheDocument();
  });

  it('supports keyboard navigation (ArrowRight / ArrowLeft / Enter / Space) across tabs', () => {
    renderComponent();
    const defaultTab = screen.getByRole('tab', { name: /long-horizon/i });
    defaultTab.focus();

    // Press ArrowRight to select high-hallucination
    fireEvent.keyDown(defaultTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /high-hallucination/i })).toHaveAttribute('aria-selected', 'true');

    // Press ArrowLeft to go back to long-horizon
    const currentTab = screen.getByRole('tab', { name: /high-hallucination/i });
    fireEvent.keyDown(currentTab, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: /long-horizon/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('copies archetype configuration code to clipboard when copy button is clicked', async () => {
    renderComponent();
    const copyConfigBtn = screen.getByRole('button', { name: /copy archetype configuration/i });
    fireEvent.click(copyConfigBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument();
    });
  });

  it('copies install command to clipboard when copy command button is clicked', async () => {
    renderComponent();
    const copyCommandBtn = screen.getByRole('button', { name: /copy installation command/i });
    fireEvent.click(copyCommandBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npx @hermes/cli@v1.0.0 add archetype-router');
    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument();
    });
  });
});
