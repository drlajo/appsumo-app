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
  wrapper.className = 'bg-white p-4 rounded shadow';

  const title = document.createElement('h2');
  title.className = 'text-lg font-semibold';
  title.textContent = app.name;
  wrapper.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'text-gray-700 mb-2';
  desc.textContent = app.description;
  wrapper.appendChild(desc);

  const link = document.createElement('a');
  link.href = app.link;
  link.className = 'text-indigo-600 underline text-sm';
  link.textContent = 'View Deal';
  wrapper.appendChild(link);

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

  wrapper.appendChild(voteWrapper);

  return wrapper;
}

async function renderApps() {
  const container = document.getElementById('app-list');
  await loadVotes();
  apps.forEach(app => {
    const card = createAppCard(app);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderApps);
