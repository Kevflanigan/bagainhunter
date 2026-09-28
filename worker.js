/**
 * John Pye Tech Radar Worker
 * Supports both Direct Lot Details URLs and Multi-Lot Category Index Pages
 */

const CONFIG = {
  // Direct target lot or catalog URL
  TARGET_URL: "https://www.johnpyeauctions.co.uk/Event/LotDetails/577248225/ACER-ASPIRE-GO-15-LAPTOP-INTEL-CORE-I3N305-8GB-MEMORY-256G-SSD-ORIGINAL-RRP449-SEALED-LEI12",
  BUYERS_PREMIUM: 0.25,
  VAT_ON_PREMIUM: 0.20,
  DELIVERY_FEE: 15.00,
  TARGET_OUTLAY_CAP: 120.00,
  CACHE_KV_KEY: "latest_auction_lots",
  CACHE_TTL_SEC: 3600
};

function sanitizeListingTitle(rawTitle) {
  if (!rawTitle) return "";
  return rawTitle
    .replace(/^delivery\s+only\s*-\s*/gi, "")
    .replace(/\s*[\(\[][a-z]{3}\d+[\)\]]/gi, "")
    .replace(/\b(sealed|boxed|untested|raw|dept|ref|lot|location|working|tested|rrp|original|grade\s*[a-d])\b/gi, "")
    .replace(/(rrp\s*:?\s*)?£?\d+(\.\d{2})?/gi, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateMaxBid(targetOutlay = CONFIG.TARGET_OUTLAY_CAP, delivery = CONFIG.DELIVERY_FEE) {
  const combinedFeeMultiplier = 1 + (CONFIG.BUYERS_PREMIUM * (1 + CONFIG.VAT_ON_PREMIUM));
  return Math.floor(Math.max(0, (targetOutlay - delivery) / combinedFeeMultiplier));
}

function getCompLinks(cleanedTitle) {
  const q = encodeURIComponent(cleanedTitle);
  return {
    ebaySold: `https://www.ebay.co.uk/sch/i.html?_nkw=${q}&LH_Complete=1&LH_Sold=1`,
    googleShopping: `https://www.google.com/search?tbm=shop&q=${q}`
  };
}

/**
 * Universal Scraper Routine
 */
async function scrapeJohnPyeTarget(targetUrl) {
  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  const html = await response.text();
  const items = [];

  // Check if we are on a Single Lot Details Page (/Event/LotDetails/)
  if (targetUrl.includes("/LotDetails/")) {
    // Extract title from meta or header tag
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) ||
                       html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                       html.match(/<title>([\s\S]*?)<\/title>/i);

    // Extract image thumbnail URL
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i) ||
                      html.match(/<img[^>]+id="main-image"[^>]+src="([^"]+)"/i);

    let title = titleMatch ? titleMatch[1].replace("John Pye Auctions - ", "").trim() : "";
   
    // Fallback: Parse URL path if title tag failed to resolve cleanly
    if (!title) {
      const urlSegment = targetUrl.split("/").pop();
      title = decodeURIComponent(urlSegment).replace(/-/g, " ");
    }

    items.push({
      title: title,
      thumbnail: imgMatch ? imgMatch[1] : "",
      url: targetUrl
    });

  } else {
    // Standard Catalog/Group Parsing
    let currentItem = null;
    const rewriter = new HTMLRewriter()
      .on(".lot-item, .auction-item", {
        element() {
          if (currentItem && currentItem.title) items.push(currentItem);
          currentItem = { title: "", url: "", thumbnail: "" };
        }
      })
      .on("a[href*='/Lot']", {
        element(el) {
          if (currentItem && !currentItem.url) {
            const href = el.getAttribute("href");
            currentItem.url = href.startsWith("http") ? href : `https://www.johnpyeauctions.co.uk${href}`;
          }
        }
      })
      .on(".lot-title, .item-title, h5", {
        text(textChunk) {
          if (currentItem) currentItem.title += textChunk.text;
        }
      });

    const res = new Response(html);
    const transformed = rewriter.transform(res);
    await transformed.text();

    if (currentItem && currentItem.title) items.push(currentItem);
  }

  return items;
}

function renderDashboardHTML(listings) {
  const maxBid = calculateMaxBid();

  const rows = listings.map(item => {
    const rawTitle = item.title.trim();
    const cleanTitle = sanitizeListingTitle(rawTitle);
    const comps = getCompLinks(cleanTitle);

    const lotMatch = item.url.match(/LotDetails\/(\d+)/i) || rawTitle.match(/\bLOT\s*#?(\d+)\b/i);
    const lotNumber = lotMatch ? lotMatch[1] : "577248225";

    return `
      <tr>
        <td style="width: 90px;">
          <img src="${item.thumbnail || 'https://via.placeholder.com/90x65/1e293b/94a3b8?text=Acer+Laptop'}"
               class="rounded border border-secondary" style="width: 80px; height: 60px; object-fit: cover;" alt="Thumbnail">
        </td>
        <td>
          <div class="fw-bold text-light fs-6">${cleanTitle}</div>
          <div class="small text-muted text-truncate" style="max-width: 480px;" title="${rawTitle}">${rawTitle}</div>
          <div class="mt-1">
            <span class="badge bg-dark border border-secondary text-light">Lot #${lotNumber}</span>
            <span class="badge bg-success ms-1">SEALED</span>
            <span class="badge bg-info ms-1">LEI12</span>
          </div>
        </td>
        <td class="text-nowrap">
          <div class="fw-bold text-success fs-5">£${maxBid}</div>
          <div class="small text-muted">Max Hammer Bid</div>
        </td>
        <td class="text-nowrap">
          <div class="fw-bold text-warning">£${CONFIG.TARGET_OUTLAY_CAP.toFixed(2)}</div>
          <div class="small text-muted">Outlay Cap</div>
        </td>
        <td class="text-nowrap">
          <div class="d-flex flex-column gap-1">
            <a href="${comps.ebaySold}" target="_blank" class="btn btn-sm btn-outline-warning">
              eBay Sold Comps
            </a>
            <a href="${item.url}" target="_blank" class="btn btn-sm btn-primary">
              View John Pye Lot
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="en" data-bs-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>John Pye Tech Radar</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { background-color: #090d16; color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; }
        .card { background-color: #111827; border-color: #1f2937; }
        .table { color: #f1f5f9; vertical-align: middle; }
        .table-hover tbody tr:hover { background-color: #1f2937 !important; }
      </style>
    </head>
    <body class="py-4">
      <div class="container-fluid px-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 fw-bold mb-0 text-light">John Pye Tech Radar</h1>
            <p class="text-muted small mb-0">Direct Lot & Catalog Scraper Pipeline</p>
          </div>
          <div class="badge bg-primary px-3 py-2">
            Target Cap: £${CONFIG.TARGET_OUTLAY_CAP} | Max Hammer: £${maxBid}
          </div>
        </div>

        <div class="card shadow-lg">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr>
                  <th>Media</th>
                  <th>Sanitized Lot Information</th>
                  <th>Max Hammer</th>
                  <th>Outlay Cap</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
  async fetch(request, env, ctx) {
    const listings = await scrapeJohnPyeTarget(CONFIG.TARGET_URL);
    const html = renderDashboardHTML(listings);
    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
};
