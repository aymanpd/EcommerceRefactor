import React from 'react';
import 'typeface-roboto';
import { Provider } from 'react-redux';
import store from './store';
import AppRouter from './AppRouter';
import { StylesProvider } from '@material-ui/core';

function App() {
	return (
		<>
			<StylesProvider injectFirst>
				<Provider store={store}>
					<AppRouter />
				</Provider>
			</StylesProvider>
		</>
	);
}

export default App;
