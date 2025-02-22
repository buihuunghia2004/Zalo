// import React from 'react';

// const ErrorBoundary = () => {
//   state = { error: undefined, errorInfo: undefined };

//   // componentDidCatch(error, errorInfo) {
//   //   this.setState({
//   //     error,
//   //     errorInfo,
//   //   });
//   // }

//   render() {
//     const { error, errorInfo } = this.state;
//     if (errorInfo) {
//       const errorDetails = true ? (     //DEVELOPMENT
//         <details >
//           {error && error.toString()}
//           <br />
//           {errorInfo.componentStack}
//         {/* </details> */}
//       ) : <></>
//       return (
//         <div>
//           <h2 className="error">An unexpected error has occurred.</h2>
//           {errorDetails}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi được bắt trong ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Đã có lỗi xảy ra! 😢</h1>
          <p>Vui lòng thử lại sau.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
