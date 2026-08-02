import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BuilderPage } from '../pages/BuilderPage';
import { describe, it, expect, vi } from 'vitest';

// Mock canvas components
vi.mock('../components/ThreeSculpture', () => ({
  ThreeSculpture: () => <div data-testid="three-sculpture-mock" />,
}));
vi.mock('../components/P5Field', () => ({
  P5Field: () => <div data-testid="p5-field-mock" />,
}));
vi.mock('../components/SignalRail', () => ({
  SignalRail: () => <div data-testid="signal-rail-mock" />,
}));

describe('BuilderPage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BuilderPage />
      </BrowserRouter>
    );
  };

  it('renders hero title and subhead', () => {
    renderComponent();
    expect(screen.getByText('I WAS TRAINED')).toBeInTheDocument();
    expect(screen.getByText('BY STEEL.')).toBeInTheDocument();
    expect(screen.getByText('THEN SYSTEMS.')).toBeInTheDocument();
    expect(screen.getByText('NOW INTELLIGENCE.')).toBeInTheDocument();
    expect(
      screen.getByText('I design the thing, shape the story, and build the system that makes it move.')
    ).toBeInTheDocument();
  });

  it('renders identity spatial spine with 4 nodes', () => {
    renderComponent();
    expect(screen.getByText('01 / FABRICATION')).toBeInTheDocument();
    expect(screen.getByText('02 / VISUAL SYSTEMS')).toBeInTheDocument();
    expect(screen.getByText('03 / PROCEDURAL WORLDS')).toBeInTheDocument();
    expect(screen.getByText('04 / AGENT SYSTEMS')).toBeInTheDocument();
  });

  it('renders manifesto statement', () => {
    renderComponent();
    expect(
      screen.getByText(
        'Industrialization split the person who imagines it, the person who makes it beautiful, and the person who builds it.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('I never fit that split.')).toBeInTheDocument();
    expect(screen.getByText('Call me a builder.')).toBeInTheDocument();
  });

  it('renders AI thesis statement', () => {
    renderComponent();
    expect(screen.getByText('AI IS NOT MY NEW DISCIPLINE.')).toBeInTheDocument();
    expect(
      screen.getByText('IT IS THE ENGINEERING LAYER COMING BACK TO DESIGN.')
    ).toBeInTheDocument();
  });

  it('renders output node product link to archetype and correct GitHub URL', () => {
    renderComponent();
    expect(screen.getByText('Hermes Archetype Router')).toBeInTheDocument();
    expect(screen.getByText('Follow the signal')).toBeInTheDocument();

    const githubLink = screen.getByRole('link', { name: /view on github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/njay-pro/hermes-archetype-subagent');
  });
});
