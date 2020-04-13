import React from 'react';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import styles from './LoadingButton.module.scss';

const LoadingButton = ({
	loading,
	success,
	children,
	classes: userClasses = {}
}) => {
	return (
		<Button
			type='submit'
			className={clsx(
				styles.button,
				success && !loading && styles.success,
				(loading || success) && styles.iconsVisible
			)}
			classes={{ disabled: styles.disabled }}
			disabled={loading}
		>
			<>
				{children}{' '}
				{
					<CheckIcon
						className={clsx(
							styles.checkIcon,
							success && !loading && styles.active
						)}
					/>
				}
				{
					<CircularProgress
						size={24}
						className={clsx(styles.progress, loading && styles.active)}
					/>
				}
			</>
		</Button>
	);
};

export default LoadingButton;
