let votes = {};

async function loadVotes() {
  try {
    const res = await fetch('/votes');
    const data = await res.json();
    votes = {};
    data.forEach(v => { votes[v.app] = v.score; });
  } catch (err) {
    console.error('Failed to load votes', err);
  }
}

async function sendVote(name, diff) {
  try {
    const res = await fetch('/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app: name, vote: diff })
    });
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    votes[name] = data.score;
    return data.score;
  } catch (err) {
    console.error('Failed to send vote', err);
  }
}

function createAppCard(app) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bg-white rounded-lg shadow overflow-hidden';

  const img = document.createElement('img');
  img.className = 'w-full h-40 object-cover';
  img.src = app.image;
  img.alt = app.name;
  wrapper.appendChild(img);

  const content = document.createElement('div');
  content.className = 'p-4';

  const category = document.createElement('span');
  category.className = 'text-xs bg-brand-light text-white px-2 py-1 rounded';
  category.textContent = app.category;
  content.appendChild(category);

  const title = document.createElement('h2');
  title.className = 'text-lg font-semibold mt-1';
  title.textContent = app.name;
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'text-gray-700 mb-2';
  desc.textContent = app.description;
  content.appendChild(desc);

  const tags = document.createElement('div');
  tags.className = 'flex flex-wrap gap-1 mb-2';
  app.tags.forEach(tag => {
    const t = document.createElement('span');
    t.className = 'text-xs bg-gray-200 px-2 py-1 rounded';
    t.textContent = tag;
    tags.appendChild(t);
  });
  content.appendChild(tags);

  const link = document.createElement('a');
  link.href = app.link;
  link.className = 'text-brand underline text-sm';
  link.textContent = 'View Deal';
  content.appendChild(link);

  const voteWrapper = document.createElement('div');
  voteWrapper.className = 'mt-2 flex items-center space-x-2';

  const upBtn = document.createElement('button');
  upBtn.className = 'bg-green-500 text-white px-2 py-1 rounded';
  upBtn.textContent = '+1';
  upBtn.addEventListener('click', async () => {
    const score = await sendVote(app.name, 1);
    if (typeof score === 'number') voteCount.textContent = score;
  });

  const downBtn = document.createElement('button');
  downBtn.className = 'bg-red-500 text-white px-2 py-1 rounded';
  downBtn.textContent = '-1';
  downBtn.addEventListener('click', async () => {
    const score = await sendVote(app.name, -1);
    if (typeof score === 'number') voteCount.textContent = score;
  });

  const voteCount = document.createElement('span');
  voteCount.className = 'font-bold';
  voteCount.textContent = votes[app.name] || 0;

  voteWrapper.appendChild(upBtn);
  voteWrapper.appendChild(downBtn);
  voteWrapper.appendChild(voteCount);

  content.appendChild(voteWrapper);

  wrapper.appendChild(content);

  return wrapper;
}

function getFilteredApps() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  return apps.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(search) ||
      app.tags.some(t => t.toLowerCase().includes(search));
    const matchesCategory = category === 'all' || app.category === category;
    return matchesSearch && matchesCategory;
  });
}

async function renderApps() {
  const container = document.getElementById('app-list');
  container.innerHTML = '';
  await loadVotes();
  getFilteredApps().forEach(app => {
    const card = createAppCard(app);
    container.appendChild(card);
  });
}

function setupFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const categories = [...new Set(apps.map(a => a.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  document.getElementById('search-input').addEventListener('input', renderApps);
  categoryFilter.addEventListener('change', renderApps);
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilters();
  renderApps();
});
