// часы
const openWindows = {};
const apps = {};

function registerApp(name, app) {
  apps[name] = app;
}

const appTitles = {
  photos: 'Photos',
  messages: 'Messages',
  notes: 'Notes',
  system: 'System'
};

function updateTime() {
  const now = new Date();
  const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('time').textContent = t;
}
setInterval(updateTime, 1000);
updateTime();

// клики по иконкам
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    openApp(icon.dataset.app);
  });
});

let zIndex = 1;

function openApp(name) {
  if (openWindows[name]) {
    openWindows[name].style.zIndex = ++zIndex;
    return;
  }

  const win = document.createElement('div');
  openWindows[name] = win;

  win.className = 'window';
  win.style.left = Math.random() * 200 + 100 + 'px';
  win.style.top = Math.random() * 100 + 80 + 'px';
  win.style.zIndex = ++zIndex;

  win.innerHTML = `
  <div class="window-header">
    ${appTitles[name] || name}
    <div class="window-controls">
      <div class="btn close"></div>
    </div>
  </div>
    <div class="window-content"></div>
`;

const content =
  apps[name]?.render?.() || `${name} app`;

win.querySelector('.window-content').innerHTML = content;


  document.getElementById('windows').appendChild(win);

  focusWindow(win);
  makeDraggable(win);

  win.querySelector('.close').onclick = () => {
    delete openWindows[name];
    win.remove();
  };
}


function focusWindow(win) {
  win.addEventListener('mousedown', () => {
    win.style.zIndex = ++zIndex;
  });
}

function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let offsetX = 0, offsetY = 0, dragging = false;

  header.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = ++zIndex;
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + 'px';
    win.style.top = e.clientY - offsetY + 'px';
  });

  document.addEventListener('mouseup', () => dragging = false);
}
