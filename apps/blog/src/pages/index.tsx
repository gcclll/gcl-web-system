import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { MacProgressBar, IconArrowPath } from '@aftt/react-ui';
import { increaseNumberInterval } from '@aftt/shared-utils';
import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter()

  const increaseNumber = useCallback(() => {
    return increaseNumberInterval(0, 100, {
      callback(val) {
        setCount(val);
        if (val === 100) {
          router.push('/emacs')
        }
      },
      loading(bool) {
        setLoading(bool);
      },
      points: [30, 80],
    })
  }, [router])

  useEffect(() => {
    return increaseNumber();
  }, [increaseNumber]);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-black ease-in animation-scale-out-center">
      <div className='flex items-center w-2/5'>
        <MacProgressBar width={count} className="grow" />
        {isLoading && (
          <IconArrowPath className="ml-4 text-white bg-gradient-to-r from-pink-500 to-fuchsia-800 rounded-3xl animate-rotate-center" />
        )}
      </div>
    </div>
  );
};

Home.getLayout = page => page;

export default Home;
