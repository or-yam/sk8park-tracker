export class Renderer {
  // renderData = (data) => {
  //   const source = $('----#handlebars-template----').html();
  //   const template = Handlebars.compile(source);
  //   const newHTML = template(data);
  //   $('.container').empty().append(newHTML);
  // };

renderUserLogin = (data) => {
  const source  = $('#user-template').html()
  const template = Handlebars.compile(source)
  const someHtml = template(data)
  $('.userContainer').empty().append(someHtml)
}

}
