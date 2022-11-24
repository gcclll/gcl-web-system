import { useRef } from 'react'
import { useHotkeys } from '../composables'
import { NextPageWithLayout } from './_app'

const Emacs: NextPageWithLayout = () => {
  const emacsEl = useRef<HTMLDivElement>(null)

  // 注册 `C-h` 按键显示帮助信息
  useHotkeys()

  return (
    <div ref={emacsEl} className="text-white underline">
      emacs content
    </div>
  )
}

export default Emacs
