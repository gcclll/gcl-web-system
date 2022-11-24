// https://blog.logrocket.com/react-hooks-context-redux-state-management/
import { createContext, Dispatch, Reducer, useReducer } from 'react';

type StateProviderProps = {
  className?: string;
  children: React.ReactNode;
};

function createStore<T, A>(reducer: Reducer<T, A>, initialState: T) {
  const context = createContext<{
    state: T;
    dispatch: Dispatch<A>;
  }>({
    state: initialState,
    dispatch: () => null,
  });
  const { Provider } = context;

  const StateProvider = (props: StateProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <Provider value={{ state, dispatch }}>{props.children}</Provider>;
  };

  return { context, StateProvider };
}

export default createStore;
