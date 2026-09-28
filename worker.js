export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/proxy") {
      const type = url.searchParams.get("type") || "laptop";
      const target = type === "tablet"
        ? "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168951/TECH-GAMING-IPAD-TABLETS"
        : "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168966/TECH-GAMING-LAPTOPS-MACBOOKS";

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
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>John Pye Radar</title><style>' +
    ':root { --bg: #0b0f19; --card-bg: rgba(30, 41, 59, 0.7); --card-border: rgba(255, 255, 255, 0.08); --text: #f8fafc; --accent: #10b981; --sub: #94a3b8; --brand-blue: #38bdf8; }' +
    '* { box-sizing: border-box; }' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: radial-gradient(circle at top, #1e293b 0%, #0f172a 60%, #0b0f19 100%); background-attachment: fixed; color: var(--text); margin: 0; padding: 16px; min-height: 100vh; }' +
    '.header { text-align: center; margin-bottom: 24px; padding: 10px 0; }' +
    '.header h1 { font-size: 1.6rem; margin: 0 0 6px 0; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.5px; }' +
    '.badges { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; }' +
    '.badge { display: inline-block; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; backdrop-filter: blur(4px); }' +
    '.section-title { font-size: 1.15rem; color: #f8fafc; margin: 28px 0 14px 0; border-bottom: 1px solid var(--card-border); padding-bottom: 8px; display: flex; align-items: center; gap: 8px; font-weight: 700; }' +
    '.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }' +
    '.card { background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 16px; padding: 16px; border: 1px solid var(--card-border); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, border-color 0.2s ease; }' +
    '.card:hover { transform: translateY(-2px); border-color: rgba(56, 189, 248, 0.4); }' +
    '.card-head { display: flex; gap: 14px; margin-bottom: 14px; }' +
    '.thumb { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }' +
    '.meta { flex-grow: 1; overflow: hidden; }' +
    '.brand-tag { display: inline-block; background: #334155; color: #e2e8f0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px; letter-spacing: 0.5px; }' +
    '.card-title { font-size: 0.9rem; font-weight: 600; line-height: 1.35; color: #f1f5f9; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }' +
    '.breakdown { background: rgba(15, 23, 42, 0.6); border-radius: 12px; padding: 10px 12px; margin-bottom: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; border: 1px solid rgba(255,255,255,0.05); }' +
    '.price-box { text-align: center; }' +
    '.price-label { font-size: 0.65rem; color: var(--sub); text-transform: uppercase; margin-bottom: 2px; font-weight: 500; }' +
    '.price-val { font-size: 0.95rem; font-weight: 700; color: #cbd5e1; }' +
    '.price-val.highlight { color: var(--accent); font-size: 1.05rem; }' +
    '.btn { display: block; text-align: center; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; text-decoration: none; padding: 11px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; letter-spacing: 0.2px; transition: opacity 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }' +
    '.btn:hover { opacity: 0.9; }' +
    '.empty { text-align: center; padding: 30px 15px; color: var(--sub); font-size: 0.85rem; line-height: 1.5; grid-column: 1 / -1; }' +
    '</style></head><body>' +
    '<div class="header">' +
      '<h1>John Pye Tech Radar</h1>' +
      '<div class="badges">' +
        '<span class="badge">💻 Laptops &le; £120 Total</span>' +
        '<span class="badge" style="color:#10b981; border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.1);">📱 Sealed Tablets &le; £150 Total</span>' +
      '</div>' +
    '</div>' +
    '<div class="section-title">💻 Matching Laptops</div>' +
    '<div id="laptop-listings" class="grid"><div class="card empty"><p>⏳ Scanning Laptop auctions...</p></div></div>' +
    '<div class="section-title">📱 Sealed Tablets</div>' +
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
        'doc.querySelectorAll("a").forEach(a => {' +
          'const title = (a.innerText || "").trim();' +
          'const titleUpper = title.toUpperCase();' +
          'const parent = a.closest(".search-result-item, .lot-item, [class*=\'Lot\']") || a.parentElement;' +
          'const priceMatch = parent ? parent.innerText.match(/£([\\d.]+)/) : null;' +
          'if (!priceMatch) return;' +
          'const bid = parseFloat(priceMatch[1]);' +
          'const hammerPlusFees = bid * 1.25 * 1.20;' +
          'const totalOutlay = hammerPlusFees + 15.0;' +
          'const imgTag = parent ? parent.querySelector("img") : null;' +
          'const imgSrc = imgTag ? (imgTag.src.startsWith("http") ? imgTag.src : "https://www.johnpyeauctions.co.uk" + imgTag.getAttribute("src")) : "https://via.placeholder.com/150/1e293b/94a3b8?text=No+Image";' +
          'if (type === "laptop") {' +
            'const isCpu = /\\b([I1]5[- ]?8\\d|[I1]5[- ]?10\\d|[I1]5[- ]?11\\d|[I1]5[- ]?12\\d|[I1]5[- ]?13\\d|[I1]7[- ]?8\\d|[I1]7[- ]?10\\d|[I1]7[- ]?11\\d|RYZEN 3|RYZEN 5|RYZEN 7)\\b/i.test(titleUpper);' +
            'const isEx = /CELERON|PENTIUM|ATOM|N3060|N4020|6200U|32GB/i.test(titleUpper);' +
            'if (isCpu && !isEx && totalOutlay <= 120.0) {' +
              'cards += createCard(title, bid, hammerPlusFees, totalOutlay, a.href, imgSrc); count++;' +
            '}' +
          '} else if (type === "tablet") {' +
            'const isTablet = /TABLET|IPAD|GALAXY TAB|LENOVO TAB|FIRE/i.test(titleUpper);' +
            'const isSealed = /SEALED|FACTORY SEALED|BRAND NEW IN BOX|UNOPENED|NEW & SEALED/i.test(titleUpper);' +
            'if (isTablet && isSealed && totalOutlay <= 150.0) {' +
              'cards += createCard(title, bid, hammerPlusFees, totalOutlay, a.href, imgSrc); count++;' +
            '}' +
          '}' +
        '});' +
        'const containerId = type + "-listings";' +
        'if (count === 0) {' +
          'document.getElementById(containerId).innerHTML = `<div class="card empty"><p>🔍 Scan complete. No matching ${type}s found under limit.</p></div>`;' +
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
      'if (t.includes("APPLE") || t.includes("IPAD") || t.includes("MACBOOK")) return "Apple";' +
      'if (t.includes("SAMSUNG") || t.includes("GALAXY")) return "Samsung";' +
      'if (t.includes("AMAZON") || t.includes("FIRE")) return "Amazon";' +
      'if (t.includes("ACER")) return "Acer";' +
      'if (t.includes("ASUS")) return "Asus";' +
      'return "Tech";' +
    '}' +
    'function createCard(title, bid, hammerFees, total, url, imgSrc) {' +
      'const brand = detectBrand(title);' +
      'return `<div class="card">' +
        '<div>' +
          '<div class="card-head">' +
            '<img src="${imgSrc}" class="thumb" alt="Product Image" onerror="this.src=\'https://via.placeholder.com/150/1e293b/94a3b8?text=No+Image\'" />' +
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

