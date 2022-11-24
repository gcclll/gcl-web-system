import * as React from 'react'
import { classnames } from '@aftt/shared-utils'
import config from './config'

const EmacsLineSplitter: React.FC = () => {
  return <div className={classnames('w-full h-px', config.background)}></div>
}

export default EmacsLineSplitter
