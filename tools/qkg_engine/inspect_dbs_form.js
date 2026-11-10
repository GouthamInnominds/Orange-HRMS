async function inspectForm() {
  const res = await fetch('http://127.0.0.1:8080/');
  const html = await res.text();
  const pos = html.indexOf("<select name='db'>");
  console.log('--- HTML around select db ---');
  console.log(html.substring(pos - 250, pos + 250));
}

inspectForm();
