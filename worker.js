export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(scrapeJohnPye(env));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/scrape") {
      const deals = await scrapeJohnPye(env);
      return new Response(JSON.stringify(deals, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }
    const deals = await scrapeJohnPye(env);
    return new Response(renderDashboardHtml(deals), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

async function scrapeJohnPye(env) {
  const targetUrl = "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168966/TECH-GAMING-LAPTOPS-MACBOOKS";
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)",
        "Accept": "text/html"
      }
    });
    const html = await response.text();
    const matchedLots = [];
    const lotRegex = /href="([^"]*\/Lot\/Details\/[^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?Current Bid[\s\S]*?£([\d.]+)/gi;
    let match;
    while ((match = lotRegex.exec(html)) !== null) {
      const rawUrl = match[1];
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      const currentBid = parseFloat(match[3]);
      const totalOutlay = (currentBid * 1.25 * 1.20) + 15.0;
      const titleUpper = title.toUpperCase();
      const isTargetCpu = /\b(I5-8\d|I5-10\d|I5-11\d|I5-12\d|I5-13\d|I7-8\d|I7-10\d|I7-11\d|RYZEN 3|RYZEN 5|RYZEN 7)\b/i.test(titleUpper);
      const isExcludedCpu = /CELERON|PENTIUM|ATOM|N3060|N4020|6200U|32GB/i.test(titleUpper);
      if (isTargetCpu && !isExcludedCpu && totalOutlay <= 120.0) {
        matchedLots.push({
          title: title,
          bid: "£" + currentBid.toFixed(2),
          totalOutlay: "£" + totalOutlay.toFixed(2),
          url: rawUrl.startsWith("http") ? rawUrl : "https://www.johnpyeauctions.co.uk" + rawUrl
        });
      }
    }
    return matchedLots;
  } catch (err) {
    return [];
  }
}

function renderDashboardHtml(deals) {
  var cardsHtml = "";
  if (deals.length > 0) {
    for (var i = 0; i < deals.length; i++) {
      var d = deals[i];
      cardsHtml += '<div class="card">' +
        '<div class="card-title">' + d.title + '</div>' +
        '<div class="stats">' +
          '<div class="stat-box"><div class="stat-label">Hammer Bid</div><div class="stat-val" style="color: #f59e0b;">' + d.bid + '</div></div>' +
          '<div class="stat-box"><div class="stat-label">Total Outlay</div><div class="stat-val">' + d.totalOutlay + '</div></div>' +
        '</div>' +
        '<a href="' + d.url + '" target="_blank" class="btn">View on John Pye &rarr;</a>' +
      '</div>';
    }
  } else {
    cardsHtml = '<div class="card empty">' +
      '<p>🔍 <strong>Radar Active</strong></p>' +
      '<p>No laptops currently matching all criteria under £120 total outlay.</p>' +
      '<p style="font-size:0.75rem;">Checks run automatically on schedule.</p>' +
    '</div>';
  }

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>John Pye Laptop Radar</title><style>' +
    ':root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #22c55e; --sub: #94a3b8; }' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 16px; }' +
    '.header { text-align: center; margin-bottom: 20px; }' +
    '.header h1 { font-size: 1.4rem; margin: 0 0 6px 0; color: #38bdf8; }' +
    '.header p { font-size: 0.85rem; color: var(--sub); margin: 0; }' +
    '.badge { display: inline-block; background: #0369a1; color: #e0f2fe; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-top: 8px; }' +
    '.card { background: var(--card); border-radius: 12px; padding: 16px; margin-bottom: 14px; border: 1px solid #334155; }' +
    '.card-title { font-size: 0.95rem; font-weight: 600; line-height: 1.4; margin-bottom: 12px; }' +
    '.stats { display: flex; justify-content: space-between; background: #0f172a; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; }' +
    '.stat-box { text-align: center; }' +
    '.stat-label { font-size: 0.7rem; color: var(--sub); text-transform: uppercase; }' +
    '.stat-val { font-size: 1.1rem; font-weight: bold; color: var(--accent); margin-top: 2px; }' +
    '.btn { display: block; text-align: center; background: #2563eb; color: #fff; text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; }' +
    '.empty { text-align: center; padding: 40px 20px; color: var(--sub); font-size: 0.9rem; line-height: 1.5; }' +
    '</style></head><body>' +
    '<div class="header"><h1>John Pye Laptop Radar</h1><p>Auto-filtering lots for &le; £120 max total outlay (i5 8th-Gen+)</p><div class="badge">Live Filter: Total Outlay &le; £120</div></div>' +
    '<div id="listings">' + cardsHtml + '</div>' +
    '</body></html>';
}
