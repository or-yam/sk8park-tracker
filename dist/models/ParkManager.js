export class ParkManager {
  constructor() {
    this._data = { skateParks: [] };
  }

  getAllParks = async (user) => {
    const isGuest = user.guest;
    let data = await $.get(`api/skateparks/${isGuest}`);
    this._data.skateParks = data;
    
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
