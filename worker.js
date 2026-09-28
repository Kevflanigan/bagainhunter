async function scrapeJohnPye(env) {
  const targetUrl = "https://www.johnpyeauctions.co.uk/Browse/C183360492-C217168966/TECH-GAMING-LAPTOPS-MACBOOKS";
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    const html = await response.text();
    const matchedLots = [];

    // Split page into individual lot blocks
    const lotBlocks = html.split(/(?=class="[^"]*lot-item|class="[^"]*search-result-item)/i);

    for (let i = 1; i < lotBlocks.length; i++) {
      const block = lotBlocks[i];

      // Extract URL
      const urlMatch = block.match(/href="([^"]*\/Lot\/Details\/[^"]*|\/Event\/LotDetails\/[^"]*)"/i);
      if (!urlMatch) continue;
      const rawUrl = urlMatch[1];

      // Extract Title (strip tags)
      const titleMatch = block.match(/class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/a>/i) || 
                         block.match(/href="[^"]*LotDetails[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
      if (!titleMatch) continue;
      const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();

      // Extract Bid Amount (defaults to starting bid if £0)
      const bidMatch = block.match(/£\s*([\d,]+\.?\d*)/);
      const currentBid = bidMatch ? parseFloat(bidMatch[1].replace(',', '')) : 0;

      // Calculate total outlay: (Hammer * 1.25 * 1.20) + £15
      const totalOutlay = (currentBid * 1.25 * 1.20) + 15.0;
      const titleUpper = title.toUpperCase();

      // Broad matching for i5 8th-Gen+, i7 8th-Gen+, and Ryzen 3/5/7
      const isTargetCpu = /\b([I1]5[- ]?8\d|[I1]5[- ]?10\d|[I1]5[- ]?11\d|[I1]5[- ]?12\d|[I1]5[- ]?13\d|[I1]7[- ]?8\d|[I1]7[- ]?10\d|[I1]7[- ]?11\d|RYZEN 3|RYZEN 5|RYZEN 7)\b/i.test(titleUpper);
      const isExcludedCpu = /CELERON|PENTIUM|ATOM|N3060|N4020|6200U|32GB/i.test(titleUpper);

      if (isTargetCpu && !isExcludedCpu && totalOutlay <= 420.0) {
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
