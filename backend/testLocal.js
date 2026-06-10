async function test() {
  try {
    let res = await fetch('http://localhost:3000/api/recipes', { method: 'POST', body: '{}', headers:{'Content-Type':'application/json'} });
    console.log(`POST /api/recipes -> STATUS: ${res.status}`);
  } catch (err) {
    console.error(err);
  }
}
test();
