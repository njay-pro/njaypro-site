import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ArchetypePage, ARCHETYPES_DATA, ACCURATE_INSTALL_PROMPT } from '../pages/ArchetypePage';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock ThreeSculpture and P5Field to avoid WebGL / canvas context issues in jsdom
vi.mock('../components/ThreeSculpture', () => ({
  ThreeSculpture: () => <div data-testid="three-sculpture-mock" />,
}));
vi.mock('../components/P5Field', () => ({
  P5Field: () => <div data-testid="p5-field-mock" />,
}));

describe('ArchetypePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ArchetypePage />
      </BrowserRouter>
    );
  };

  it('renders product hero headline and subhead', () => {
    renderComponent();
    expect(screen.getByText('ONE SUBAGENT IS NOT A SYSTEM.')).toBeInTheDocument();
    expect(screen.getByText('Give the task the kind of mind it needs.')).toBeInTheDocument();
  });

  it('renders correct GitHub repository link', () => {
    renderComponent();
    const githubLink = screen.getByRole('link', { name: /view on github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/njay-pro/hermes-archetype-subagent');
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

  it('supports keyboard navigation (ArrowRight / ArrowLeft / Enter / Space) across tabs and moves DOM focus', () => {
    renderComponent();
    const defaultTab = screen.getByRole('tab', { name: /long-horizon/i });
    defaultTab.focus();

    // Press ArrowRight to select high-hallucination
    fireEvent.keyDown(defaultTab, { key: 'ArrowRight' });
    const targetTab = screen.getByRole('tab', { name: /high-hallucination/i });
    expect(targetTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(targetTab);

    // Press ArrowLeft to go back to long-horizon
    fireEvent.keyDown(targetTab, { key: 'ArrowLeft' });
    expect(defaultTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(defaultTab);
  });

  it('copies archetype Python invocation code to clipboard when copy button is clicked', async () => {
    renderComponent();
    const copyConfigBtn = screen.getByRole('button', { name: /copy archetype invocation code/i });
    fireEvent.click(copyConfigBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(ARCHETYPES_DATA[1].codeExample);
    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument();
    });
  });

  it('copies accurate Hermes install prompt to clipboard when copy agent prompt button is clicked', async () => {
    renderComponent();
    const copyCommandBtn = screen.getByRole('button', { name: /copy hermes agent installation prompt/i });
    fireEvent.click(copyCommandBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(ACCURATE_INSTALL_PROMPT);
    await waitFor(() => {
      expect(screen.getByText('✓ Prompt Copied')).toBeInTheDocument();
    });
  });
});
