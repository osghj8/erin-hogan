// 방명록: Supabase의 guestbook 표에서 글을 읽고 씁니다.
(function () {
  const list = document.getElementById('gb-list');
  const form = document.getElementById('gb-form');
  const nameEl = document.getElementById('gb-name');
  const msgEl = document.getElementById('gb-message');
  const countEl = document.getElementById('gb-count');
  const statusEl = document.getElementById('gb-status');
  const button = form.querySelector('button');

  function formatDate(iso) {
    const d = new Date(iso);
    return d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() + '.';
  }

  function render(rows) {
    list.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'gb-empty';
      empty.textContent = '아직 남겨진 글이 없어요. 첫 번째 인사를 남겨 주세요!';
      list.appendChild(empty);
      return;
    }
    rows.forEach(function (row) {
      const item = document.createElement('article');
      item.className = 'gb-item';

      const head = document.createElement('div');
      head.className = 'gb-head';
      const who = document.createElement('strong');
      who.textContent = row.name;          // textContent: 입력한 글자를 그대로 보여줌 (코드로 실행되지 않음)
      const when = document.createElement('time');
      when.dateTime = row.created_at;
      when.textContent = formatDate(row.created_at);
      head.append(who, when);

      const body = document.createElement('p');
      body.textContent = row.message;

      item.append(head, body);
      list.appendChild(item);
    });
  }

  async function load() {
    const { data, error } = await window.db
      .from('guestbook')
      .select('name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      list.innerHTML = '<p class="gb-empty">방명록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>';
      console.error(error);
      return;
    }
    render(data);
  }

  msgEl.addEventListener('input', function () {
    countEl.textContent = msgEl.value.length + ' / 300';
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) {
      statusEl.textContent = '이름과 내용을 모두 적어 주세요.';
      return;
    }
    button.disabled = true;
    statusEl.textContent = '남기는 중…';
    const { error } = await window.db.from('guestbook').insert({ name: name, message: message });
    button.disabled = false;
    if (error) {
      statusEl.textContent = '저장하지 못했어요. 잠시 후 다시 시도해 주세요.';
      console.error(error);
      return;
    }
    msgEl.value = '';
    countEl.textContent = '0 / 300';
    statusEl.textContent = '고마워요! 글이 남겨졌어요 🙌';
    load();
  });

  load();
})();
