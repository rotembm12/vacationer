class Store {
    
    airports = [];

    setAirports(airportsArr){
        if(!airportsArr.length){
            return false;
        }
        this.airports = airportsArr;
    }
    
    getAirport(code = "", city = "", country = ""){
        return this.airports.filter(airport => {
            return airport.code === code
                    || airport.city === city 
                    || airport.country === country;
        });
    }
}
export default Store;