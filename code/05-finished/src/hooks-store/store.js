import { useState, useEffect } from 'react';

let globalState = {};
let listeners = [];
let actions = {};

//To Subscribe to store, use it like
// const state = useSelector();
export const useSelector=()=>{
  const setState = useState(globalState)[1];

  useEffect(() => {
    listeners.push(setState); 
    //(↑) IMP: pushing component instance of setState into listener array.(This will be different for each call to useStore)
    //Good Example of JS Closure.

    return () => {
      //When component un-mounts => un-sububscribe it
        listeners = listeners.filter(li => li !== setState);
    }

  },[setState]);//listner is not added, as its outside component
  //setState can be ommited, as its guarnteed by react to not change.

    return globalState;
}

//To get Hold of state updating function, use it like
//const dispatch = useDispatch();
export const useDispatch=()=>{

    const dispatch = (actionIdentifier, payload) => {
      const newState = actions[actionIdentifier](globalState, payload);
      globalState = { ...globalState, ...newState };

      for (const listener of listeners) {
        listener(globalState);
      }
    };

    return dispatch;
}
/*
export const useStore = (shouldListen = true) => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };

    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    if (shouldListen) {
      listeners.push(setState);
    }

    return () => {
      if (shouldListen) {
        listeners = listeners.filter(li => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};
*/

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
