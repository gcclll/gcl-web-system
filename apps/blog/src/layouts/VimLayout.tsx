import { ReactNode } from 'react'

type VimLayoutProps = {
  children: ReactNode
}

const VimLayout = (props: VimLayoutProps) => {
  return (
    <div>
      <header></header>
      <main>
        <article>{props.children}</article>
      </main>
      <footer></footer>
    </div>
  )
}

export default VimLayout
