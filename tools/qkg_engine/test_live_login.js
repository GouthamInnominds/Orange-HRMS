async function testStandardLogin() {
  try {
    const getRes = await fetch('http://127.0.0.1:5121/web/index.php/auth/login');
    const cookie = getRes.headers.get('set-cookie').split(';')[0];
    const html = await getRes.text();
    const tokenMatch = html.match(/name="_token"\s+value="([^"]+)"/);
    const token = tokenMatch ? tokenMatch[1] : '';
    console.log('Got CSRF Token:', token);

    const params = new URLSearchParams();
    params.append('_token', token);
    params.append('username', 'Admin');
    params.append('password', 'admin123');

    const postRes = await fetch('http://127.0.0.1:5121/web/index.php/auth/validate', {
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      redirect: 'manual'
    });
    console.log('Post status:', postRes.status, 'Location:', postRes.headers.get('location'));
    const newCookie = postRes.headers.get('set-cookie');
    console.log('Post cookie:', newCookie ? newCookie.split(';')[0] : cookie);
  } catch (e) {
    console.error('Error:', e);
  }
}
testStandardLogin();
