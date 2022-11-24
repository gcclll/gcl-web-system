import { useEffect } from 'react'
import { Mousetrap, MousetrapCallback } from 'shared-utils/mousetrap'

export function useMousetrapBind(key: string, callback: MousetrapCallback) {
  // TODO
  useEffect(() => {
    return new Mousetrap({
      targetElement: document,
    }).bind(key, callback)
  }, [])
}

export function useMousetrapMultiBind() {
  // Mousetrap.bind({
  //   a: () => console.log('aaa'),
  //   b: () => console.log('bbb'),
  // });
  // return () => Mousetrap.unbind(['a', 'b']);
}
