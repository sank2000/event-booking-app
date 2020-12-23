import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './styles/globals.scss';

import { NavBar } from './components';
import { Auth, Events, Booking } from './pages';

function App() {
  return (
    <BrowserRouter>
      <>
        <NavBar />
        <main className='main-content'>
          <Switch>
            <Redirect from='/' to='/auth' exact />
            <Route path='/auth' component={Auth} />
            <Route path='/events' component={Events} />
            <Route path='/bookings' component={Booking} />
          </Switch>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
