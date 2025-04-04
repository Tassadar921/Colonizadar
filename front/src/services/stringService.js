const raw = (str) => {
    return str.replaceAll('\n', '<br>');
};

const formatGameTerritoryPowerAndShips = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export { raw, formatGameTerritoryPowerAndShips };
