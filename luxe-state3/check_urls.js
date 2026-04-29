const fs = require('fs');
const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 400 || res.statusCode === 302) {
         resolve({ url, status: res.statusCode, broken: true });
      } else {
         resolve({ url, status: res.statusCode, broken: false });
      }
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', broken: true });
    });
  });
}

async function main() {
  const fileContent = fs.readFileSync('/Users/romulorosales/.gemini/antigravity/brain/7a923ffd-9c4e-489b-a488-9819527d7f56/.system_generated/steps/36/output.txt', 'utf8');
  
  // Extract the JSON object from the file
  const jsonStart = fileContent.indexOf('{');
  if (jsonStart === -1) {
    console.error('Could not find JSON start');
    return;
  }
  const jsonContent = fileContent.substring(jsonStart);
  const parsed = JSON.parse(jsonContent);
  const resultStr = parsed.result;
  
  // Extract JSON between boundaries
  const match = resultStr.match(/<untrusted-data-[^>]+>([\s\S]*?)<\/untrusted-data-[^>]+>/);
  if (!match) {
    console.error('Could not find JSON data in boundaries');
    return;
  }
  
  const properties = JSON.parse(match[1].trim());
  const allUrls = new Set();
  const urlToIds = new Map();
  
  properties.forEach(p => {
    if (p.images && Array.isArray(p.images)) {
      p.images.forEach(url => {
         allUrls.add(url);
         if (!urlToIds.has(url)) urlToIds.set(url, []);
         urlToIds.get(url).push(p.id);
      });
    }
  });

  const urlsArray = Array.from(allUrls);
  console.log(`Checking ${urlsArray.length} unique URLs...`);
  
  // Check in batches of 10
  const brokenUrls = [];
  for (let i = 0; i < urlsArray.length; i += 10) {
    const batch = urlsArray.slice(i, i + 10);
    const results = await Promise.all(batch.map(checkUrl));
    results.forEach(r => {
      if (r.broken) brokenUrls.push(r);
    });
  }

  console.log(`\nFound ${brokenUrls.length} broken URLs:`);
  brokenUrls.forEach(b => {
    console.log(`\nURL: ${b.url}`);
    console.log(`Status: ${b.status}`);
    console.log(`Used in property IDs: ${urlToIds.get(b.url).join(', ')}`);
  });
}

main().catch(console.error);
