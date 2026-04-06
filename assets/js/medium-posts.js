(function () {
  var cfg = window.mediumPostsConfig || {};
  var mediumName = (cfg.mediumName || "i_m_vampire_").replace(/^@/, "");
  var postLimit = Number(cfg.postLimit || 12);
  var containerId = cfg.containerId || "medium-posts";
  var container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function plainText(value) {
    var temp = document.createElement("div");
    temp.innerHTML = value || "";
    return (temp.textContent || temp.innerText || "").trim();
  }

  function formatDate(value) {
    var dt = new Date(value);
    if (Number.isNaN(dt.getTime())) {
      return "";
    }
    return dt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function excerptFromItem(item) {
    var source = item.description || item.content || "";
    var text = plainText(source);
    if (text.length <= 180) {
      return text;
    }
    return text.slice(0, 177).trim() + "...";
  }

  function postTemplate(item) {
    var title = escapeHtml(item.title || "Untitled");
    var link = escapeHtml(item.link || ("https://medium.com/@" + mediumName));
    var excerpt = escapeHtml(excerptFromItem(item));
    var published = formatDate(item.pubDate);

    return (
      '<div class="list__item">' +
      '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">' +
      '<h2 class="archive__item-title" itemprop="headline">' +
      '<a href="' + link + '" rel="noopener noreferrer" target="_blank">' + title + "</a>" +
      "</h2>" +
      (excerpt ? '<p class="archive__item-excerpt" itemprop="description">' + excerpt + "</p>" : "") +
      (published ? '<p class="page__meta"><i class="fa fa-clock-o" aria-hidden="true"></i> ' + published + "</p>" : "") +
      "</article>" +
      "</div>"
    );
  }

  function renderPosts(items) {
    if (!items || !items.length) {
      container.innerHTML =
        '<p>No posts found on Medium right now. <a href="https://medium.com/@' +
        escapeHtml(mediumName) +
        '" target="_blank" rel="noopener noreferrer">Visit the profile</a>.</p>';
      return;
    }

    var html = items.slice(0, postLimit).map(postTemplate).join("");
    container.innerHTML = html;
  }

  function renderError() {
    container.innerHTML =
      '<p>Unable to load Medium posts right now. <a href="https://medium.com/@' +
      escapeHtml(mediumName) +
      '" target="_blank" rel="noopener noreferrer">View them on Medium</a>.</p>';
  }

  var rssUrl = "https://medium.com/feed/@" + encodeURIComponent(mediumName);
  var endpoint = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl);

  fetch(endpoint)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch Medium feed");
      }
      return response.json();
    })
    .then(function (data) {
      if (!data || data.status !== "ok") {
        throw new Error("Invalid Medium feed response");
      }
      renderPosts(data.items || []);
    })
    .catch(renderError);
})();
