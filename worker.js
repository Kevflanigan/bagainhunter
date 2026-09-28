export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/proxy") {
      const type = url.searchParams.get("type") || "laptop";
      const targetUrl = type === "tablet"
        ? "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168951/IPAD-TABLETS"
        : "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168966/TECH-GAMING-LAPTOPS-MACBOOKS";

      try {
        // Fetch via allorigins to bypass Cloudflare anti-bot blocks on server-to-server fetches
        const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        const json = await proxyRes.json();
        return new Response(json.contents, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response("<html><body>Failed to fetch feed</body></html>", { status: 500 });
      }
    }

    return new Response(getDashboardHtml(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

function getDashboardHtml() {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>John Pye Radar</title><style>' +
    ':root { --bg: #0b0f19; --card-bg: rgba(30, 41, 59, 0.7); --card-border: rgba(255, 255, 255, 0.08); --text: #f8fafc; --accent: #10b981; --sub: #94a3b8; }' +
    '* { box-sizing: border-box; }' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: radial-gradient(circle at top, #1e293b 0%, #0f172a 60%, #0b0f19 100%); background-attachment: fixed; color: var(--text); margin: 0; padding: 16px; min-height: 100vh; }' +
    '.header { text-align: center; margin-bottom: 24px; padding: 10px 0; }' +
    '.header h1 { font-size: 1.6rem; margin: 0 0 6px 0; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }' +
    '.badges { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; }' +
    '.badge { display: inline-block; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }' +
    '.section-title { font-size: 1.15rem; color: #f8fafc; margin: 28px 0 14px 0; border-bottom: 1px solid var(--card-border); padding-bottom: 8px; font-weight: 700; }' +
    '.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }' +
    '.card { background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 16px; padding: 16px; border: 1px solid var(--card-border); display: flex; flex-direction: column; justify-content: space-between; }' +
    '.card-head { display: flex; gap: 14px; margin-bottom: 14px; }' +
    '.thumb { width: 75px; height: 75px; border-radius: 10px; object-fit: cover; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }' +
    '.meta { flex-grow: 1; overflow: hidden; }' +
    '.brand-tag { display: inline-block; background: #334155; color: #e2e8f0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px; }' +
    '.card-title { font-size: 0.88rem; font-weight: 600; line-height: 1.35; color: #f1f5f9; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }' +
    '.breakdown { background: rgba(15, 23, 42, 0.6); border-radius: 12px; padding: 10px; margin-bottom: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; border: 1px solid rgba(255,255,255,0.05); }' +
    '.price-box { text-align: center; }' +
    '.price-label { font-size: 0.6rem; color: var(--sub); text-transform: uppercase; margin-bottom: 2px; }' +
    '.price-val { font-size: 0.9rem; font-weight: 700; color: #cbd5e1; }' +
    '.price-val.highlight { color: var(--accent); font-size: 0.95rem; }' +
    '.btn { display: block; text-align: center; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; text-decoration: none; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; }' +
    '.empty { text-align: center; padding: 30px 15px; color: var(--sub); font-size: 0.85rem; grid-column: 1 / -1; }' +
    '</style></head><body>' +
    '<div class="header">' +
      '<h1>John Pye Tech Radar</h1>' +
      '<div class="badges">' +
        '<span class="badge">💻 Laptops &le; £120 Total</span>' +
        '<span class="badge" style="color:#10b981; border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.1);">📱 Sealed/Boxed Tablets &le; £150 Total</span>' +
      '</div>' +
    '</div>' +
    '<div class="section-title">💻 Matching Laptops</div>' +
    '<div id="laptop-listings" class="grid"><div class="card empty"><p>⏳ Scanning Laptop auctions...</p></div></div>' +
    '<div class="section-title">📱 Boxed & Sealed Tablets</div>' +
    '<div id="tablet-listings" class="grid"><div class="card empty"><p>⏳ Scanning Tablet auctions...</p></div></div>' +
    '<script>' +
    'async function scanCategory(type) {' +
      'try {' +
        'const res = await fetch("/proxy?type=" + type);' +
        'const html = await res.text();' +
        'const parser = new DOMParser();' +
        'const doc = parser.parseFromString(html, "text/html");' +
        'let cards = "";' +
        'let count = 0;' +
        'const links = doc.querySelectorAll("a");' +
        'links.forEach(a => {' +
          'const title = (a.innerText || "").trim();' +
          'const titleUpper = title.toUpperCase();' +
          'if (title.length < 10) return;' +
          'const parent = a.closest("div, li, tr, td") || a.parentElement;' +
          'const fullText = parent ? parent.innerText : title;' +
          'const priceMatch = fullText.match(/£\\s*([\\d.]+)/);' +
          'const bid = priceMatch ? parseFloat(priceMatch[1]) : 5.00;' +
          'const hammerFees = bid * 1.25 * 1.20;' +
          'const total = hammerFees + 15.0;' +
          'let linkHref = a.getAttribute("href") || "";' +
          'if (!linkHref.startsWith("http")) linkHref = "https://www.johnpyeauctions.co.uk" + linkHref;' +
          'if (type === "laptop" && /LAPTOP|MACBOOK|THINKPAD|BOOK/i.test(titleUpper) && total <= 120.0) {' +
            'cards += createCard(title, bid, hammerFees, total, linkHref, "https://via.placeholder.com/150/1e293b/94a3b8?text=Tech+Item"); count++;' +
          '} else if (type === "tablet" && /TABLET|IPAD|GALAXY TAB/i.test(titleUpper) && total <= 150.0) {' +
            'cards += createCard(title, bid, hammerFees, total, linkHref, "https://via.placeholder.com/150/1e293b/94a3b8?text=Tablet"); count++;' +
          '}' +
        '});' +
        'const containerId = type + "-listings";' +
        'if (count === 0) {' +
          'document.getElementById(containerId).innerHTML = `<div class="card empty"><p>🔍 Scan complete. Direct page requires active auction login or custom proxy bypass.</p></div>`;' +
        '} else {' +
          'document.getElementById(containerId).innerHTML = cards;' +
        '}' +
      '} catch(e) {' +
        'document.getElementById(type + "-listings").innerHTML = `<div class="card empty"><p>Error: ${e.message}</p></div>`;' +
      '}' +
    '}' +
    'function detectBrand(title) {' +
      'const t = title.toUpperCase();' +
      'if (t.includes("HP")) return "HP";' +
      'if (t.includes("LENOVO")) return "Lenovo";' +
      'if (t.includes("DELL")) return "Dell";' +
      'if (t.includes("APPLE") || t.includes("IPAD")) return "Apple";' +
      'if (t.includes("SAMSUNG")) return "Samsung";' +
      'return "Tech";' +
    '}' +
    'function createCard(title, bid, hammerFees, total, url, imgSrc) {' +
      'const brand = detectBrand(title);' +
      'return `<div class="card">' +
        '<div>' +
          '<div class="card-head">' +
            '<img src="${imgSrc}" class="thumb" alt="Product Image" />' +
            '<div class="meta">' +
              '<span class="brand-tag">${brand}</span>' +
              '<div class="card-title">${title}</div>' +
            '</div>' +
          '</div>' +
          '<div class="breakdown">' +
            '<div class="price-box"><div class="price-label">Hammer</div><div class="price-val">£${bid.toFixed(2)}</div></div>' +
            '<div class="price-box"><div class="price-label">+ Fees</div><div class="price-val">£${hammerFees.toFixed(2)}</div></div>' +
            '<div class="price-box"><div class="price-label">Total (+Del)</div><div class="price-val highlight">£${total.toFixed(2)}</div></div>' +
          '</div>' +
        '</div>' +
        '<a href="${url}" target="_blank" class="btn">View Lot on John Pye &rarr;</a>' +
      '</div>`;' +
    '}' +
    'scanCategory("laptop");' +
    'scanCategory("tablet");' +
    '</script>' +
    '</body></html>';
}
