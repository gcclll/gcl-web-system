import * as React from 'react';
import { uniqueClassNames } from '@aftt/shared-utils';

type MacProgressBarProps = {
  className?: string;
  width: number;
};

export const MacProgressBar: React.FC<MacProgressBarProps> = props => {
  return (
    <div
      className={uniqueClassNames(
        'h-1 bg-gray-200 rounded-full dark:bg-gray-700',
        props.className || '',
      )}
    >
      <div
        className="h-1 bg-blue-600 bg-gradient-to-r from-pink-500 to-fuchsia-800 rounded-full ease-in"
        style={{ width: `${props.width}%` }}
      ></div>
    </div>
  );
};
