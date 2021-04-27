export class ParkManager {
  constructor() {
    this._data = { skateParks: [], tempPark: {} };
  }

  calculateRating = ({ one, two, three, four, five }) => {
    const sum = one + two + three + four + five;
    const multi = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;
    return Math.floor(multi / sum);
  };

  getAllParks = async guest => {
    const query = guest ? '/api/skateparks/guest' : '/api/skateparks';
    let data = await $.get(query);
    this._data.skateParks = data.map(park => (park.rating ? (park.rating = this.calculateRating(park.rating)) : (park.rating = 0)));
  };

  addPark = async park => {
    const newPark = await $.post('/api/parks', park);
    this._data.skateParks.push(newPark);
  };

  giveRating = async rate => {
    await $.ajax({
      url: `api/parks/${rate}`,
      type: 'PUT'
    });
  };
}
