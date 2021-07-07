function rendersArticles(articles) {
  // How many articles do we have?
  console.log({ beforeFilterLengthOfArticles: articles.length });

  // Lets remove the bad ones, the elements that don't meet a criteria.
  const goodArticles = articles.filter((a) => a.author);

  // How many do we have now?
  console.log({ afterFilterLengthOfArticles: goodArticles.length });

  // Use the foo you got from the api to produce a spam.
  const spam = goodArticles.map(
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

  // Inject spam into the U.I.
  document.getElementById("articles").innerHTML = spam.join("");
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
    "https://newsapi.org/v2/top-headlines?apiKey=6eec2f7fe6cd4c40a3fef8f33f5778fe";
  console.log({ foo });
  return foo.map((p) => url + `&${p.key}=${p.value}`).join("");
}

async function fetchArticles() {
  // NOTES : Signature of fetch() is that it takes a url string 1st & config object 2nd.
  // fetch(url, config)

  // BAD: Promise chain
  // 1. Callback hell
  // 2. Does not look "synchronous"
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

  // Used to hold response from API.
  let articles = [];

  // Make sure we cover/protect/code-for/handle/account for all successful, error-ed, and required steps.
  try {
    const resp = await fetch(url);
    const json = await resp.json();

    // Log one to see it's shape always in our console.
    console.log({ article: json.articles[0], json });

    articles = json.articles;

    // BAD: Did not put pizza in pizza box correctly. Placed pizza on top of closed box.
    localStorage.setItem("willNotWork", articles);

    // GOOD: Did put pizza in pizza box correctly. Placed pizza INSIDE of open box, then closed the box.
    // Save data for rainy day.
    localStorage.setItem("willWork", JSON.stringify(articles));
  } catch (error) {
    // Report the error to the person in charge, you!
    console.log({ error, foo: "bar", spam: "ham" });

    // GOOD: Open box of pizza before eating.
    // Grab out data we saved in previously successfully fetch() requests.
    articles = JSON.parse(localStorage.getItem("willWork"));
  } finally {
    // render Foo to the screen.
    rendersArticles(articles);
  }
}

fetchArticles();
