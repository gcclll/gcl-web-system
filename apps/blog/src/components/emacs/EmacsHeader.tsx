import * as React from 'react';

type EmacsHeaderProps = {
  className?: string;
};

const EmacsHeader: React.FC<EmacsHeaderProps> = () => {
  return <div className="text-center bg-black">emacs header</div>;
};


export default EmacsHeader;

