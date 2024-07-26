import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { bookApi } from '../api/bookApi';

const apiLoggerWrapper = (apiName, action) => {
    if (action.type.startsWith(apiName)) {
        const actionMeta = action?.meta || {};
        if (Object.keys(actionMeta).length === 0) {
            return action;
        }

        const actionSlice = action.type.split('/');
        const actionType = `${actionSlice[0]}/${actionMeta?.arg?.endpointName}/${actionSlice[2]}`;
        return {
            ...action,
            type: actionType,
        };
    }
    return action;
};

const logger = createLogger({
    duration: true,
    collapsed: true,
    actionTransformer: (action) => {
        let result = { ...action };
        result = apiLoggerWrapper('bookApi', result);
        return result;
    },
});

const store = configureStore({
    reducer: {
        [bookApi.reducerPath]: bookApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware()
            .concat(
                bookApi.middleware,
            );

        if (process.env.NODE_ENV === 'development') {
            middlewares.push(logger);
        }

        return middlewares;
    },
});

export default store;
