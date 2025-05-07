const raw: (str: string) => string = (str: string): string => {
	return str.split('\n').join('<br>');
};

const formatGameNumbers: (number: number) => string = (number: number): string => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const toCamelCase = (str: string): string => {
	if (str.length === 0) {
		return '';
	}
	return str[0].toUpperCase() + str.slice(1);
};

export { raw, formatGameNumbers, toCamelCase };
