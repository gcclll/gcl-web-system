import { isCanvasElement, isString } from '../bool'

interface WindowScreen {
  width: number
  height: number
}

export interface TextWaterfallOptions {
  text?: string
  screen?: WindowScreen
  words?: string
  timeout?: number
}

export function drawTextWaterfall(
  canvas: HTMLCanvasElement | null,
  options: TextWaterfallOptions
): () => void {
  if (!canvas || !isCanvasElement(canvas)) {
    throw new TypeError(`canvas is not a valid HTMLCanvasElement.`)
  }

  const { text, screen = window.screen, timeout = 33 } = options || {}

  const letters = Array(256).join('1').split('')
  let wordsToShow: string[] = letters.slice(0)
  if (text) {
    wordsToShow = text.split('')
  }

  const { width, height } = screen
  const len = wordsToShow.length
  const draw = () => {
    const context = canvas.getContext('2d')
    if (!context) return
    context.fillStyle = 'rgba(0,0,0,.05)'

    context.fillRect(0, 0, width, height)
    context.fillStyle = '#0F0'

    letters.map((py, index) => {
      let text = wordsToShow[index % len]
      // text = String.fromCharCode(/*3e4*/ 65 + Math.random() * 33)
      const px = index * 10
      context.fillText(text, px, +py)
      const n = (+py > 758 + Math.random() * 1e4) ? 0 : +py + 10
      letters[index] = '' + n
    })
  }

  const timer = setInterval(draw, timeout)
  return () => clearInterval(timer)
}
