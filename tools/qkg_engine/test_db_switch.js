async function testDbSwitch() {
  const dbs = ['orangehrm_mysql', 'test_orangehrm_mysql', 'mysql'];
  for (const db of dbs) {
    const url = `http://127.0.0.1:8080/?server=127.0.0.1&username=root&db=${db}`;
    const res = await fetch(url);
    const html = await res.text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const headerMatch = html.match(/<h2>Database: (.*?)<\/h2>/) || html.match(/Database: ([a-zA-Z0-9_]+)/);
    const activeDb = headerMatch ? headerMatch[1] : 'unknown';
    console.log(`URL: ${url}`);
    console.log(`  -> Status: ${res.status}`);
    console.log(`  -> Title: ${title}`);
    console.log(`  -> Active DB displayed: ${activeDb}`);
    console.log(`  -> DB matches target (${db}): ${title.includes(db) ? 'PASS' : 'FAIL'}`);
    console.log('---');
  }
}

testDbSwitch();
