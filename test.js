async function test() {
  const res = await fetch('https://blottr.onrender.com/posts/feed?limit=1');
  if (res.status !== 200) {
     const res2 = await fetch('https://blottr.onrender.com/posts/');
     const d2 = await res2.json();
     if(d2.length > 0) testUrls(d2[0].id)
     return;
  }
  const data = await res.json();
  const postId = data[0].id;
  testUrls(postId);
}
async function testUrls(postId) {
  const urls = [
      `https://blottr.onrender.com/comment/post/${postId}/comment`,
      `https://blottr.onrender.com/comment/post/${postId}/comments`,
      `https://blottr.onrender.com/comment/post/${postId}`
  ];

  for (const url of urls) {
      try {
         const response = await fetch(url);
         const text = await response.text();
         console.log(url, '->', response.status, text.substring(0, 100));
      } catch (e) {
         console.log(url, e.message);
      }
  }
}
test();
