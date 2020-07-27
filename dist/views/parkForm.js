document.addEventListener('DOMContentLoader', () => {
  document.getElementById('parkForm').addEventListener('submit', handleForm);
});

function handleForm(ev) {
  ev.preventDefault();
  let parkForm = ev.target;
  let fd = new FormData(parkForm);
  fd.append('newThing', 'someData');
  for (let key of fd.keys()) {
    console.log(key, fd.get(key));
  }
}
