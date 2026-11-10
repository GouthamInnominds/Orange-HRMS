async function verifyLogin() {
  console.log('Testing full login workflow against http://127.0.0.1:5121/web/index.php ...');
  const getRes = await fetch('http://127.0.0.1:5121/web/index.php/auth/login');
  const cookie = getRes.headers.get('set-cookie').split(';')[0];
  const html = await getRes.text();

  // Find token in :token="([^"]+)"
  const tokenMatch = html.match(/:token="([^"]+)"/);
  if (!tokenMatch) {
    console.error('Could not find :token in HTML:');
    console.log(html);
    return;
  }
  let token = tokenMatch[1].replace(/&quot;/g, '').replace(/"/g, '');
  console.log('1. Extracted CSRF Login Token:', token);

  const params = new URLSearchParams();
  params.append('_token', token);
  params.append('username', 'Admin');
  params.append('password', 'Admin@123456');

  const postRes = await fetch('http://127.0.0.1:5121/web/index.php/auth/validate', {
    method: 'POST',
    headers: {
      'Cookie': cookie,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString(),
    redirect: 'manual'
  });

  console.log('2. Validate Response Status:', postRes.status);
  console.log('3. Location Header:', postRes.headers.get('location'));
  const postCookie = postRes.headers.get('set-cookie');
  const authCookie = postCookie ? postCookie.split(';')[0] : cookie;

  if (postRes.headers.get('location') && postRes.headers.get('location').includes('dashboard')) {
    console.log('LOGIN SUCCESSFUL! Redirected to Dashboard with cookie:', authCookie);
  } else {
    console.log('Redirect location:', postRes.headers.get('location'));
  }
}

verifyLogin();
