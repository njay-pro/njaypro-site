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

describe('ArchetypePage — story spine', () => {
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

  it('renders the moment hero (one real failure mode, not a slogan)', () => {
    renderComponent();
    expect(
      screen.getByText(/You watched one AI answer ten different questions with the same voice\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/We did too\. That is why we built five minds instead\./i)).toBeInTheDocument();
  });

  it('renders the five story beats in order', () => {
    renderComponent();
    expect(screen.getByText(/01 · THE GAP/i)).toBeInTheDocument();
    expect(screen.getByText(/02 · THE SYSTEM/i)).toBeInTheDocument();
    expect(screen.getByText(/03 · THE PROOF/i)).toBeInTheDocument();
    expect(screen.getByText(/04 · THE DOOR/i)).toBeInTheDocument();
    expect(screen.getByText(/FOR BUILDERS · OPTIONAL/i)).toBeInTheDocument();
  });

  it('renders the gap thesis sentence', () => {
    renderComponent();
    expect(screen.getByText(/Each failure is a missing kind of mind\./i)).toBeInTheDocument();
  });

  it('renders all 5 archetype tabs with correct ids', () => {
    renderComponent();
    ARCHETYPES_DATA.forEach((arch) => {
      expect(screen.getByRole('tab', { name: new RegExp(arch.id, 'i') })).toBeInTheDocument();
    });
  });

  it('renders the same-prompt proof beats (one per archetype)', () => {
    renderComponent();
    ARCHETYPES_DATA.forEach((arch) => {
      // Each proof card has an archetype label that matches the id
      expect(screen.getAllByText(arch.id).length).toBeGreaterThan(0);
    });
  });

  it('renders the install steps and the GitHub CTA into the repo', () => {
    renderComponent();
    expect(screen.getByText(/Clone the v1\.0\.0 tag/i)).toBeInTheDocument();
    expect(screen.getByText(/Open the repo · v1\.0\.0/i)).toBeInTheDocument();
  });

  it('links to the real GitHub repo on the door CTA', () => {
    renderComponent();
    const cta = screen.getByRole('link', { name: /open the repo · v1\.0\.0/i });
    expect(cta).toHaveAttribute('href', 'https://github.com/njay-pro/hermes-archetype-subagent');
  });

  it('links back to the identity graph from the footer', () => {
    renderComponent();
    expect(screen.getByRole('link', { name: /back to the identity graph/i })).toHaveAttribute('href', '/');
  });

  it('updates selected archetype when a tab is clicked', () => {
    renderComponent();
    const consultantTab = screen.getByRole('tab', { name: /consultant/i });
    fireEvent.click(consultantTab);
    expect(consultantTab).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation (ArrowRight / ArrowLeft) across tabs and moves DOM focus', () => {
    renderComponent();
    const defaultTab = screen.getByRole('tab', { name: /long-horizon/i });
    defaultTab.focus();

    fireEvent.keyDown(defaultTab, { key: 'ArrowRight' });
    const targetTab = screen.getByRole('tab', { name: /high-hallucination/i });
    expect(targetTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(targetTab);

    fireEvent.keyDown(targetTab, { key: 'ArrowLeft' });
    expect(defaultTab).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(defaultTab);
  });

  it('copies the install prompt to clipboard when the builders card copy button is clicked', async () => {
    renderComponent();
    const btn = screen.getByRole('button', { name: /copy installation prompt/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(ACCURATE_INSTALL_PROMPT);
    });
  });
});