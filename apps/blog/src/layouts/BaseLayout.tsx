import { ReactNode } from 'react'

type BaseLayoutProps = {
  children: ReactNode
}

const BaseLayout = (props: BaseLayoutProps) => {
  return (
    <div>
      <header></header>
      <main>
        <aside></aside>
        <article>{props.children}</article>
        <aside></aside>
      </main>
      <footer></footer>
    </div>
  )
}

export default BaseLayout
