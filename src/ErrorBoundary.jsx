import { Link } from "@tanstack/react-router";
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Uh oh!</h2>
          <p>
            There was an error loading this page. <Link to="/">Click here</Link>{" "}
            to go back to the home page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
