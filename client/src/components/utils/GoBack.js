import React from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import styles from './GoBack.module.scss';
import { withRouter } from 'react-router-dom';

const GoBack = ({ history }) => {
	return (
		<button
			className={styles.goBack}
			onClick={e => {
				e.preventDefault();
				history.goBack && history.goBack();
			}}
		>
			<ChevronLeftIcon style={{ verticalAlign: 'middle' }} />
			Go Back
		</button>
	);
};

export default withRouter(GoBack);
