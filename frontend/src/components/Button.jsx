import React from 'react';

const Button = ({children, className}) => {
  return (
    <div>
        <div className={className}>
            <span>{children}</span>
        </div>
    </div>
  )
}

export default Button;