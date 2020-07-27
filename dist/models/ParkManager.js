export class ParkManager {
  constructor() {
    this._data = { skateParks: [] };
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

  getAllParks = async () => {
    let data = await $.get('api/skateparks');
    data.map((p) => (p.rating = this.calculateRating(p.rating)));
    this._data.skateParks = data;
    console.log(this._data.skateParks);
  };

  addPark = async (park) => {
    const newPark = await $.post('api/parks');
    this._data.skateParks.push(newPark);
  };

  giveRating = async (rate) => {
    await $.ajax({
      url: `api/parks/${rate}`,
      type: 'PUT',
    });
    console.log('updated');
  };
}
