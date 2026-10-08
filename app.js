import { EXAM_DOMAINS, KNOWLEDGE_MODULES } from './data/domains.js';
import { CASE_STUDIES } from './data/caseStudies.js';
import { DECISION_TREES, KEYWORD_DECODER, FLASHCARDS } from './data/decisionTrees.js';
import { EXAM_QUESTIONS } from './data/questions.js';

const STORAGE_KEY = 'gcp_pca_architect_hub_v1';

// Application State
const state = {
  currentView: 'dashboard',
  activeKnowledgeId: KNOWLEDGE_MODULES[0].id,
  knowledgeSearch: '',
  activeCaseStudyId: CASE_STUDIES[0].id,
  activeTreeId: 'compute',
  treeCurrentNode: DECISION_TREES.compute.startNode,
  treeHistory: [],
  decoderSearch: '',
  decoderCategory: 'ALL',
  flashcardIndex: 0,
  flashcardFlipped: false,

  // Simulator State
  simState: {
    active: false,
    mode: 'tutor', // 'tutor' | 'timed'
    submitted: false,
    questions: [],
    currentIndex: 0,
    userAnswers: {}, // { questionId: ['A', 'B'] }
    revealedInTutor: {}, // { questionId: true }
    flagged: {}, // { questionId: true }
    remainingSeconds: 0,
    timerId: null,
    filterDomain: 'ALL',
    filterCaseStudy: 'ALL',
    questionCount: 20
  },

  // Persisted User Progress
  progress: {
    masteredModules: [], // module IDs
    questionStats: {}, // { qId: { correct: boolean, attempts: number } }
    bookmarks: [], // question IDs
    examHistory: [] // [{ date, mode, scorePct, correctCount, totalCount }]
  }
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.progress = {
        masteredModules: parsed.masteredModules || [],
        questionStats: parsed.questionStats || {},
        bookmarks: parsed.bookmarks || [],
        examHistory: parsed.examHistory || []
      };
    }
  } catch (e) {
    console.warn('Could not load saved progress:', e);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch (e) {
    console.warn('Could not save progress:', e);
  }
  updateGlobalMetrics();
}

// Helper: Format Markdown-style bold and inline code safely
function formatRichText(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

function computeReadinessScore() {
  const totalModules = KNOWLEDGE_MODULES.length;
  const masteredModCount = state.progress.masteredModules.length;
  const moduleWeight = (masteredModCount / totalModules) * 35; // 35% from studying deep-dive pillars

  const totalQs = EXAM_QUESTIONS.length;
  const correctQs = Object.values(state.progress.questionStats).filter(s => s.correct).length;
  const questionWeight = (correctQs / totalQs) * 65; // 65% from mastering scenario questions

  return Math.min(100, Math.round(moduleWeight + questionWeight));
}

function updateGlobalMetrics() {
  const readiness = computeReadinessScore();
  const masteredMods = state.progress.masteredModules.length;
  const totalMods = KNOWLEDGE_MODULES.length;
  const correctQs = Object.values(state.progress.questionStats).filter(s => s.correct).length;
  const totalQs = EXAM_QUESTIONS.length;

  document.getElementById('sidebar-readiness-pct').textContent = `${readiness}%`;
  document.getElementById('sidebar-readiness-bar').style.width = `${readiness}%`;

  const hintEl = document.getElementById('sidebar-readiness-status');
  if (readiness >= 80) {
    hintEl.textContent = '🌟 Exam Ready! You exceed the 70% PCA passing benchmark.';
  } else if (readiness >= 50) {
    hintEl.textContent = 'Solid progress. Review remaining case studies and weak domains.';
  } else {
    hintEl.textContent = 'Study the 6 GCP pillars & 4 case studies, then run simulations.';
  }

  document.getElementById('nav-badge-modules').textContent = `${masteredMods}/${totalMods}`;
  document.getElementById('nav-badge-questions').textContent = `${totalQs} Qs`;
  document.getElementById('top-pillars-count').textContent = `${masteredMods} / ${totalMods}`;
  document.getElementById('top-questions-count').textContent = `${correctQs} / ${totalQs}`;
  document.getElementById('top-bookmarks-count').textContent = `${state.progress.bookmarks.length}`;
}

function switchView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  const titles = {
    dashboard: 'Readiness Command Center & Domain Mastery',
    knowledge: 'Google Cloud Deep-Dive Architectural Encyclopedia',
    casestudies: '4 Official PCA Case Studies & Blueprints',
    decisiontrees: 'Interactive GCP Service Decision Trees',
    decoder: 'Exam Keyword Decoder & Active Recall Flashcards',
    simulator: 'Professional Cloud Architect Exam Simulator'
  };
  document.getElementById('topbar-title').textContent = titles[viewName] || 'PCA Architect Hub';
  document.getElementById('sidebar').classList.remove('open');

  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const container = document.getElementById('content-area');
  switch (state.currentView) {
    case 'dashboard':
      renderDashboard(container);
      break;
    case 'knowledge':
      renderKnowledgeView(container);
      break;
    case 'casestudies':
      renderCaseStudiesView(container);
      break;
    case 'decisiontrees':
      renderDecisionTreesView(container);
      break;
    case 'decoder':
      renderDecoderView(container);
      break;
    case 'simulator':
      renderSimulatorView(container);
      break;
  }
}

// ============================================================================
// VIEW 1: DASHBOARD
// ============================================================================
function renderDashboard(container) {
  const readiness = computeReadinessScore();
  const totalQs = EXAM_QUESTIONS.length;
  const answeredQs = Object.keys(state.progress.questionStats).length;
  const correctQs = Object.values(state.progress.questionStats).filter(s => s.correct).length;
  const accuracyPct = answeredQs > 0 ? Math.round((correctQs / answeredQs) * 100) : 0;

  container.innerHTML = `
    <div class="hero-banner">
      <div>
        <span class="badge badge-blue" style="margin-bottom:8px;">Google Cloud Certification Blueprint</span>
        <h2>Professional Cloud Architect (PCA) Mastery Suite</h2>
        <p>
          The Google Cloud PCA exam tests real-world architectural trade-offs: <strong>50–60 scenario questions in 120 minutes</strong>
          (passing threshold ~70%), with roughly <strong>25–30% of questions tied directly to the 4 Official Case Studies</strong>.
          Master the deep cloud architecture first, decode the case studies, and test yourself under realistic exam conditions.
        </p>
      </div>
      <div class="hero-actions">
        <button class="btn btn-primary" data-goto="knowledge">🏛️ Explore Deep-Dive Knowledge</button>
        <button class="btn btn-outline" data-goto="casestudies">📋 Study 4 Case Studies</button>
        <button class="btn btn-success" id="dash-start-sim-btn">🎯 Take Practice Exam</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Overall Readiness</div>
        <div class="kpi-value" style="color: ${readiness >= 75 ? 'var(--gcp-green)' : 'var(--gcp-blue)'}">${readiness}%</div>
        <div class="kpi-sub">Target: 75%+ before sitting for real exam</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Scenario Accuracy</div>
        <div class="kpi-value" style="color: ${accuracyPct >= 70 ? 'var(--gcp-green)' : 'var(--gcp-yellow)'}">${accuracyPct}%</div>
        <div class="kpi-sub">${correctQs} correct of ${answeredQs} attempted (${totalQs} total)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Knowledge Pillars</div>
        <div class="kpi-value">${state.progress.masteredModules.length} / ${KNOWLEDGE_MODULES.length}</div>
        <div class="kpi-sub">Core GCP Architecture Domains</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Official Case Studies</div>
        <div class="kpi-value">4 Blueprints</div>
        <div class="kpi-sub">EHR, HRL, Mountkirk, TerramEarth</div>
      </div>
    </div>

    <div class="two-col-grid">
      <div class="panel-card">
        <div class="panel-header">
          <h3 class="panel-title">6 Official PCA Exam Sections & Mastery Breakdown</h3>
          <span class="badge badge-blue">Official Exam Guide Weights</span>
        </div>
        ${EXAM_DOMAINS.map(dom => {
          const domQs = EXAM_QUESTIONS.filter(q => q.domainId === dom.id);
          const domCorrect = domQs.filter(q => state.progress.questionStats[q.id]?.correct).length;
          const domPct = domQs.length ? Math.round((domCorrect / domQs.length) * 100) : 0;
          return `
            <div class="domain-row">
              <div class="domain-row-top">
                <div class="domain-title-wrap">
                  <span class="domain-weight-pill" style="color:${dom.color}; border:1px solid ${dom.color}44;">
                    ${dom.number} • ~${dom.weight}% of Exam
                  </span>
                  <strong>${dom.title}</strong>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:0.8rem; color:var(--text-secondary);">${domCorrect}/${domQs.length} Qs (${domPct}%)</span>
                  <button class="btn btn-outline btn-sm" data-practice-domain="${dom.id}">Practice</button>
                </div>
              </div>
              <p class="domain-summary">${dom.summary}</p>
              <div class="progress-track" style="height:6px;">
                <div class="progress-fill" style="width:${domPct}%; background:${dom.color};"></div>
              </div>
              <div class="domain-topics">
                ${dom.keyTopics.map(t => `<span class="topic-chip">${t}</span>`).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div>
        <div class="panel-card">
          <div class="panel-header">
            <h3 class="panel-title">4 Official Case Studies Quick-Launch</h3>
            <span class="badge badge-red">~25-30% of Exam</span>
          </div>
          <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:14px;">
            Knowing the 4 case studies cold saves 20+ minutes on exam day because you won't need to re-read the exhibit walls of text during the timer.
          </p>
          ${CASE_STUDIES.map(cs => {
            const csQs = EXAM_QUESTIONS.filter(q => q.caseStudyId === cs.id);
            const csCorrect = csQs.filter(q => state.progress.questionStats[q.id]?.correct).length;
            return `
              <div class="domain-row" style="border-left: 4px solid ${cs.badgeColor};">
                <div class="domain-row-top">
                  <strong>${cs.name}</strong>
                  <span class="badge badge-blue">${csCorrect}/${csQs.length} Qs Mastered</span>
                </div>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">${cs.shortDesc}</p>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-outline btn-sm" data-open-cs="${cs.id}">Read Blueprint</button>
                  <button class="btn btn-primary btn-sm" data-practice-cs="${cs.id}">Quiz (${csQs.length} Qs)</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="panel-card">
          <div class="panel-header">
            <h3 class="panel-title">Recent Simulation History</h3>
          </div>
          ${state.progress.examHistory.length === 0 ? `
            <p style="font-size:0.85rem; color:var(--text-secondary);">
              No exam simulations completed yet. Launch a Tutor or Timed session in the Exam Simulator to log your score!
            </p>
          ` : `
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${state.progress.examHistory.slice(0, 6).map(h => `
                <div class="domain-row" style="margin-bottom:0; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong>${h.mode === 'timed' ? '⏱️ Timed Simulation' : '🎓 Tutor Practice'}</strong>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${h.date} • ${h.correctCount}/${h.totalCount} Correct</div>
                  </div>
                  <span class="badge ${h.scorePct >= 70 ? 'badge-green' : 'badge-red'}">
                    ${h.scorePct}% (${h.scorePct >= 70 ? 'PASS' : 'REVIEW'})
                  </span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.goto));
  });

  document.getElementById('dash-start-sim-btn')?.addEventListener('click', () => {
    switchView('simulator');
  });

  container.querySelectorAll('[data-practice-domain]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.simState.filterDomain = btn.dataset.practiceDomain;
      state.simState.filterCaseStudy = 'ALL';
      state.simState.mode = 'tutor';
      startExamSession({ mode: 'tutor', domainId: btn.dataset.practiceDomain, caseStudyId: 'ALL', count: 15 });
      switchView('simulator');
    });
  });

  container.querySelectorAll('[data-open-cs]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCaseStudyId = btn.dataset.openCs;
      switchView('casestudies');
    });
  });

  container.querySelectorAll('[data-practice-cs]').forEach(btn => {
    btn.addEventListener('click', () => {
      startExamSession({ mode: 'tutor', domainId: 'ALL', caseStudyId: btn.dataset.practiceCs, count: 15 });
      switchView('simulator');
    });
  });
}

// ============================================================================
// VIEW 2: DEEP-DIVE GCP KNOWLEDGE ENCYCLOPEDIA
// ============================================================================
function renderKnowledgeView(container) {
  const activeMod = KNOWLEDGE_MODULES.find(m => m.id === state.activeKnowledgeId) || KNOWLEDGE_MODULES[0];
  const isMastered = state.progress.masteredModules.includes(activeMod.id);

  container.innerHTML = `
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <span class="badge badge-blue" style="margin-bottom:6px;">Deep Architectural Reference</span>
          <h2 class="panel-title" style="font-size:1.35rem;">Google Cloud Core Architecture Encyclopedia</h2>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <input type="text" class="search-input" id="knowledge-search-input" placeholder="Search services, SLAs, CLI commands, traps (e.g., Workload Identity, Spanner)..." value="${state.knowledgeSearch}" />
        </div>
      </div>

      <div class="module-tabs">
        ${KNOWLEDGE_MODULES.map(m => {
          const done = state.progress.masteredModules.includes(m.id);
          return `
            <button class="module-tab-btn ${m.id === activeMod.id ? 'active' : ''}" data-mod-id="${m.id}">
              <span>${done ? '✅' : '📘'}</span>
              <span>${m.category}</span>
            </button>
          `;
        }).join('')}
      </div>

      <div id="knowledge-module-body">
        ${renderKnowledgeModuleContent(activeMod, isMastered)}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-mod-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeKnowledgeId = btn.dataset.modId;
      renderKnowledgeView(container);
    });
  });

  const searchInput = document.getElementById('knowledge-search-input');
  searchInput?.addEventListener('input', (e) => {
    state.knowledgeSearch = e.target.value;
    const bodyEl = document.getElementById('knowledge-module-body');
    if (state.knowledgeSearch.trim().length > 1) {
      bodyEl.innerHTML = renderKnowledgeSearchResults(state.knowledgeSearch.trim());
    } else {
      bodyEl.innerHTML = renderKnowledgeModuleContent(
        activeMod,
        state.progress.masteredModules.includes(activeMod.id)
      );
      bindModuleMasteryButton(container, activeMod.id);
    }
  });

  bindModuleMasteryButton(container, activeMod.id);
}

function bindModuleMasteryButton(container, modId) {
  const btn = document.getElementById('toggle-mastery-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const idx = state.progress.masteredModules.indexOf(modId);
      if (idx === -1) {
        state.progress.masteredModules.push(modId);
      } else {
        state.progress.masteredModules.splice(idx, 1);
      }
      saveProgress();
      renderKnowledgeView(container);
    });
  }
}

function renderKnowledgeModuleContent(mod, isMastered) {
  return `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--border-subtle);">
      <div>
        <h3 style="font-size:1.3rem; margin-bottom:4px;">${mod.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem;">${mod.tagline}</p>
      </div>
      <button class="btn ${isMastered ? 'btn-success' : 'btn-outline'}" id="toggle-mastery-btn">
        ${isMastered ? '✓ Pillar Marked as Mastered' : 'Mark Pillar as Mastered'}
      </button>
    </div>

    <div class="module-section-block" style="border-left: 4px solid var(--gcp-blue);">
      <h4>Architectural Overview</h4>
      <p style="font-size:0.93rem; color:#e5e7eb;">${formatRichText(mod.overview)}</p>
    </div>

    ${mod.sections.map(sec => `
      <div class="module-section-block">
        <h4>${sec.heading}</h4>
        <ul class="knowledge-list">
          ${sec.content.map(item => `<li>${formatRichText(item)}</li>`).join('')}
        </ul>
      </div>
    `).join('')}

    <div class="module-section-block">
      <h4>📊 Architect Comparison & Trade-Off Matrix</h4>
      <div class="table-responsive">
        <table class="arch-table">
          <thead>
            <tr>
              ${mod.comparisonTable.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${mod.comparisonTable.rows.map(row => `
              <tr>
                ${row.map((cell, i) => `<td>${i === 0 ? `<strong>${cell}</strong>` : formatRichText(cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="module-section-block">
      <h4>⚠️ Classic PCA Exam Traps vs. Architectural Reality</h4>
      ${mod.examTraps.map(t => `
        <div class="trap-card">
          <div class="trap-title">❌ EXAM TRAP / DISTRACTOR:</div>
          <div style="font-size:0.9rem; color:#e5e7eb;">${formatRichText(t.trap)}</div>
          <div class="reality-title">✅ ARCHITECTURAL REALITY:</div>
          <div style="font-size:0.9rem; color:#e5e7eb;">${formatRichText(t.reality)}</div>
        </div>
      `).join('')}
    </div>

    <div class="module-section-block">
      <h4>💻 Essential gcloud / bq CLI Reference</h4>
      <pre class="code-block"><code>${mod.cliExamples}</code></pre>
    </div>
  `;
}

function renderKnowledgeSearchResults(query) {
  const qLower = query.toLowerCase();
  const matches = [];
  KNOWLEDGE_MODULES.forEach(mod => {
    mod.sections.forEach(sec => {
      sec.content.forEach(bullet => {
        if (bullet.toLowerCase().includes(qLower) || sec.heading.toLowerCase().includes(qLower)) {
          matches.push({ category: mod.category, heading: sec.heading, text: bullet });
        }
      });
    });
    mod.examTraps.forEach(trap => {
      if (trap.trap.toLowerCase().includes(qLower) || trap.reality.toLowerCase().includes(qLower)) {
        matches.push({
          category: `${mod.category} (Exam Trap)`,
          heading: 'Exam Trap vs. Reality',
          text: `**Trap:** ${trap.trap}\n**Reality:** ${trap.reality}`
        });
      }
    });
  });

  if (matches.length === 0) {
    return `<p style="color:var(--text-secondary); padding:20px 0;">No deep-dive items matched "${query}". Try searching for Spanner, GKE, VPC, KMS, DLP, or Sinks.</p>`;
  }

  return `
    <div style="margin-bottom:14px;">
      <span class="badge badge-green">Found ${matches.length} Matching Architectural Insights for "${query}"</span>
    </div>
    ${matches.map(m => `
      <div class="module-section-block">
        <div style="font-size:0.75rem; color:var(--gcp-blue); font-weight:700; margin-bottom:4px;">${m.category}</div>
        <h4 style="margin-bottom:8px;">${m.heading}</h4>
        <div style="font-size:0.92rem; color:#e5e7eb;">${formatRichText(m.text)}</div>
      </div>
    `).join('')}
  `;
}

// ============================================================================
// VIEW 3: 4 OFFICIAL CASE STUDIES LAB
// ============================================================================
function renderCaseStudiesView(container) {
  const cs = CASE_STUDIES.find(c => c.id === state.activeCaseStudyId) || CASE_STUDIES[0];
  const csQuestions = EXAM_QUESTIONS.filter(q => q.caseStudyId === cs.id);

  container.innerHTML = `
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <span class="badge badge-red" style="margin-bottom:6px;">Official Google Cloud PCA Case Studies</span>
          <h2 class="panel-title" style="font-size:1.35rem;">Case Study Architecture Blueprints & Requirement Mapping</h2>
        </div>
        <button class="btn btn-primary" id="cs-practice-btn">
          🎯 Practice ${cs.name} Questions (${csQuestions.length} Qs)
        </button>
      </div>

      <div class="module-tabs">
        ${CASE_STUDIES.map(item => `
          <button class="module-tab-btn ${item.id === cs.id ? 'active' : ''}" data-cs-id="${item.id}">
            <span style="width:10px; height:10px; border-radius:50%; background:${item.badgeColor}; display:inline-block;"></span>
            <span>${item.name}</span>
          </button>
        `).join('')}
      </div>

      ${renderCaseStudyDetailHTML(cs)}
    </div>
  `;

  container.querySelectorAll('[data-cs-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCaseStudyId = btn.dataset.csId;
      renderCaseStudiesView(container);
    });
  });

  document.getElementById('cs-practice-btn')?.addEventListener('click', () => {
    startExamSession({ mode: 'tutor', domainId: 'ALL', caseStudyId: cs.id, count: 15 });
    switchView('simulator');
  });
}

function renderCaseStudyDetailHTML(cs) {
  return `
    <div class="module-section-block" style="border-left: 4px solid ${cs.badgeColor};">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
        <h3 style="font-size:1.3rem;">${cs.name}</h3>
        <span class="badge badge-blue">${cs.industry}</span>
      </div>
      <p style="font-size:0.93rem; color:#e5e7eb; margin-bottom:14px;">${cs.companyOverview}</p>
      <h4 style="margin-top:14px;">Existing Technical Environment</h4>
      <ul class="knowledge-list">
        ${cs.existingEnvironment.map(e => `<li>${formatRichText(e)}</li>`).join('')}
      </ul>
    </div>

    <div class="two-col-grid">
      <div class="module-section-block" style="margin-bottom:0;">
        <h4>📈 Business Requirements</h4>
        <ul class="knowledge-list">
          ${cs.businessRequirements.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      <div class="module-section-block" style="margin-bottom:0;">
        <h4>⚙️ Technical Requirements</h4>
        <ul class="knowledge-list">
          ${cs.technicalRequirements.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="module-section-block">
      <h4>🏗️ Target Google Cloud Reference Architecture Data Flow</h4>
      ${cs.architectureBlueprint.diagramSteps.map((step, i) => `
        <div class="arch-flow-step">
          <strong>Layer ${i + 1}:</strong> ${step}
        </div>
      `).join('')}
    </div>

    <div class="module-section-block">
      <h4>🎯 Line-by-Line Requirement → GCP Service Translation (What the Exam Tests!)</h4>
      ${cs.architectureBlueprint.mappings.map(m => `
        <div class="mapping-card">
          <div class="mapping-req"><strong>Case Study Requirement:</strong> "${m.requirement}"</div>
          <div class="mapping-sol">➜ Recommended GCP Solution: ${formatRichText(m.gcpSolution)}</div>
          <div class="mapping-why"><strong>Architectural Rationale:</strong> ${formatRichText(m.why)}</div>
        </div>
      `).join('')}
    </div>

    <div class="module-section-block">
      <h4>🚨 Specific Exam Traps for ${cs.name}</h4>
      ${cs.examTraps.map(trap => `
        <div class="trap-card">
          <div style="font-size:0.92rem; color:#e5e7eb;">${formatRichText(trap)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// VIEW 4: INTERACTIVE ARCHITECTURE DECISION TREES
// ============================================================================
function renderDecisionTreesView(container) {
  const tree = DECISION_TREES[state.activeTreeId];
  const node = tree.nodes[state.treeCurrentNode];

  container.innerHTML = `
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <span class="badge badge-green" style="margin-bottom:6px;">Interactive Architecture Advisor</span>
          <h2 class="panel-title" style="font-size:1.35rem;">"Which Google Cloud Service Should I Choose?"</h2>
        </div>
        <button class="btn btn-outline btn-sm" id="reset-tree-btn">↺ Restart Decision Tree</button>
      </div>

      <div class="module-tabs">
        ${Object.values(DECISION_TREES).map(t => `
          <button class="module-tab-btn ${t.id === state.activeTreeId ? 'active' : ''}" data-tree-id="${t.id}">
            <span>🧭</span>
            <span>${t.title}</span>
          </button>
        `).join('')}
      </div>

      <div class="wizard-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span style="font-size:0.84rem; color:var(--text-secondary);">${tree.subtitle}</span>
          ${state.treeHistory.length > 0 ? `<button class="btn btn-outline btn-sm" id="tree-back-btn">← Previous Step</button>` : ''}
        </div>

        ${node.isResult ? `
          <div class="wizard-result-card">
            <span class="badge badge-green" style="margin-bottom:10px;">${node.badge}</span>
            <h3 style="font-size:1.6rem; color:#fff; margin-bottom:12px;">Recommended: ${node.service}</h3>
            <p style="font-size:0.98rem; color:#e5e7eb; margin-bottom:16px;">
              <strong>Why this wins on the PCA Exam:</strong><br/>
              ${formatRichText(node.why)}
            </p>
            <div class="trap-card" style="margin-bottom:18px;">
              <div class="trap-title">⚠️ When to Avoid / Common Distractor:</div>
              <div style="font-size:0.9rem;">${formatRichText(node.avoid)}</div>
            </div>
            <button class="btn btn-primary" id="tree-start-over-btn">Test Another Scenario</button>
          </div>
        ` : `
          <div class="wizard-question">${node.question}</div>
          <div class="wizard-options">
            ${node.options.map((opt, idx) => `
              <button class="wizard-option-btn" data-next-node="${opt.next}">
                <span>${opt.label}</span>
                <span style="color:var(--gcp-blue); font-weight:700;">Select →</span>
              </button>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-tree-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTreeId = btn.dataset.treeId;
      state.treeCurrentNode = DECISION_TREES[state.activeTreeId].startNode;
      state.treeHistory = [];
      renderDecisionTreesView(container);
    });
  });

  container.querySelectorAll('[data-next-node]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.treeHistory.push(state.treeCurrentNode);
      state.treeCurrentNode = btn.dataset.nextNode;
      renderDecisionTreesView(container);
    });
  });

  document.getElementById('tree-back-btn')?.addEventListener('click', () => {
    if (state.treeHistory.length > 0) {
      state.treeCurrentNode = state.treeHistory.pop();
      renderDecisionTreesView(container);
    }
  });

  const resetHandler = () => {
    state.treeCurrentNode = DECISION_TREES[state.activeTreeId].startNode;
    state.treeHistory = [];
    renderDecisionTreesView(container);
  };
  document.getElementById('reset-tree-btn')?.addEventListener('click', resetHandler);
  document.getElementById('tree-start-over-btn')?.addEventListener('click', resetHandler);
}

// ============================================================================
// VIEW 5: EXAM KEYWORD DECODER & FLASHCARDS
// ============================================================================
function renderDecoderView(container) {
  const categories = ['ALL', ...new Set(KEYWORD_DECODER.map(k => k.category))];
  const filteredKeywords = KEYWORD_DECODER.filter(item => {
    const matchCat = state.decoderCategory === 'ALL' || item.category === state.decoderCategory;
    const q = state.decoderSearch.toLowerCase();
    const matchText = !q ||
      item.trigger.toLowerCase().includes(q) ||
      item.service.toLowerCase().includes(q) ||
      item.note.toLowerCase().includes(q);
    return matchCat && matchText;
  });

  const card = FLASHCARDS[state.flashcardIndex];

  container.innerHTML = `
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <span class="badge badge-yellow" style="margin-bottom:6px;">Active Recall Trainer</span>
          <h3 class="panel-title">PCA Rapid-Fire Architecture Flashcards (${state.flashcardIndex + 1} / ${FLASHCARDS.length})</h3>
        </div>
        <span style="font-size:0.82rem; color:var(--text-secondary);">Click the card to flip between Question and Architectural Answer</span>
      </div>

      <div class="flashcard-stage">
        <div class="flashcard-box ${state.flashcardFlipped ? 'flipped' : ''}" id="flashcard-box">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
            <span class="badge ${state.flashcardFlipped ? 'badge-green' : 'badge-blue'}">
              ${state.flashcardFlipped ? 'ARCHITECTURAL ANSWER' : `QUESTION • ${card.category}`}
            </span>
            <span style="font-size:0.78rem; color:var(--text-secondary);">Click anywhere on card to flip ↻</span>
          </div>
          <div style="font-size:1.08rem; color:#fff;">
            ${formatRichText(state.flashcardFlipped ? card.back : card.front)}
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
          <button class="btn btn-outline btn-sm" id="fc-prev-btn">← Previous Card</button>
          <button class="btn btn-primary btn-sm" id="fc-flip-btn">Flip Card ↻</button>
          <button class="btn btn-outline btn-sm" id="fc-next-btn">Next Card →</button>
        </div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-header">
        <div>
          <span class="badge badge-blue" style="margin-bottom:6px;">Instant Pattern Recognition</span>
          <h3 class="panel-title">PCA Exam Keyword Trigger Decoder (${filteredKeywords.length} Patterns)</h3>
        </div>
      </div>

      <div class="filter-bar">
        <input type="text" class="search-input" id="decoder-search-input" placeholder="Filter by exam trigger keyword or service (e.g., POSIX, exfiltration, late-arriving, BYOL)..." value="${state.decoderSearch}" />
        <select class="select-input" id="decoder-cat-select">
          ${categories.map(c => `<option value="${c}" ${c === state.decoderCategory ? 'selected' : ''}>Category: ${c}</option>`).join('')}
        </select>
      </div>

      <div class="table-responsive">
        <table class="arch-table">
          <thead>
            <tr>
              <th style="width:34%;">When the Exam Prompt Mentions...</th>
              <th style="width:24%;">Choose This GCP Solution</th>
              <th style="width:12%;">Domain</th>
              <th style="width:30%;">Critical Exam Nuance / Distractor Warning</th>
            </tr>
          </thead>
          <tbody>
            ${filteredKeywords.map(k => `
              <tr>
                <td><strong>"${k.trigger}"</strong></td>
                <td style="color:#81c995; font-weight:700;">${k.service}</td>
                <td><span class="badge badge-blue">${k.category}</span></td>
                <td>${formatRichText(k.note)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const flipCard = () => {
    state.flashcardFlipped = !state.flashcardFlipped;
    renderDecoderView(container);
  };
  document.getElementById('flashcard-box')?.addEventListener('click', flipCard);
  document.getElementById('fc-flip-btn')?.addEventListener('click', flipCard);

  document.getElementById('fc-prev-btn')?.addEventListener('click', () => {
    state.flashcardIndex = (state.flashcardIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length;
    state.flashcardFlipped = false;
    renderDecoderView(container);
  });

  document.getElementById('fc-next-btn')?.addEventListener('click', () => {
    state.flashcardIndex = (state.flashcardIndex + 1) % FLASHCARDS.length;
    state.flashcardFlipped = false;
    renderDecoderView(container);
  });

  document.getElementById('decoder-search-input')?.addEventListener('input', (e) => {
    state.decoderSearch = e.target.value;
    renderDecoderView(container);
    const input = document.getElementById('decoder-search-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });

  document.getElementById('decoder-cat-select')?.addEventListener('change', (e) => {
    state.decoderCategory = e.target.value;
    renderDecoderView(container);
  });
}

// ============================================================================
// VIEW 6: EXAM SIMULATOR (TUTOR MODE + TIMED FULL EXAM SIMULATION)
// ============================================================================
function startExamSession({ mode = 'tutor', domainId = 'ALL', caseStudyId = 'ALL', onlyBookmarked = false, count = 25 }) {
  stopExamTimer();

  let pool = [...EXAM_QUESTIONS];
  if (domainId !== 'ALL') {
    pool = pool.filter(q => q.domainId === domainId);
  }
  if (caseStudyId !== 'ALL') {
    if (caseStudyId === 'NONE') {
      pool = pool.filter(q => !q.caseStudyId);
    } else {
      pool = pool.filter(q => q.caseStudyId === caseStudyId);
    }
  }
  if (onlyBookmarked) {
    pool = pool.filter(q => state.progress.bookmarks.includes(q.id));
  }

  // Shuffle questions for realistic simulation
  pool.sort(() => Math.random() - 0.5);
  const selected = pool.slice(0, Math.min(count, pool.length));

  state.simState = {
    active: selected.length > 0,
    mode,
    submitted: false,
    questions: selected,
    currentIndex: 0,
    userAnswers: {},
    revealedInTutor: {},
    flagged: {},
    remainingSeconds: selected.length * 140, // ~2.3 mins per question (realistic 120m / 50Q pace)
    timerId: null,
    filterDomain: domainId,
    filterCaseStudy: caseStudyId,
    questionCount: count
  };

  if (mode === 'timed' && selected.length > 0) {
    state.simState.timerId = setInterval(() => {
      if (state.simState.remainingSeconds > 0 && !state.simState.submitted) {
        state.simState.remainingSeconds--;
        const timerEl = document.getElementById('sim-timer-display');
        if (timerEl) {
          timerEl.textContent = formatTimeMMSS(state.simState.remainingSeconds);
        }
      } else if (state.simState.remainingSeconds <= 0 && !state.simState.submitted) {
        submitExamSession();
      }
    }, 1000);
  }
}

function stopExamTimer() {
  if (state.simState.timerId) {
    clearInterval(state.simState.timerId);
    state.simState.timerId = null;
  }
}

function formatTimeMMSS(totalSec) {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function isQuestionCorrect(question, selectedIds = []) {
  if (selectedIds.length !== question.correctIds.length) return false;
  return question.correctIds.every(id => selectedIds.includes(id));
}

function submitExamSession() {
  stopExamTimer();
  state.simState.submitted = true;

  let correctCount = 0;
  state.simState.questions.forEach(q => {
    const ans = state.simState.userAnswers[q.id] || [];
    const ok = isQuestionCorrect(q, ans);
    if (ok) correctCount++;
    state.progress.questionStats[q.id] = {
      correct: ok,
      attempts: (state.progress.questionStats[q.id]?.attempts || 0) + 1
    };
  });

  const totalCount = state.simState.questions.length;
  const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  state.progress.examHistory.unshift({
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    mode: state.simState.mode,
    scorePct,
    correctCount,
    totalCount
  });

  saveProgress();
  if (state.currentView === 'simulator') {
    renderSimulatorView(document.getElementById('content-area'));
  }
}

function renderSimulatorView(container) {
  if (!state.simState.active) {
    renderSimulatorLauncher(container);
    return;
  }

  if (state.simState.submitted) {
    renderSimulatorReport(container);
    return;
  }

  const sim = state.simState;
  const q = sim.questions[sim.currentIndex];
  const selectedIds = sim.userAnswers[q.id] || [];
  const isRevealed = sim.mode === 'tutor' && sim.revealedInTutor[q.id];
  const isBookmarked = state.progress.bookmarks.includes(q.id);
  const isFlagged = !!sim.flagged[q.id];
  const domainObj = EXAM_DOMAINS.find(d => d.id === q.domainId);
  const caseStudyObj = q.caseStudyId ? CASE_STUDIES.find(c => c.id === q.caseStudyId) : null;

  container.innerHTML = `
    <div class="exam-layout">
      <!-- Left Column: Active Question -->
      <div class="question-card">
        <div class="question-meta-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="badge badge-blue">Question ${sim.currentIndex + 1} of ${sim.questions.length}</span>
            <span class="badge badge-yellow">${domainObj ? domainObj.number : 'Domain'}</span>
            <span class="badge ${q.difficulty === 'Hard' ? 'badge-red' : 'badge-green'}">${q.difficulty}</span>
            ${q.multiSelect ? `<span class="badge badge-red">Multi-Select (Choose ${q.correctIds.length})</span>` : ''}
            ${caseStudyObj ? `
              <button class="btn btn-primary btn-sm" id="open-cs-exhibit-btn" style="padding:4px 10px;">
                📋 Open Exhibit: ${caseStudyObj.name}
              </button>
            ` : ''}
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" id="flag-q-btn">
              ${isFlagged ? '⚑ Flagged for Review' : '⚐ Flag'}
            </button>
            <button class="btn btn-outline btn-sm" id="bookmark-q-btn">
              ${isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
          </div>
        </div>

        <div class="question-stem">${formatRichText(q.stem)}</div>

        <div class="options-list">
          ${q.options.map(opt => {
            const isSelected = selectedIds.includes(opt.id);
            const isCorrectOpt = q.correctIds.includes(opt.id);
            let cls = 'option-item';
            if (isRevealed) {
              if (isCorrectOpt) cls += ' correct-reveal';
              else if (isSelected && !isCorrectOpt) cls += ' wrong-reveal';
            } else if (isSelected) {
              cls += ' selected';
            }
            return `
              <div class="${cls}" data-opt-id="${opt.id}">
                <div class="option-letter">${opt.id}</div>
                <div style="flex:1; font-size:0.95rem;">${formatRichText(opt.text)}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <button class="btn btn-outline" id="prev-q-btn" ${sim.currentIndex === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
            ← Previous
          </button>

          <div style="display:flex; gap:10px;">
            ${sim.mode === 'tutor' && !isRevealed ? `
              <button class="btn btn-primary" id="tutor-check-btn">
                ✓ Check Answer & View Architectural Breakdown
              </button>
            ` : ''}

            ${sim.currentIndex < sim.questions.length - 1 ? `
              <button class="btn btn-primary" id="next-q-btn">Next Question →</button>
            ` : `
              <button class="btn btn-success" id="finish-exam-btn">🏁 Submit & Grade Exam</button>
            `}
          </div>
        </div>

        ${isRevealed ? renderExplanationHTML(q, selectedIds) : ''}
      </div>

      <!-- Right Column: Navigator & Exam Controls -->
      <div class="panel-card" style="position:sticky; top:84px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <strong>${sim.mode === 'timed' ? '⏱️ Timed Exam Mode' : '🎓 Tutor Study Mode'}</strong>
          <button class="btn btn-danger-outline btn-sm" id="quit-sim-btn">Exit</button>
        </div>

        ${sim.mode === 'timed' ? `
          <div class="timer-display" id="sim-timer-display">${formatTimeMMSS(sim.remainingSeconds)}</div>
        ` : `
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:10px;">
            Instant architectural rationale enabled. Select an option and click "Check Answer".
          </p>
        `}

        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:6px;">
          Question Navigator (${Object.keys(sim.userAnswers).length}/${sim.questions.length} Answered)
        </div>
        <div class="palette-grid">
          ${sim.questions.map((item, idx) => {
            const ans = sim.userAnswers[item.id];
            const hasAns = ans && ans.length > 0;
            const rev = sim.mode === 'tutor' && sim.revealedInTutor[item.id];
            let pCls = 'palette-btn';
            if (idx === sim.currentIndex) pCls += ' current';
            if (rev) {
              pCls += isQuestionCorrect(item, ans) ? ' correct' : ' wrong';
            } else if (hasAns) {
              pCls += ' answered';
            }
            if (sim.flagged[item.id]) pCls += ' flagged';
            return `<button class="${pCls}" data-jump-idx="${idx}">${idx + 1}</button>`;
          }).join('')}
        </div>

        <button class="btn btn-success" style="width:100%; margin-top:12px;" id="sidebar-submit-exam-btn">
          🏁 Finish & View Score Report
        </button>
      </div>
    </div>
  `;

  // Option selection handler
  container.querySelectorAll('[data-opt-id]').forEach(el => {
    el.addEventListener('click', () => {
      if (isRevealed) return; // Lock after tutor reveal
      const optId = el.dataset.optId;
      const cur = sim.userAnswers[q.id] ? [...sim.userAnswers[q.id]] : [];

      if (q.multiSelect) {
        const idx = cur.indexOf(optId);
        if (idx > -1) cur.splice(idx, 1);
        else cur.push(optId);
        sim.userAnswers[q.id] = cur;
      } else {
        sim.userAnswers[q.id] = [optId];
      }
      renderSimulatorView(container);
    });
  });

  document.getElementById('tutor-check-btn')?.addEventListener('click', () => {
    sim.revealedInTutor[q.id] = true;
    const ans = sim.userAnswers[q.id] || [];
    const ok = isQuestionCorrect(q, ans);
    state.progress.questionStats[q.id] = {
      correct: ok,
      attempts: (state.progress.questionStats[q.id]?.attempts || 0) + 1
    };
    saveProgress();
    renderSimulatorView(container);
  });

  document.getElementById('prev-q-btn')?.addEventListener('click', () => {
    if (sim.currentIndex > 0) {
      sim.currentIndex--;
      renderSimulatorView(container);
    }
  });

  document.getElementById('next-q-btn')?.addEventListener('click', () => {
    if (sim.currentIndex < sim.questions.length - 1) {
      sim.currentIndex++;
      renderSimulatorView(container);
    }
  });

  container.querySelectorAll('[data-jump-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      sim.currentIndex = Number(btn.dataset.jumpIdx);
      renderSimulatorView(container);
    });
  });

  document.getElementById('flag-q-btn')?.addEventListener('click', () => {
    sim.flagged[q.id] = !sim.flagged[q.id];
    renderSimulatorView(container);
  });

  document.getElementById('bookmark-q-btn')?.addEventListener('click', () => {
    const idx = state.progress.bookmarks.indexOf(q.id);
    if (idx === -1) state.progress.bookmarks.push(q.id);
    else state.progress.bookmarks.splice(idx, 1);
    saveProgress();
    renderSimulatorView(container);
  });

  document.getElementById('open-cs-exhibit-btn')?.addEventListener('click', () => {
    if (caseStudyObj) openCaseStudyModal(caseStudyObj);
  });

  document.getElementById('finish-exam-btn')?.addEventListener('click', submitExamSession);
  document.getElementById('sidebar-submit-exam-btn')?.addEventListener('click', submitExamSession);

  document.getElementById('quit-sim-btn')?.addEventListener('click', () => {
    stopExamTimer();
    state.simState.active = false;
    renderSimulatorView(container);
  });
}

function renderExplanationHTML(q, selectedIds) {
  const isCorrect = isQuestionCorrect(q, selectedIds);
  return `
    <div class="explanation-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span class="badge ${isCorrect ? 'badge-green' : 'badge-red'}">
          ${isCorrect ? '✓ CORRECT ARCHITECTURAL CHOICE' : `✗ INCORRECT (Correct Answer: ${q.correctIds.join(', ')})`}
        </span>
      </div>
      <div style="font-size:0.94rem; color:#e5e7eb; margin-bottom:14px;">
        <strong>Core Architectural Principle:</strong><br/>
        ${formatRichText(q.explanation)}
      </div>
      <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">
        Option-by-Option Distractor Breakdown:
      </div>
      <div class="option-breakdown-list">
        ${Object.entries(q.optionBreakdown).map(([letter, text]) => {
          const isOptRight = q.correctIds.includes(letter);
          return `
            <div class="breakdown-item ${isOptRight ? 'is-correct' : 'is-wrong'}">
              <strong>Option ${letter}:</strong> ${formatRichText(text)}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderSimulatorLauncher(container) {
  container.innerHTML = `
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <span class="badge badge-blue" style="margin-bottom:6px;">Realistic PCA Assessment Engine</span>
          <h2 class="panel-title" style="font-size:1.4rem;">Configure Your Cloud Architect Exam Session</h2>
        </div>
      </div>

      <p style="color:var(--text-secondary); font-size:0.93rem; margin-bottom:22px;">
        Choose between <strong>Tutor Mode</strong> (instant answer checking with deep architectural explanations for every distractor)
        or <strong>Timed Full Simulation Mode</strong> (realistic exam timer, case study exhibit popups, no hints until final submission, and a full domain score report).
      </p>

      <div class="two-col-grid">
        <div class="module-section-block" style="margin-bottom:0;">
          <h4>1. Select Simulation Mode & Filters</h4>
          <div style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">
            <div>
              <label style="font-size:0.82rem; color:var(--text-secondary); display:block; margin-bottom:6px;">Exam Mode</label>
              <select class="select-input" id="launch-mode" style="width:100%;">
                <option value="tutor">🎓 Tutor / Study Mode (Instant Explanations & Option Breakdown)</option>
                <option value="timed">⏱️ Timed Exam Simulation (Realistic Timer, Graded at End)</option>
              </select>
            </div>

            <div>
              <label style="font-size:0.82rem; color:var(--text-secondary); display:block; margin-bottom:6px;">Filter by PCA Exam Section</label>
              <select class="select-input" id="launch-domain" style="width:100%;">
                <option value="ALL">All 6 PCA Exam Domains (${EXAM_QUESTIONS.length} Questions Available)</option>
                ${EXAM_DOMAINS.map(d => `<option value="${d.id}">${d.number}: ${d.title} (~${d.weight}%)</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="font-size:0.82rem; color:var(--text-secondary); display:block; margin-bottom:6px;">Filter by Official Case Study</label>
              <select class="select-input" id="launch-cs" style="width:100%;">
                <option value="ALL">All Questions (Case Studies + General Scenarios)</option>
                <option value="ehr-healthcare">Case Study: EHR Healthcare</option>
                <option value="helicopter-racing-league">Case Study: Helicopter Racing League (HRL)</option>
                <option value="mountkirk-games">Case Study: Mountkirk Games</option>
                <option value="terramearth">Case Study: TerramEarth</option>
                <option value="NONE">General Architectural Scenarios Only (No Case Study)</option>
              </select>
            </div>

            <div>
              <label style="font-size:0.82rem; color:var(--text-secondary); display:block; margin-bottom:6px;">Number of Questions</label>
              <select class="select-input" id="launch-count" style="width:100%;">
                <option value="10">10 Questions (Quick Drill)</option>
                <option value="25">25 Questions (Half-Length Practice)</option>
                <option value="${EXAM_QUESTIONS.length}" selected>All ${EXAM_QUESTIONS.length} Scenario Questions (Full PCA Assessment)</option>
              </select>
            </div>

            <div style="display:flex; gap:12px; margin-top:8px; flex-wrap:wrap;">
              <button class="btn btn-primary" id="btn-launch-custom">🚀 Start Configured Session</button>
              ${state.progress.bookmarks.length > 0 ? `
                <button class="btn btn-outline" id="btn-launch-bookmarks">
                  ★ Practice Bookmarked Only (${state.progress.bookmarks.length})
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="module-section-block" style="margin-bottom:0;">
          <h4>2. How to Beat Hard PCA Scenario Questions</h4>
          <ul class="knowledge-list" style="margin-top:12px;">
            <li><strong>Eliminate Anti-Patterns First:</strong> Immediately cross out any option that mentions downloading JSON Service Account keys, using <code>SELECT *</code> in BigQuery, opening port 22 to <code>0.0.0.0/0</code>, or using VPC Peering transitively.</li>
            <li><strong>Spot the Constraint Multiplier:</strong> Two options might both technically work, but if the prompt says <em>"minimize operational overhead"</em>, GKE Autopilot beats GKE Standard, and Cloud Run beats GCE MIGs.</li>
            <li><strong>Case Study Exhibit Drawer:</strong> Just like the real exam, any question referencing EHR, HRL, Mountkirk, or TerramEarth includes an <strong>"Open Exhibit"</strong> button so you can verify business & technical requirements side-by-side.</li>
            <li><strong>Passing Score Benchmark:</strong> Google Cloud sets the passing threshold around <strong>70%</strong> (scaled score 700/1000). Aim for 80%+ in Tutor and Timed simulations.</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-launch-custom')?.addEventListener('click', () => {
    const mode = document.getElementById('launch-mode').value;
    const domainId = document.getElementById('launch-domain').value;
    const caseStudyId = document.getElementById('launch-cs').value;
    const count = Number(document.getElementById('launch-count').value);
    startExamSession({ mode, domainId, caseStudyId, count });
    renderSimulatorView(container);
  });

  document.getElementById('btn-launch-bookmarks')?.addEventListener('click', () => {
    startExamSession({ mode: 'tutor', onlyBookmarked: true, count: 50 });
    renderSimulatorView(container);
  });
}

function renderSimulatorReport(container) {
  const sim = state.simState;
  let correctCount = 0;
  sim.questions.forEach(q => {
    if (isQuestionCorrect(q, sim.userAnswers[q.id] || [])) correctCount++;
  });
  const total = sim.questions.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = pct >= 70;

  container.innerHTML = `
    <div class="panel-card">
      <div class="hero-banner" style="background: ${passed ? 'rgba(52, 168, 83, 0.15)' : 'rgba(234, 67, 53, 0.15)'}; border-color: ${passed ? 'var(--gcp-green)' : 'var(--gcp-red)'};">
        <div>
          <span class="badge ${passed ? 'badge-green' : 'badge-red'}" style="margin-bottom:8px;">
            ${passed ? '✓ PASSED BENCHMARK (>= 70%)' : '⚠️ BELOW 70% PASSING THRESHOLD'}
          </span>
          <h2>Exam Diagnostic Score: ${pct}% (${correctCount} / ${total} Correct)</h2>
          <p>
            ${passed
              ? 'Excellent architectural judgment! Review any missed scenarios below to lock in 100% mastery.'
              : 'Focus on the explanations below and review the corresponding Deep-Dive Encyclopedia modules before re-testing.'}
          </p>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" id="new-sim-btn">Configure New Exam</button>
          <button class="btn btn-outline" id="retry-missed-btn">Retry Missed Questions</button>
        </div>
      </div>

      <h3 style="margin-bottom:14px;">Full Question-by-Question Architectural Review</h3>
      ${sim.questions.map((q, idx) => {
        const userAns = sim.userAnswers[q.id] || [];
        const ok = isQuestionCorrect(q, userAns);
        return `
          <div class="module-section-block" style="border-left: 4px solid ${ok ? 'var(--gcp-green)' : 'var(--gcp-red)'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <strong>Question ${idx + 1} (${q.difficulty})</strong>
              <span class="badge ${ok ? 'badge-green' : 'badge-red'}">
                Your Answer: ${userAns.length ? userAns.join(', ') : 'Unanswered'} | Correct: ${q.correctIds.join(', ')}
              </span>
            </div>
            <p style="font-size:0.96rem; margin-bottom:12px;">${formatRichText(q.stem)}</p>
            ${renderExplanationHTML(q, userAns)}
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('new-sim-btn')?.addEventListener('click', () => {
    state.simState.active = false;
    renderSimulatorView(container);
  });

  document.getElementById('retry-missed-btn')?.addEventListener('click', () => {
    const missed = sim.questions.filter(q => !isQuestionCorrect(q, sim.userAnswers[q.id] || []));
    if (missed.length === 0) {
      state.simState.active = false;
      renderSimulatorView(container);
      return;
    }
    state.simState = {
      ...state.simState,
      active: true,
      mode: 'tutor',
      submitted: false,
      questions: missed,
      currentIndex: 0,
      userAnswers: {},
      revealedInTutor: {},
      flagged: {}
    };
    renderSimulatorView(container);
  });
}

// ============================================================================
// CASE STUDY MODAL EXHIBIT
// ============================================================================
function openCaseStudyModal(cs) {
  const modal = document.getElementById('case-study-modal');
  document.getElementById('modal-cs-title').textContent = `${cs.name} — Official Case Study Exhibit`;
  document.getElementById('modal-cs-body').innerHTML = renderCaseStudyDetailHTML(cs);
  modal.classList.remove('hidden');
}

function initEventListeners() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.getElementById('quick-start-exam-btn')?.addEventListener('click', () => {
    startExamSession({ mode: 'timed', domainId: 'ALL', caseStudyId: 'ALL', count: 35 });
    switchView('simulator');
  });

  document.getElementById('close-cs-modal-btn')?.addEventListener('click', () => {
    document.getElementById('case-study-modal').classList.add('hidden');
  });

  document.getElementById('case-study-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'case-study-modal') {
      e.target.classList.add('hidden');
    }
  });

  document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
    if (confirm('Reset all saved study progress, mastered modules, and exam history?')) {
      state.progress = { masteredModules: [], questionStats: {}, bookmarks: [], examHistory: [] };
      saveProgress();
      renderCurrentView();
    }
  });
}

// Initialize App
loadProgress();
initEventListeners();
updateGlobalMetrics();
renderCurrentView();
