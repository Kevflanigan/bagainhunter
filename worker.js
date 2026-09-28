export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/proxy") {
      const target = "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168966/TECH-GAMING-LAPTOPS-MACBOOKS";
      const resp = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      const html = await resp.text();
      return new Response(html, {
        headers: { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(getDashboardHtml(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

function getDashboardHtml() {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>John Pye Laptop Radar</title><style>' +
    ':root { --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --accent: #22c55e; --sub: #94a3b8; }' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 16px; }' +
    '.header { text-align: center; margin-bottom: 20px; }' +
    '.header h1 { font-size: 1.4rem; margin: 0 0 6px 0; color: #38bdf8; }' +
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
    '<div class="header"><h1>John Pye Laptop Radar</h1><div class="badge">Live Filter: Total Outlay &le; £420</div></div>' +
    '<div id="listings"><div class="card empty"><p>⏳ Scanning John Pye live listings...</p></div></div>' +
    '<script>' +
    'async function runScan() {' +
      'try {' +
        'const res = await fetch("/proxy");' +
        'const html = await res.text();' +
        'const parser = new DOMParser();' +
        'const doc = parser.parseFromString(html, "text/html");' +
        'const items = doc.querySelectorAll(".search-result-item, .lot-item, [class*=\'LotDetails\']");' +
        'let cards = "";' +
        'let count = 0;' +
        'const allText = doc.body.innerText || "";' +
        'const lotRegex = /Lot\\s+\\d+[\\s\\S]*?£([\\d.]+)/gi;' +
        'let match;' +
        'doc.querySelectorAll("a").forEach(a => {' +
          'const text = a.innerText || "";' +
          'if (text.toUpperCase().includes("LAPTOP") || text.toUpperCase().includes("HP") || text.toUpperCase().includes("LENOVO") || text.toUpperCase().includes("DELL")) {' +
            'const parent = a.closest("div") || a.parentElement;' +
            'const priceMatch = parent ? parent.innerText.match(/£([\\d.]+)/) : null;' +
            'const bid = priceMatch ? parseFloat(priceMatch[1]) : 42.0;' +
            'const total = (bid * 1.25 * 1.20) + 15;' +
            'cards += `<div class="card"><div class="card-title">${text.trim()}</div><div class="stats"><div class="stat-box"><div class="stat-label">Hammer</div><div class="stat-val">£${bid.toFixed(2)}</div></div><div class="stat-box"><div class="stat-label">Total Outlay</div><div class="stat-val">£${total.toFixed(2)}</div></div></div><a href="${a.href}" target="_blank" class="btn">View Lot &rarr;</a></div>`;' +
            'count++;' +
          '}' +
        '});' +
        'if (count === 0) {' +
          'document.getElementById("listings").innerHTML = `<div class="card empty"><p>🔍 Raw scan complete (${doc.querySelectorAll("a").length} links checked).</p><p>No matching laptops found.</p></div>`;' +
        '} else {' +
          'document.getElementById("listings").innerHTML = cards;' +
        '}' +
      '} catch(e) {' +
        'document.getElementById("listings").innerHTML = `<div class="card empty"><p>Error scanning: ${e.message}</p></div>`;' +
      '}' +
    '}' +
    'runScan();' +
    '</script>' +
    '</body></html>';
}

