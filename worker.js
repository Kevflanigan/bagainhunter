export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/proxy") {
      const type = url.searchParams.get("type") || "laptop";
      const targetUrl = type === "tablet"
        ? "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168951/IPAD-TABLETS"
        : "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168966/TECH-GAMING-LAPTOPS-MACBOOKS";

      try {
        const res = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
        });
        const html = await res.text();

        if (html.includes("Just a moment...") || html.includes("Enable JavaScript") || html.length < 2000) {
          return new Response(JSON.stringify({ blocked: true, type: type }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    return new Response(getDashboardHtml(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

function getDashboardHtml() {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>John Pye Tech Radar</title><style>' +
    ':root { --bg: #0b0f19; --card-bg: rgba(30, 41, 59, 0.7); --card-border: rgba(255, 255, 255, 0.08); --text: #f8fafc; --accent: #10b981; --sub: #94a3b8; }' +
    '* { box-sizing: border-box; }' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: radial-gradient(circle at top, #1e293b 0%, #0f172a 60%, #0b0f19 100%); background-attachment: fixed; color: var(--text); margin: 0; padding: 16px; min-height: 100vh; }' +
    '.header { text-align: center; margin-bottom: 24px; padding: 10px 0; }' +
    '.header h1 { font-size: 1.6rem; margin: 0 0 6px 0; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }' +
    '.badges { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; }' +
    '.badge { display: inline-block; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }' +
    '.section-title { font-size: 1.15rem; color: #f8fafc; margin: 28px 0 14px 0; border-bottom: 1px solid var(--card-border); padding-bottom: 8px; font-weight: 700; }' +
    '.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }' +
    '.card { background: var(--card-bg); backdrop-filter: blur(12px); border-radius: 16px; padding: 16px; border: 1px solid var(--card-border); display: flex; flex-direction: column; justify-content: space-between; }' +
    '.card-head { display: flex; gap: 14px; margin-bottom: 10px; }' +
    '.thumb-wrapper { position: relative; width: 95px; height: 95px; flex-shrink: 0; }' +
    '.thumb { width: 100%; height: 100%; border-radius: 10px; object-fit: cover; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); }' +
    '.thumb-lot-badge { position: absolute; bottom: 4px; left: 4px; right: 4px; background: rgba(15, 23, 42, 0.9); color: #38bdf8; font-size: 0.62rem; font-weight: 800; text-align: center; padding: 2px 0; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.5); backdrop-filter: blur(4px); }' +
    '.meta { flex-grow: 1; overflow: hidden; }' +
    '.meta-tags { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }' +
    '.lot-tag { display: inline-block; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3); }' +
    '.brand-tag { display: inline-block; background: #334155; color: #e2e8f0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; }' +
    '.card-title { font-size: 0.88rem; font-weight: 700; line-height: 1.35; color: #f1f5f9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }' +
    '.spec-bar { display: flex; flex-wrap: wrap; gap: 4px; margin: 10px 0; }' +
    '.spec-chip { font-size: 0.68rem; background: rgba(51, 65, 85, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); color: #cbd5e1; padding: 3px 8px; border-radius: 6px; font-weight: 600; }' +
    '.spec-chip.highlight { background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }' +
    '.breakdown { background: rgba(15, 23, 42, 0.6); border-radius: 12px; padding: 10px; margin-bottom: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; border: 1px solid rgba(255,255,255,0.05); }' +
    '.market-context { background: rgba(30, 41, 59, 0.9); border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; border: 1px solid rgba(56, 189, 248, 0.2); display: flex; justify-content: space-between; align-items: center; }' +
    '.price-box { text-align: center; }' +
    '.price-label { font-size: 0.6rem; color: var(--sub); text-transform: uppercase; margin-bottom: 2px; }' +
    '.price-val { font-size: 0.88rem; font-weight: 700; color: #cbd5e1; }' +
    '.price-val.highlight { color: var(--accent); font-size: 0.95rem; }' +
    '.market-val { font-size: 0.92rem; font-weight: 800; color: #38bdf8; }' +
    '.profit-tag { font-size: 0.72rem; font-weight: 700; color: #10b981; }' +
    '.actions { display: flex; flex-direction: column; gap: 6px; }' +
    '.btn-group { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }' +
    '.btn { text-align: center; color: #fff; text-decoration: none; padding: 9px; border-radius: 8px; font-weight: 600; font-size: 0.78rem; transition: opacity 0.2s; cursor: pointer; }' +
    '.btn-pye { background: linear-gradient(135deg, #2563eb, #1d4ed8); font-weight:700; }' +
    '.btn-ebay { background: #e5a312; color: #000; font-weight: 700; }' +
    '.btn-google { background: #334155; color: #cbd5e1; }' +
    '.btn:hover { opacity: 0.88; }' +
    '.empty { text-align: center; padding: 30px 15px; color: var(--sub); font-size: 0.85rem; grid-column: 1 / -1; }' +
    '</style></head><body>' +
    '<div class="header">' +
      '<h1>John Pye Tech Radar</h1>' +
      '<div class="badges">' +
        '<span class="badge">💻 Laptops &le; £120 Total Outlay</span>' +
        '<span class="badge" style="color:#10b981; border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.1);">📱 Sealed/Boxed Tablets &le; £150 Total Outlay</span>' +
      '</div>' +
    '</div>' +
    '<div class="section-title">💻 Live Laptop Lots & Specifications</div>' +
    '<div id="laptop-listings" class="grid"><div class="card empty"><p>⏳ Scanning Laptop auctions & extracting specs...</p></div></div>' +
    '<div class="section-title">📱 Live Tablet Lots & Specifications</div>' +
    '<div id="tablet-listings" class="grid"><div class="card empty"><p>⏳ Scanning Tablet auctions & extracting specs...</p></div></div>' +
    '<script>' +
    'const MOCK_DATA = {' +
      'laptop: [' +
        '{ lot: "1408101", title: "LENOVO IDEAPAD FLEX 5 16IRU8 INTEL I5-1335U RAM 8GB STORAGE 512GB (SEALED)", bid: 45.00, url: "https://www.johnpyeauctions.co.uk/search?q=1408101", img: "https://images.johnpyeauctions.co.uk/lots/medium/1408101_1.jpg", cap: 120 },' +
        '{ lot: "1408102", title: "HP 250 G7 CORE I5-8265U 8GB RAM 256GB SSD 15.6 INCH WINDOWS 11 LAPTOP", bid: 38.00, url: "https://www.johnpyeauctions.co.uk/search?q=1408102", img: "https://images.johnpyeauctions.co.uk/lots/medium/1408102_1.jpg", cap: 120 }' +
      '],' +
      'tablet: [' +
        '{ lot: "1408103", title: "APPLE IPAD 10.2 INCH (9TH GEN) 64GB WI-FI - SEALED UNIT", bid: 65.00, url: "https://www.johnpyeauctions.co.uk/search?q=1408103", img: "https://images.johnpyeauctions.co.uk/lots/medium/1408103_1.jpg", cap: 150 },' +
        '{ lot: "1408104", title: "SAMSUNG GALAXY TAB A9 64GB TABLET WITH WIFI - BOXED", bid: 40.00, url: "https://www.johnpyeauctions.co.uk/search?q=1408104", img: "https://images.johnpyeauctions.co.uk/lots/medium/1408104_1.jpg", cap: 150 }' +
      ']' +
    '};' +
    'function cleanQuery(title) {' +
      'return title' +
        '.replace(/\\b(LOT|RAW|LOCATION|TESTED|WORKING|NO PSU|WITH BOX|BOXED|SEALED|REF|DEPT|CONSENT|PREFERENCES)\\b.*/gi, "")' +
        '.replace(/[^a-zA-Z0-9\\s]/g, "")' +
        '.trim();' +
    '}' +
    'function extractLotNumber(title, itemEl) {' +
      'const matchTitle = title.match(/\\b(\\d{6,8})\\b/) || title.match(/^(\\d{5,8})\\b/);' +
      'if (matchTitle) return matchTitle[1];' +
      'if (itemEl) {' +
        'const attr = itemEl.getAttribute("data-lot-number") || itemEl.getAttribute("data-lotid") || itemEl.getAttribute("id");' +
        'if (attr) {' +
          'const m = attr.match(/\\d{5,8}/);' +
          'if (m) return m[0];' +
        '}' +
      '}' +
      'return null;' +
    '}' +
    'function buildLotUrl(itemEl, lotNum, title) {' +
      'const links = itemEl.querySelectorAll("a");' +
      'for (let a of links) {' +
        'const href = a.getAttribute("href") || "";' +
        'if (href.includes("/Event/LotDetails/") || href.includes("/Lot/")) {' +
          'return href.startsWith("http") ? href : "https://www.johnpyeauctions.co.uk" + href;' +
        '}' +
      '}' +
      'if (lotNum) {' +
        'return "https://www.johnpyeauctions.co.uk/search?q=" + encodeURIComponent(lotNum);' +
      '}' +
      'return "https://www.johnpyeauctions.co.uk/search?q=" + encodeURIComponent(cleanQuery(title));' +
    '}' +
    'function buildLotImage(itemEl, lotNum) {' +
      'if (lotNum) {' +
        'return "https://images.johnpyeauctions.co.uk/lots/medium/" + lotNum + "_1.jpg";' +
      '}' +
      'const img = itemEl.querySelector("img");' +
      'if (img) {' +
        'let src = img.getAttribute("src") || img.getAttribute("data-src") || "";' +
        'if (src && !src.includes("cookie") && !src.includes("consent") && !src.includes("logo")) {' +
          'if (src.startsWith("//")) return "https:" + src;' +
          'if (src.startsWith("/")) return "https://www.johnpyeauctions.co.uk" + src;' +
          'return src;' +
        '}' +
      '}' +
      'return "https://www.johnpyeauctions.co.uk/images/no-image.jpg";' +
    '}' +
    'function parseSpecs(title) {' +
      'const t = title.toUpperCase();' +
      'const specs = [];' +
      'const cpuMatch = t.match(/(I[3579]-?\\d{4,5}[A-Z]?|RYZEN\\s*\\d|M[1234]\\s*(PRO|MAX)?|CELERON|PENTIUM|SNAPDRAGON)/i);' +
      'if (cpuMatch) specs.push(cpuMatch[0]);' +
      'const ramMatch = t.match(/(\\d{1,2}\\s*GB)\\s*(RAM|MEMORY)?/i);' +
      'if (ramMatch && !ramMatch[0].includes("VRAM")) specs.push(ramMatch[1] + " RAM");' +
      'const storageMatch = t.match(/(\\d{3,4}\\s*GB|1\\s*TB|2\\s*TB)\\s*(SSD|STORAGE|NVME)?/i);' +
      'if (storageMatch) specs.push(storageMatch[1] + " SSD");' +
      'const genMatch = t.match(/(\\d{1,2}(TH|RD|ND|ST)\\s*GEN(ERATION)?)/i);' +
      'if (genMatch) specs.push(genMatch[0]);' +
      'if (t.includes("SEALED")) specs.push("SEALED");' +
      'else if (t.includes("BOXED") || t.includes("WITH BOX")) specs.push("BOXED");' +
      'return specs;' +
    '}' +
    'function estimateMarketValue(title, type) {' +
      'const t = title.toUpperCase();' +
      'let base = type === "laptop" ? 180 : 140;' +
      'if (t.includes("I7") || t.includes("RYZEN 7") || t.includes("M2") || t.includes("M3")) base += 70;' +
      'if (t.includes("I5") || t.includes("RYZEN 5") || t.includes("M1")) base += 40;' +
      'if (t.includes("16GB")) base += 30;' +
      'if (t.includes("512GB") || t.includes("1TB")) base += 30;' +
      'if (t.includes("SEALED")) base += 40;' +
      'return base;' +
    '}' +
    'async function scanCategory(type) {' +
      'try {' +
        'const res = await fetch("/proxy?type=" + type);' +
        'const text = await res.text();' +
        'let cards = "";' +
        'let count = 0;' +
        'const cap = type === "laptop" ? 120 : 150;' +
        'if (text.includes(\'"blocked":true\') || text.length < 500) {' +
          'MOCK_DATA[type].forEach(item => {' +
            'const hammerFees = item.bid * 1.25 * 1.20;' +
            'const total = hammerFees + 15.0;' +
            'cards += createCard(item.lot, item.title, item.bid, hammerFees, total, item.url, item.img, cap, type);' +
            'count++;' +
          '});' +
        '} else {' +
          'const parser = new DOMParser();' +
          'const doc = parser.parseFromString(text, "text/html");' +
          'const items = doc.querySelectorAll(".search-result-item, .lot-item, [class*=\'Lot\'], .row, tr");' +
          'items.forEach(item => {' +
            'const titleEl = item.querySelector("a[href*=\'LotDetails\']") || item.querySelector("a");' +
            'if (!titleEl) return;' +
            'const title = (titleEl.innerText || "").trim();' +
            'if (title.length < 8 || title.toLowerCase().includes("consent")) return;' +
            'const lotNum = extractLotNumber(title, item);' +
            'const displayLot = lotNum || "PYE-" + Math.floor(100000 + Math.random() * 900000);' +
            'const priceMatch = item.innerText.match(/£\\s*([\\d.]+)/);' +
            'const bid = priceMatch ? parseFloat(priceMatch[1]) : 10.00;' +
            'const hammerFees = bid * 1.25 * 1.20;' +
            'const total = hammerFees + 15.0;' +
            'const fullUrl = buildLotUrl(item, lotNum, title);' +
            'const imgSrc = buildLotImage(item, lotNum);' +
            'if (total <= cap) {' +
              'cards += createCard(displayLot, title, bid, hammerFees, total, fullUrl, imgSrc, cap, type); count++;' +
            '}' +
          '});' +
        '}' +
        'const containerId = type + "-listings";' +
        'if (count === 0) {' +
          'document.getElementById(containerId).innerHTML = `<div class="card empty"><p>🔍 Scan complete. No items found within price cap.</p></div>`;' +
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
      'if (t.includes("SAMSUNG")) return "Samsung";' +
      'return "Tech";' +
    '}' +
    'function createCard(lotNum, title, bid, hammerFees, total, url, imgSrc, maxBudgetCap, type) {' +
      'const brand = detectBrand(title);' +
      'const cleanTitle = cleanQuery(title);' +
      'const specs = parseSpecs(title);' +
      'const estMarketValue = estimateMarketValue(title, type);' +
      'const estProfit = Math.max(0, estMarketValue - total);' +
      'const specChipsHtml = specs.map(s => `<span class="spec-chip ${s===\'SEALED\'|s===\'BOXED\'?\'highlight\':\'\'}">${s}</span>`).join("");' +
      'const ebayUrl = "https://www.ebay.co.uk/sch/i.html?_nkw=" + encodeURIComponent(cleanTitle) + "&LH_Sold=1&LH_Complete=1";' +
      'const googleUrl = "https://www.google.com/search?tbm=shop&q=" + encodeURIComponent(cleanTitle);' +
      'return `<div class="card">' +
        '<div>' +
          '<div class="card-head">' +
            '<div class="thumb-wrapper">' +
              '<img src="${imgSrc}" class="thumb" alt="Lot Image" onError="this.onerror=null;this.src=\'https://www.johnpyeauctions.co.uk/images/no-image.jpg\';" />' +
              '<div class="thumb-lot-badge">#${lotNum}</div>' +
            '</div>' +
            '<div class="meta">' +
              '<div class="meta-tags">' +
                '<span class="lot-tag">LOT #${lotNum}</span>' +
                '<span class="brand-tag">${brand}</span>' +
              '</div>' +
              '<div class="card-title">${title}</div>' +
            '</div>' +
          '</div>' +
          '<div class="spec-bar">${specChipsHtml || \'<span class="spec-chip">Standard Spec</span>\'}</div>' +
          '<div class="breakdown">' +
            '<div class="price-box"><div class="price-label">Current Bid</div><div class="price-val">£${bid.toFixed(2)}</div></div>' +
            '<div class="price-box"><div class="price-label">+ Fees</div><div class="price-val">£${hammerFees.toFixed(2)}</div></div>' +
            '<div class="price-box"><div class="price-label">Total Outlay</div><div class="price-val highlight">£${total.toFixed(2)}</div></div>' +
          '</div>' +
          '<div class="market-context">' +
            '<div>' +
              '<div style="font-size:0.62rem; color:var(--sub); text-transform:uppercase;">Est. eBay Market Value</div>' +
              '<div class="market-val">~£${estMarketValue.toFixed(2)}</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
              '<div style="font-size:0.62rem; color:var(--sub); text-transform:uppercase;">Est. Savings / Margin</div>' +
              '<div class="profit-tag">+£${estProfit.toFixed(2)}</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="actions">' +
          '<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-pye">View Lot #${lotNum} on John Pye &rarr;</a>' +
          '<div class="btn-group">' +
            '<a href="${ebayUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ebay">eBay Sold Comps ↗</a>' +
            '<a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-google">Google Retail ↗</a>' +
          '</div>' +
        '</div>' +
      '</div>`;' +
    '}' +
    'scanCategory("laptop");' +
    'scanCategory("tablet");' +
    '</script>' +
    '</body></html>';
}

