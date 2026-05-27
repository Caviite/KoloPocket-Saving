import React from 'react'

function Notfoundpage() {
    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',    
        backgroundColor: '#f8f8f8',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
    };
  return (
    <div style={pageStyle}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.❌</p>
    </div>
  )
}

export default Notfoundpage
