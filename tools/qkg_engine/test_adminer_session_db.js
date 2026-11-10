async function testOne() {
  const res = await fetch('http://127.0.0.1:8080/?server=127.0.0.1&username=root&db=mysql');
  const html = await res.text();
  console.log('Status:', res.status);
  console.log('Title:', html.match(/<title>(.*?)<\/title>/)?.[1]);
  console.log('H2:', html.match(/<h2>(.*?)<\/h2>/)?.[1]);
  const tables = [...html.matchAll(/<a href=['"]\?server=127\.0\.0\.1&amp;username=root&amp;db=([^&]*)&amp;table=([^'"]*)['"]/g)];
  console.log('Tables found (' + tables.length + '):', tables.slice(0, 5).map(m => `DB=${m[1]} Table=${m[2]}`));
}

testOne();
