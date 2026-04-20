import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Landing } from './routes/landing';
import { Game } from './routes/game';
import { Home } from './routes/home';
import { Signup } from './routes/signup';
import { UserProfile, UserGames } from './routes/user';
import { NotFound } from './routes/not-found';
import { TooltipProvider } from '@nonogram-api-monorepo/ui';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/signup', element: <Signup /> },
  { path: '/home', element: <Home /> },
  { path: '/game/:gameId', element: <Game /> },
  { path: '/profile', element: <UserProfile /> },
  { path: '/games', element: <UserGames /> },
  { path: '*', element: <NotFound /> },
]);

root.render(
  <StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </Provider>
  </StrictMode>
);
