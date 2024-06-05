// test.js
const { createStore, combineReducers } = require('./index');
const logger = require('./loggerMiddleware');

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, action.text];
        default:
            return state;
    }
};

const rootReducer = combineReducers({ counter, todos });
const store = createStore(rootReducer, undefined, [logger]);

store.subscribe(() => {
    console.log('State after dispatch: ', store.getState());
});

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'ADD_TODO', text: 'Learn Redux Lite' });
store.dispatch({ type: 'DECREMENT' });
