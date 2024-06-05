// index.js

function createStore(reducer, initialState, middleware) {
    let state = initialState;
    let listeners = [];
    let isDispatching = false;

    const getState = () => state;

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    };

    const dispatch = (action) => {
        if (typeof action !== 'object' || action === null || typeof action.type === 'undefined') {
            throw new Error('Actions must be plain objects with a type property.');
        }

        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.');
        }

        try {
            isDispatching = true;
            state = reducer(state, action);
        } finally {
            isDispatching = false;
        }

        listeners.forEach(listener => listener());
        return action;
    };

    const applyMiddleware = (store, middlewares) => {
        let dispatch = store.dispatch;
        const chain = middlewares.map(middleware => middleware(store));
        dispatch = chain.reduceRight((next, middleware) => middleware(next), dispatch);
        return Object.assign({}, store, { dispatch });
    };

    dispatch({ type: '@@redux/INIT' });

    let store = { getState, dispatch, subscribe };

    if (middleware) {
        store = applyMiddleware(store, middleware);
    }

    return store;
}

function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    return (state = {}, action) => {
        const nextState = {};
        let hasChanged = false;

        reducerKeys.forEach(key => {
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        });

        return hasChanged ? nextState : state;
    };
}

module.exports = { createStore, combineReducers };
