import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { IconArrowPath, MacProgressBar } from '@aftt/react-ui'
import { increaseNumberInterval } from '@aftt/shared-utils'
import { type NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  const [count, setCount] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const increaseNumber = useCallback(() => {
    return increaseNumberInterval(0, 100, {
      callback(val) {
        setCount(val)
        if (val === 100) router.push('/emacs')
      },
      loading(bool) {
        setLoading(bool)
      },
      points: [30, 80],
    })
  }, [router])

  useEffect(() => {
    return increaseNumber()
  }, [increaseNumber])

  return (
    <div className="animation-scale-out-center flex h-screen w-full items-center justify-center bg-black ease-in">
      <div className="flex w-2/5 items-center">
        <MacProgressBar width={count} className="grow" />
        {isLoading && (
          <IconArrowPath className="ml-4 animate-rotate-center rounded-3xl bg-gradient-to-r from-pink-500 to-fuchsia-800 text-white" />
        )}
      </div>
    </div>
  )
}

Home.getLayout = (page) => page

export default Home
