export class ParkManager {
  constructor() {
    this._data = { skateParks: [], tempPark: {} };
  }

  calculateRating = (ratingObj) => {
    const sum =
      ratingObj.one +
      ratingObj.two +
      ratingObj.three +
      ratingObj.four +
      ratingObj.five;
    const multi =
      ratingObj.one * 1 +
      ratingObj.two * 2 +
      ratingObj.three * 3 +
      ratingObj.four * 4 +
      ratingObj.five * 5;
    return Math.floor(multi / sum);
  };

  getAllParks = async (guest) => {
    if (!guest) {
      let data = await $.get('/api/skateparks');
      data.map((p) =>
        p.rating ? (p.rating = this.calculateRating(p.rating)) : (p.rating = 0)
      );
      this._data.skateParks = data;
    } else {
      let data = await $.get('/api/skateparks/guest');
      data.map((p) =>
        p.rating ? (p.rating = this.calculateRating(p.rating)) : (p.rating = 0)
      );
      this._data.skateParks = data;
    }
  };

  addPark = async (park) => {
    const newPark = await $.post('/api/parks', park);
    this._data.skateParks.push(newPark);
  };

  giveRating = async (rate) => {
    await $.ajax({
      url: `api/parks/${rate}`,
      type: 'PUT',
    });
  };
}
