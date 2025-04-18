const raw: (str: string) => string = (str: string): string => {
	return str.split('\n').join('<br>');
};

const formatGameNumbers: (number: number) => string = (number: number): string => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export { raw, formatGameNumbers };
