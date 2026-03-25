"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  calculatorTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CalculatorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Calculator error:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="surface p-6 md:p-8">
          <p className="section-label">Calculator error</p>
          <p className="mt-3 text-sm leading-7">
            {this.props.calculatorTitle
              ? `The ${this.props.calculatorTitle} ran into an issue and could not load.`
              : "This calculator ran into an issue and could not load."}
          </p>
          <button
            onClick={this.handleReset}
            className="button-base mt-4 border border-border hover:bg-surface-hover text-sm"
          >
            Reset calculator
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
