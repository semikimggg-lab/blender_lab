async function loadLabs() {
  try {
    const response = await fetch('./labs.json');

    if (!response.ok) {
      throw new Error('교육 콘텐츠 목록을 불러오지 못했습니다.');
    }

    const data = await response.json();
    const container = document.querySelector('.equipment-cards');

    if (!container) return;

    // 기존 서보 카드 제거 (중복 방지)
    container.querySelectorAll('.servo-card').forEach(card => card.remove());

    for (const lab of data.labs) {
      // 기존 진공 시스템은 메인 화면에 있으므로 제외
      if (lab.id === 'vacuum') continue;

      const card = document.createElement('a');
      card.className = 'equipment servo-card';
      card.href = lab.url;

      if (lab.thumbnail) {
        const img = document.createElement('img');
        img.src = lab.thumbnail;
        img.alt = lab.title;
        card.appendChild(img);
      }

      const title = document.createElement('b');
      title.textContent = lab.title;
      card.appendChild(title);

      const description = document.createElement('small');
      description.textContent = lab.description;
      card.appendChild(description);

      container.appendChild(card);
    }
  } catch (error) {
    console.error('SEMI LAB 콘텐츠 로딩 오류:', error);
  }
}

loadLabs();
