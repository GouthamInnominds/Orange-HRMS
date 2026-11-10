async function testAll() {
  const dbs = ['orangehrm_mysql', 'mysql', 'information_schema', 'test_orangehrm_mysql', 'performance_schema'];

  console.log('Testing Database Switching across all MariaDB databases:');
  console.log('---------------------------------------------------------');

  for (const db of dbs) {
    const url = `http://127.0.0.1:8080/?server=127.0.0.1&username=root&db=${db}`;
    const res = await fetch(url);
    const html = await res.text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const h2 = html.match(/<h2>(.*?)<\/h2>/)?.[1] || '';
    const isMatched = title.includes(db) && h2.includes(db);
    const tableCount = (html.match(/Table-[a-zA-Z0-9_]+/g) || []).length;
    console.log(`DB [${db}]: Status=${res.status} | Title: "${title}" | Tables: ${tableCount} | Result: ${isMatched ? 'PASS [OK]' : 'FAIL'}`);
  }
}

testAll();
