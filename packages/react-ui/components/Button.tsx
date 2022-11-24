import * as React from 'react';

type ButtonProps = {
  className?: string;
};

export const Button: React.FC = (props: ButtonProps) => {
  return (
    <button className="py-2 px-3 w-60 font-bold text-white bg-gradient-to-r from-indigo-400 to-fuchsia-600 rounded transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-700 focus:ring-4 focus:ring-indigo-400 focus:ring-offset-2 drop-shadow-2xl">
      Let&apos;s get it!
    </button>
  );
};
