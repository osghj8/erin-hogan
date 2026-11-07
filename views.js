// 조회수: 페이지를 열면 Supabase에 +1 하고, 숫자를 하단에 보여줍니다.
// 같은 사람이 새로고침할 때마다 올라가지 않도록, 브라우저 창을 닫기 전까지는 한 번만 셉니다.
(function () {
  const el = document.getElementById('view-count');
  if (!el || !window.db) return;
  const page = document.body.dataset.page; // home / projects / notes

  function show(n) {
    if (typeof n === 'number') el.textContent = '👀 조회수 ' + n.toLocaleString('ko-KR');
  }

  let counted = false;
  try { counted = sessionStorage.getItem('viewed-' + page) === '1'; } catch (e) {}

  if (!counted) {
    window.db.rpc('increment_page_view', { p_page: page }).then(function (res) {
      if (res.error) { console.error(res.error); return; }
      show(res.data);
      try { sessionStorage.setItem('viewed-' + page, '1'); } catch (e) {}
    });
  } else {
    window.db.from('page_views').select('views').eq('page', page).single().then(function (res) {
      if (res.error) { console.error(res.error); return; }
      show(res.data.views);
    });
  }
})();
