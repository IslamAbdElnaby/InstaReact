import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";
// import * as Counter from './Counter';
// import * as WeatherForecasts from './WeatherForecasts';
import * as Auth from "./Auth";
import * as Home from "./Home";
import * as Profile from "./Profile";
export default function configureStore(history, initialState) {
  const reducers = {
    // counter: Counter.reducer,
    // weatherForecasts: WeatherForecasts.reducer
    auth: Auth.reducer,
    home: Home.reducer,
    profile: Profile.reducer
  };

  const middleware = [thunk, routerMiddleware(history)];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
}
