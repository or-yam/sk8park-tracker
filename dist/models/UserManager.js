export class UserManger {
  constructor() {
    this._userData = {
      name: 'guest'
    };
  }
  updateUser = async () => {
    const email = this._userData.email;
    const userData = await $.ajax({
      url: `api/users/${email}`,
      type: 'PUT'
    });
    this._userData = userData;
  };
}
