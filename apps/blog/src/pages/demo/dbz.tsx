import { useEffect, useRef } from 'react';
import { drawTextWaterfall } from 'shared-utils';
import { NextPageWithLayout } from '../_app';

const Home: NextPageWithLayout = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let clear: () => void;
    const getText = async () => {
      const data = await fetch('/api/json/dbz');
      if (data?.status === 200) {
        data.json().then((res: { text: string }) => {
          clear = drawTextWaterfall(canvas.current, {
            text: res.text, // res.text,
          });
        });
      }
    };

    getText().catch(console.error);
    return () => clear?.();
  }, []);

  return (
    <div className="flex justify-center w-full h-screen align-middle bg-black">
      <canvas className="w-full h-screen" ref={canvas}></canvas>
    </div>
  );
};

Home.getLayout = page => page;

export default Home;
