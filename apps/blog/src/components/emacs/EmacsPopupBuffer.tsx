import { EmacsDataTypes, useStore } from '../../store'

interface EmacsPopupBufferProps {
  className?: string
}

const EmacsPopupBuffer: React.FC<EmacsPopupBufferProps> = () => {
  const { state } = useStore()
  const { data, type } = state.emacs.popupBuffer

  function renderDataMap() {
    switch (type) {
      case EmacsDataTypes.KEYMAP:
        return data.map((item, i) => (
          <p className="flex" key={i}>
            <span className="text-fuchsia-600">{item.key}</span>
            <span>{item.value}</span>
          </p>
        ))
      case EmacsDataTypes.ARTICLES:
        break
      case EmacsDataTypes.NULL:
        break
    }

    return null
  }

  return <div className="grid grid-cols-4 gap-4">{renderDataMap()}</div>
}

export default EmacsPopupBuffer
