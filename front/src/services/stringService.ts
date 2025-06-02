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

const formatSeasonFromNumber = (seasonNumber: number): string => {
    switch (seasonNumber) {
        case 1:
            return 'spring';
        case 2:
            return 'summer';
        case 3:
            return 'fall';
        case 4:
            return 'winter';
        default:
            return 'spring';
    }
};

const capitalize = (str: string): string => {
    if (str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export { raw, formatGameNumbers, toCamelCase, formatSeasonFromNumber, capitalize };
