import { withStyles, TextField } from '@material-ui/core';

// text field
export const CustomTextField = withStyles({
	root: {
		'& label.Mui-focused': {
			color: '#000'
		},
		label: {
			color: '#000'
		},
		'& .MuiOutlinedInput-root': {
			'&:hover fieldset': {
				borderColor: '#000',
				borderWidth: '2px'
			},
			'&.Mui-focused fieldset': {
				borderColor: 'black',
				borderWidth: '2px'
			}
		}
	}
})(TextField);
