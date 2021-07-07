function rendersArticles(articles) {
  console.log({ articlesLength: articles.length});
  const goodArticles = articles.filter(a => a.author)
  console.log({ goodArticles, goodArticlesLength: goodArticles.length });
  const foo = goodArticles.map(
    (a) => `
    <section>
      <h1>${a.title}</h1>
      <div>
        ${a.author}
      </div>
      <div>
      ${a.content}
      </div>
    </section>
  `,
  );

  document.getElementById("articles").innerHTML = foo.join('')
}


function produceUrl() {
  const foo = window.location.search
    .split("?")[1]
    .split("&")
    .map((qP) => {
      const [key, value] = qP.split("=");
      return {
        key: key,
        value: value,
      };
    });

    let url =
      "https://newsapi.org/v2/top-headlines?apiKey=dsadsv";
    console.log({ foo });
    return foo.map((p) => url + `&${p.key}=${p.value}`).join('');
}



async function fetchArticles() {
  // NOTES : Singature of fetch 1st argument url, 2nd is configuration obj

  // fetch(url, {})


  // 1. Promise Chain.
  // fetch(
  //   "https://newsapi.org/v2/top-headlines?apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&language=en&category=health",
  // )
  //   .then((r) => {
  //     return r.json();
  //   })
  //   .then((json) => {
  //     console.log({ foo: json });
  //   })
  //   .catch((e) => {
  //     console.log({e, foo: 'bar'});
  //   })


  // 2. Async/Await 

  let url = produceUrl();

  console.log({url});



  // Sometimes internet bad
  let articles = []
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    console.log({ article: json.articles[0], json });
    articles = json.articles
    localStorage.setItem("willNotWork", articles);
    localStorage.setItem("willWork", JSON.stringify(articles));
  } catch (error) {
    console.log({error, foo: 'bar', spam: 'ham'});
    articles = JSON.parse(localStorage.getItem("willWork"));
  } finally {
    rendersArticles(articles)
  }
}

fetchArticles()