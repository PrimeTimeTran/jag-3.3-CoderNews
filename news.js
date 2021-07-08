function renderArticles(articles) {
  const spam = articles.map(
    (a, foo, spam) => `
    <section>
      <h1>${foo + 1}. ${a.title}</h1>
      <div>
        ${a.author}
      </div>
      <div>
      ${a.content}
      </div>
    </section>
  `,
  );

  // Inject spam into the U.I.
  document.getElementById("articles").innerHTML = spam.join("");
}

let pageNumber = 0;

function produceDefaultUrl() {
  pageNumber++;

  let url = `https://newsapi.org/v2/top-headlines?apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&page=${pageNumber}`;

  const urlParams = window.location.search.split("?")[1];

  if (!urlParams) return url + "&language=en";

  urlParams.split("&").map((p) => {
    const [key, value] = p.split("=");
    url += `&${key}=${value}`;
  });

  return url;
}

// // NOTES : Signature of fetch() is that it takes a url string 1st & config object 2nd.
// // fetch(url, config)
// // BAD: Promise chain
// // 1. Callback hell
// // 2. Does not look "synchronous"
// function fetchArticles() {
//   fetch(
//     "https://newsapi.org/v2/top-headlines?apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&language=en&category=health",
//   )
//     .then((r) => {
//       return r.json();
//     })
//     .then((json) => {
//       console.log({ foo: json });
//       rendersArticles(json.articles);
//     })
//     .catch((e) => {
//       console.log({e, foo: 'bar'});
//     })
// }

let articles = [];
let allArticles = [];

function spam(q) {
  return `https://newsapi.org/v2/top-headlines?apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe&page=${pageNumber}&q=${q}`;
}

// 2. Async/Await
async function fetchArticles(q) {
  let url = q ? spam(q) : produceDefaultUrl();

  try {
    const resp = await fetch(url);
    const json = await resp.json();

    articles = json.articles;

    allArticles = allArticles.concat(articles);
  } catch (error) {
    articles = JSON.parse(localStorage.getItem("willWork"));
  } finally {
    renderArticles(allArticles);
  }
}

fetchArticles();

function fooBar() {
  fetchArticles();
}

function searchNews(e) {
  const q = document.getElementById("searchTerm").value;
  fetchArticles(q);
}
