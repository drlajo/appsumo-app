// Store votes in localStorage using app name as key
function getVotes(name) {
  const votes = JSON.parse(localStorage.getItem('votes') || '{}');
  return votes[name] || 0;
}

function setVotes(name, value) {
  const votes = JSON.parse(localStorage.getItem('votes') || '{}');
  votes[name] = value;
  localStorage.setItem('votes', JSON.stringify(votes));
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
  upBtn.addEventListener('click', () => {
    const v = getVotes(app.name) + 1;
    setVotes(app.name, v);
    voteCount.textContent = v;
  });

  const downBtn = document.createElement('button');
  downBtn.className = 'bg-red-500 text-white px-2 py-1 rounded';
  downBtn.textContent = '-1';
  downBtn.addEventListener('click', () => {
    const v = getVotes(app.name) - 1;
    setVotes(app.name, v);
    voteCount.textContent = v;
  });

  const voteCount = document.createElement('span');
  voteCount.className = 'font-bold';
  voteCount.textContent = getVotes(app.name);

  voteWrapper.appendChild(upBtn);
  voteWrapper.appendChild(downBtn);
  voteWrapper.appendChild(voteCount);

  wrapper.appendChild(voteWrapper);

  return wrapper;
}

function renderApps() {
  const container = document.getElementById('app-list');
  apps.forEach(app => {
    const card = createAppCard(app);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderApps);
