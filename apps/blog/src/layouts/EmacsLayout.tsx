import React, { ReactNode } from 'react';
import { classnames } from '@aftt/shared-utils';
import {
  EmacsHeader,
  EmacsLineSplitter,
  EmacsMiniBuffer,
} from '../components/emacs';
import config from '../components/emacs/config';
import EmacsPopupBuffer from '../components/emacs/EmacsPopupBuffer';
import { useStore } from '../store'

type EmacsLayoutProps = {
  children: ReactNode;
};

const EmacsLayout: React.FC<EmacsLayoutProps> = props => {
  const { state } = useStore()

  return (
    <div
      className={classnames(
        'h-screen text-white p-px',
        config.background,
      )}
    >
      <div className='flex flex-col w-full h-full bg-black'>
        <EmacsLineSplitter />
        <header className="flex justify-center w-full h-5 text-xs align-middle">
          <EmacsHeader />
        </header>
        <EmacsLineSplitter />
        <section className="w-full grow">
          <article>{props.children}</article>
          {state.emacs.showAside && <aside></aside>}
        </section>
        <EmacsLineSplitter />
        <footer className="w-full indent-4">
          <EmacsPopupBuffer />
          <EmacsMiniBuffer />
        </footer>
      </div>
    </div>
  );
};

export default EmacsLayout;
