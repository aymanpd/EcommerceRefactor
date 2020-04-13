import React from 'react';
import { Box } from '@material-ui/core';
import styles from './QuantityInput.module.scss';

const QuantityInput = ({ value, onChange }) => {
	return (
		<Box>
			<button
				onClick={() => value > 1 && onChange(parseInt(value) - 1)}
				className={styles.quantityControl}
			>
				-
			</button>
			<input
				min={1}
				onChange={e =>
					e.target.value &&
					parseInt(e.target.value) !== 0 &&
					onChange(parseInt(e.target.value))
				}
				value={value}
				className={styles.quantityInput}
				type='number'
			/>

			<button
				onClick={() => onChange(parseInt(value) + 1)}
				className={styles.quantityControl}
			>
				+
			</button>
		</Box>
	);
};

export default QuantityInput;
