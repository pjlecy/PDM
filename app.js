const navItems = document.querySelectorAll('.nav__item');
const pages = document.querySelectorAll('[data-page]');
const searchInput = document.getElementById('vault-search');
const filterPills = document.querySelectorAll('.pill');
const sortButtons = document.querySelectorAll('.sort');
const drawer = document.getElementById('file-drawer');
const drawerPanel = drawer?.querySelector('.drawer__panel');
const drawerSubtitle = document.getElementById('drawer-subtitle');
const drawerMeta = document.getElementById('drawer-meta');
const drawerHistory = document.getElementById('drawer-history');
const drawerApprovals = document.getElementById('drawer-approvals');
const banner = document.getElementById('data-banner');

let vaultData = [];
let projectData = [];
let sortState = { key: 'name', direction: 'asc' };
let vaultFilter = 'all';
let currentPage = 'dashboard';

const statusClassMap = {
  'In review': 'status--review',
  Active: 'status--active',
  Approved: 'status--active',
  Released: 'status--active',
  'On hold': 'status--hold',
  Locked: 'status--review',
  'Needs review': 'status--review',
  'In work': 'status--hold',
};

const tagClassMap = {
  Approved: 'tag--success',
  Released: 'tag--success',
  Locked: 'tag--warning',
  'Needs review': 'tag--warning',
  'In work': 'tag--info',
  High: 'tag--warning',
  Medium: 'tag--info',
  Low: 'tag--success',
};

const normalize = (value) => value?.toString().toLowerCase() || '';

const showPage = (pageName) => {
  currentPage = pageName;
  pages.forEach((section) => {
    section.hidden = section.dataset.page !== pageName;
  });
  window.location.hash = pageName;
  localStorage.setItem('pdmPage', pageName);
};

const setSkeletons = (enabled) => {
  document.querySelectorAll('[data-skeleton]').forEach((node) => {
    node.hidden = !enabled;
  });
};

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((nav) => nav.classList.remove('nav__item--active'));
    item.classList.add('nav__item--active');
    showPage(item.dataset.page || 'dashboard');
  });
});

const renderProjects = (projects) => {
  const container = document.getElementById('project-rows');
  const empty = document.getElementById('project-empty');
  container.innerHTML = '';

  if (!projects.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  projects.forEach((project) => {
    const row = document.createElement('div');
    row.className = 'table__row';
    row.innerHTML = `
      <span>${project.name}</span>
      <span class="status ${statusClassMap[project.status] || 'status--active'}">${project.status}</span>
      <span>${project.owner}</span>
      <span>${project.due}</span>
    `;
    container.appendChild(row);
  });
};

const renderActivity = (activity) => {
  const container = document.getElementById('activity-list');
  const empty = document.getElementById('activity-empty');
  container.innerHTML = '';

  if (!activity.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  activity.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'activity__item';
    card.innerHTML = `
      <div>
        <p class="activity__title">${item.title}</p>
        <p class="activity__meta">${item.meta}</p>
      </div>
      <span class="status ${statusClassMap[item.status] || 'status--active'}">${item.status}</span>
    `;
    container.appendChild(card);
  });
};

const renderWorkflow = (workflow) => {
  const container = document.getElementById('workflow-steps');
  container.innerHTML = '';
  workflow.forEach((step) => {
    const row = document.createElement('div');
    const stateClass = step.state ? `workflow__step--${step.state}` : '';
    row.className = `workflow__step ${stateClass}`;
    row.innerHTML = `
      <span class="workflow__dot"></span>
      <div>
        <p class="workflow__title">${step.title}</p>
        <p class="workflow__meta">${step.meta}</p>
      </div>
    `;
    container.appendChild(row);
  });
};

const renderVault = () => {
  const container = document.getElementById('vault-list');
  const empty = document.getElementById('vault-empty');
  const query = normalize(searchInput?.value);

  const filtered = vaultData.filter((item) => {
    const matchesFilter = vaultFilter === 'all' || item.status === vaultFilter;
    const matchesQuery =
      normalize(item.name).includes(query) ||
      normalize(item.path).includes(query) ||
      normalize(item.owner).includes(query);
    return matchesFilter && matchesQuery;
  });

  container.innerHTML = '';
  if (!filtered.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  filtered.forEach((item) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'vault-item';
    row.dataset.id = item.id;
    row.innerHTML = `
      <div>
        <p class="vault-item__title">${item.name}.${item.type}</p>
        <p class="vault-item__meta">${item.path}</p>
      </div>
      <div class="vault-item__tags">
        <span class="tag">Rev ${item.revision}</span>
        <span class="tag ${tagClassMap[item.status] || ''}">${item.status}</span>
      </div>
    `;
    row.addEventListener('click', () => openDrawer(item));
    container.appendChild(row);
  });
};

const renderSecurity = (cards) => {
  const container = document.getElementById('security-grid');
  container.innerHTML = '';
  cards.forEach((card) => {
    const item = document.createElement('div');
    item.className = 'security-card';
    item.innerHTML = `
      <p class="security-card__title">${card.title}</p>
      <p class="security-card__meta">${card.meta}</p>
    `;
    container.appendChild(item);
  });
};

const renderTimeline = (items) => {
  const container = document.getElementById('revision-timeline');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'timeline__item';
    row.innerHTML = `
      <span class="timeline__dot"></span>
      <div class="timeline__content">
        <p class="timeline__title">${item.title}</p>
        <p class="timeline__meta">${item.meta}</p>
      </div>
    `;
    container.appendChild(row);
  });
};

const renderAudit = (items) => {
  const container = document.getElementById('audit-log');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'audit__item';
    row.innerHTML = `
      <p class="audit__title">${item.title}</p>
      <p class="audit__meta">${item.meta}</p>
    `;
    container.appendChild(row);
  });
};

const renderKpis = (items) => {
  const container = document.getElementById('kpi-grid');
  container.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'kpi-card';
    card.innerHTML = `
      <p class="kpi-card__label">${item.label}</p>
      <p class="kpi-card__value">${item.value}</p>
      <p class="kpi-card__meta">${item.meta}</p>
    `;
    container.appendChild(card);
  });
};

const renderEcoQueue = (items) => {
  const container = document.getElementById('eco-list');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'eco-item';
    row.innerHTML = `
      <div>
        <p class="eco-item__title">${item.title}</p>
        <p class="eco-item__meta">Owner: ${item.owner} · Due ${item.due}</p>
      </div>
      <span class="tag ${tagClassMap[item.priority] || ''}">${item.priority}</span>
    `;
    container.appendChild(row);
  });
};

const renderReleaseGates = (items) => {
  const container = document.getElementById('release-gates');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'gate-item';
    row.innerHTML = `
      <span class="gate-item__label">${item.label}</span>
      <span class="status ${statusClassMap[item.status] || 'status--review'}">${item.status}</span>
    `;
    container.appendChild(row);
  });
};

const renderSla = (items) => {
  const container = document.getElementById('sla-grid');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'sla-card';
    row.innerHTML = `
      <p class="sla-card__label">${item.label}</p>
      <p class="sla-card__value">${item.value}</p>
      <p class="sla-card__meta">${item.meta}</p>
    `;
    container.appendChild(row);
  });
};

const renderConflicts = (items) => {
  const container = document.getElementById('conflict-list');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'conflict-item';
    row.innerHTML = `
      <div>
        <p class="conflict-item__title">${item.title}</p>
        <p class="conflict-item__meta">${item.meta}</p>
      </div>
      <span class="tag tag--warning">${item.severity}</span>
    `;
    container.appendChild(row);
  });
};

const renderBom = (items) => {
  const container = document.getElementById('bom-list');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'bom-item';
    row.innerHTML = `
      <span class="bom-item__title">${item.title}</span>
      <span class="bom-item__meta">${item.count} items · Updated ${item.updated}</span>
    `;
    container.appendChild(row);
  });
};

const renderPermissions = (items) => {
  const container = document.getElementById('permission-grid');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'permission-card';
    row.innerHTML = `
      <p class="permission-card__title">${item.role}</p>
      <p class="permission-card__meta">${item.access}</p>
    `;
    container.appendChild(row);
  });
};

const renderDiffSummary = (items) => {
  const container = document.getElementById('diff-summary');
  container.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'diff-item';
    row.innerHTML = `
      <p class="diff-item__title">${item.file}</p>
      <p class="diff-item__meta">${item.summary}</p>
    `;
    container.appendChild(row);
  });
};

const renderViewerPreview = (item) => {
  const container = document.getElementById('viewer-preview');
  container.innerHTML = `
    <div class="viewer-preview__frame">
      <img src="${item.thumbnail}" alt="${item.title}" />
    </div>
    <p class="viewer-preview__meta">${item.meta}</p>
  `;
};

const openDrawer = (item) => {
  if (!drawer || !drawerPanel) {
    return;
  }
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  drawerSubtitle.textContent = `${item.name}.${item.type} · Rev ${item.revision}`;

  drawerMeta.innerHTML = '';
  drawerHistory.innerHTML = '';
  drawerApprovals.innerHTML = '';

  const metaItems = [
    `Owner: ${item.owner}`,
    `Status: ${item.status}`,
    `Path: ${item.path}`,
    `Last action: ${item.lastAction}`,
    `File size: ${item.fileSize || 'Unknown'}`,
    `Last reviewer: ${item.lastReviewer || 'Unassigned'}`,
    `ECO: ${item.eco || 'N/A'}`,
  ];
  metaItems.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    drawerMeta.appendChild(li);
  });

  item.history.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    drawerHistory.appendChild(li);
  });

  item.approvals.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    drawerApprovals.appendChild(li);
  });

  drawerPanel.focus();
};

const closeDrawer = () => {
  if (!drawer) {
    return;
  }
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
};

if (drawer) {
  drawer.addEventListener('click', (event) => {
    if (event.target.matches('[data-close]')) {
      closeDrawer();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDrawer();
  }
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    localStorage.setItem('pdmSearch', searchInput.value);
    renderVault();
  });
}

filterPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    filterPills.forEach((item) => item.classList.remove('pill--active'));
    pill.classList.add('pill--active');
    vaultFilter = pill.dataset.filter || 'all';
    localStorage.setItem('pdmFilter', vaultFilter);
    renderVault();
  });
});

sortButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.sort;
    const direction = sortState.key === key && sortState.direction === 'asc' ? 'desc' : 'asc';
    sortState = { key, direction };
    localStorage.setItem('pdmSort', JSON.stringify(sortState));
    renderProjects(sortProjects(projectData));
  });
});

const sortProjects = (projects) => {
  const { key, direction } = sortState;
  return [...projects].sort((a, b) => {
    const left = normalize(a[key]);
    const right = normalize(b[key]);
    if (left < right) return direction === 'asc' ? -1 : 1;
    if (left > right) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const validateData = (data) => ({
  projects: Array.isArray(data.projects) ? data.projects : [],
  activity: Array.isArray(data.activity) ? data.activity : [],
  workflow: Array.isArray(data.workflow) ? data.workflow : [],
  vault: Array.isArray(data.vault) ? data.vault : [],
  security: Array.isArray(data.security) ? data.security : [],
  timeline: Array.isArray(data.timeline) ? data.timeline : [],
  audit: Array.isArray(data.audit) ? data.audit : [],
  kpis: Array.isArray(data.kpis) ? data.kpis : [],
  ecos: Array.isArray(data.ecos) ? data.ecos : [],
  releaseGates: Array.isArray(data.releaseGates) ? data.releaseGates : [],
  sla: Array.isArray(data.sla) ? data.sla : [],
  conflicts: Array.isArray(data.conflicts) ? data.conflicts : [],
  bom: Array.isArray(data.bom) ? data.bom : [],
  permissions: Array.isArray(data.permissions) ? data.permissions : [],
  diffSummary: Array.isArray(data.diffSummary) ? data.diffSummary : [],
  viewer: data.viewer || null,
});

const restoreState = () => {
  const savedFilter = localStorage.getItem('pdmFilter');
  const savedSearch = localStorage.getItem('pdmSearch');
  const savedPage = localStorage.getItem('pdmPage');
  const savedSort = localStorage.getItem('pdmSort');
  const hashPage = window.location.hash.replace('#', '');

  vaultFilter = savedFilter || vaultFilter;
  if (searchInput && savedSearch !== null) {
    searchInput.value = savedSearch;
  }
  if (savedSort) {
    try {
      sortState = JSON.parse(savedSort);
    } catch {
      sortState = { key: 'name', direction: 'asc' };
    }
  }
  currentPage = hashPage || savedPage || 'dashboard';

  filterPills.forEach((pill) => {
    pill.classList.toggle('pill--active', (pill.dataset.filter || 'all') === vaultFilter);
  });
  navItems.forEach((item) => {
    item.classList.toggle('nav__item--active', item.dataset.page === currentPage);
  });
  showPage(currentPage);
};

const applyData = (data) => {
  const sanitized = validateData(data);
  projectData = sanitized.projects;
  vaultData = sanitized.vault;
  renderProjects(sortProjects(projectData));
  renderActivity(sanitized.activity);
  renderWorkflow(sanitized.workflow);
  renderSecurity(sanitized.security);
  renderTimeline(sanitized.timeline);
  renderAudit(sanitized.audit);
  renderKpis(sanitized.kpis);
  renderEcoQueue(sanitized.ecos);
  renderReleaseGates(sanitized.releaseGates);
  renderSla(sanitized.sla);
  renderConflicts(sanitized.conflicts);
  renderBom(sanitized.bom);
  renderPermissions(sanitized.permissions);
  renderDiffSummary(sanitized.diffSummary);
  if (sanitized.viewer) {
    renderViewerPreview(sanitized.viewer);
  }
  renderVault();
};

setSkeletons(true);
restoreState();

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    banner.hidden = true;
    applyData(data);
  })
  .catch(() => {
    banner.hidden = false;
    applyData({});
  })
  .finally(() => {
    setSkeletons(false);
  });
