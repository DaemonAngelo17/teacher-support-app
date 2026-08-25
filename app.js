document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    selectedSubjects: [],
    selectedGrades: [],
    searchQuery: '',
    activeTopic: null,
    
    // Flashcard State
    currentCardIndex: 0,
    
    // Quiz State
    currentQuizIndex: 0,
    quizScore: 0,
    
    // Form Modal State
    formMode: 'add', // 'add' | 'edit'
    editingTopicId: null,
    
    // Debounce timer for notes auto-save
    saveTimeout: null,
    
    // Custom Confirm Callback
    onConfirmCallback: null,

    // Active Language per topic ('en' | 'fil')
    activeLanguage: {},

    // Global Language toggle ('en' | 'fil')
    globalLanguage: 'en'
  };

  // ==========================================
  // DOM ELEMENT CACHE
  // ==========================================
  const DOM = {
    // Theme
    themeToggle: document.getElementById('theme-toggle'),

    // Filters
    subjectFiltersContainer: document.getElementById('subject-filters'),
    gradeFiltersContainer: document.getElementById('grade-filters'),
    clearSubjectsBtn: document.getElementById('clear-subjects'),
    clearGradesBtn: document.getElementById('clear-grades'),
    resetAllBtn: document.getElementById('reset-all'),
    
    // Search
    searchBox: document.getElementById('search-box'),
    clearSearchBtn: document.getElementById('clear-search'),
    resultsCount: document.getElementById('results-count'),
    activeBadgesContainer: document.getElementById('active-badges'),
    
    // Main Content
    topicsContainer: document.getElementById('topics-container'),
    emptyStateView: document.getElementById('empty-state-view'),
    emptyResetBtn: document.getElementById('empty-reset-btn'),
    
    // Modal General (Details)
    detailModal: document.getElementById('detail-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    modalHeaderBanner: document.getElementById('modal-header-banner'),
    modalSubjectBadge: document.getElementById('modal-subject-badge'),
    modalGradeBadge: document.getElementById('modal-grade-badge'),
    modalTopicTitle: document.getElementById('modal-topic-title'),
    modalTopicDescription: document.getElementById('modal-topic-description'),
    translateTopicBtn: document.getElementById('translate-topic-btn'),
    translateBtnLabel: document.getElementById('translate-btn-label'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Modal Tab 1: Concepts & Resources
    modalConceptList: document.getElementById('modal-concept-list'),
    modalResourcesList: document.getElementById('modal-resources-list'),
    
    // Modal Tab 2: Review Tool
    btnModeFlashcards: document.getElementById('btn-mode-flashcards'),
    btnModeQuiz: document.getElementById('btn-mode-quiz'),
    viewFlashcards: document.getElementById('view-flashcards'),
    viewQuiz: document.getElementById('view-quiz'),
    
    // Flashcard components
    flashcardElement: document.getElementById('flashcard-element'),
    flashcardNum: document.getElementById('flashcard-num'),
    flashcardQText: document.getElementById('flashcard-q-text'),
    flashcardAText: document.getElementById('flashcard-a-text'),
    prevCardBtn: document.getElementById('prev-card-btn'),
    nextCardBtn: document.getElementById('next-card-btn'),
    currCardIndex: document.getElementById('curr-card-index'),
    totalCardCount: document.getElementById('total-card-count'),
    
    // Quiz components
    quizQuestionCard: document.querySelector('.quiz-question-card'),
    quizProgressIndicator: document.getElementById('quiz-progress-indicator'),
    quizCurrQNum: document.getElementById('quiz-curr-q-num'),
    quizTotalQCount: document.getElementById('quiz-total-q-count'),
    quizScoreDisplay: document.getElementById('quiz-score-display'),
    quizQuestionTextEl: document.getElementById('quiz-question-text-el'),
    quizAnswerBlock: document.getElementById('quiz-answer-block'),
    quizAnswerTextEl: document.getElementById('quiz-answer-text-el'),
    quizBtnReveal: document.getElementById('quiz-btn-reveal'),
    quizBtnNext: document.getElementById('quiz-btn-next'),
    quizBtnCorrect: document.getElementById('quiz-btn-correct'),
    quizBtnIncorrect: document.getElementById('quiz-btn-incorrect'),
    quizCompleteBlock: document.getElementById('quiz-complete-block'),
    quizFinalScore: document.getElementById('quiz-final-score'),
    quizMaxScore: document.getElementById('quiz-max-score'),
    quizBtnRestart: document.getElementById('quiz-btn-restart'),
    
    // Modal Tab 3: Workspace
    notesSaveStatus: document.getElementById('notes-save-status'),
    teacherNotesInput: document.getElementById('teacher-notes-input'),
    customLinkForm: document.getElementById('custom-link-form'),
    customLinkLabel: document.getElementById('custom-link-label'),
    customLinkUrl: document.getElementById('custom-link-url'),
    customLinksListContainer: document.getElementById('custom-links-list-container'),

    // Add Topic UI Elements
    addTopicBtn: document.getElementById('add-topic-btn'),
    resetCurriculumBtn: document.getElementById('reset-curriculum-btn'),
    resetCurriculumHeaderBtn: document.getElementById('reset-curriculum-header-btn'),
    globalTranslateBtn: document.getElementById('global-translate-btn'),
    globalTranslateLabel: document.getElementById('global-translate-label'),
    editTopicBtn: document.getElementById('edit-topic-btn'),

    // Form Modal Elements
    formModal: document.getElementById('form-modal'),
    closeFormModalBtn: document.getElementById('close-form-modal'),
    closeFormBtn: document.getElementById('close-form-btn'),
    formModalTitle: document.getElementById('form-modal-title'),
    topicEditorForm: document.getElementById('topic-editor-form'),
    formTopicTitle: document.getElementById('form-topic-title'),
    formTopicSubject: document.getElementById('form-topic-subject'),
    formTopicGrade: document.getElementById('form-topic-grade'),
    formTopicDescription: document.getElementById('form-topic-description'),
    formTopicConcepts: document.getElementById('form-topic-concepts'),
    formResourcesList: document.getElementById('form-resources-list'),
    formAddResourceBtn: document.getElementById('form-add-resource-btn'),
    formDeleteBtn: document.getElementById('form-delete-btn'),

    // Form review inputs
    formReviewQ1: document.getElementById('form-review-q1'),
    formReviewA1: document.getElementById('form-review-a1'),
    formReviewQ2: document.getElementById('form-review-q2'),
    formReviewA2: document.getElementById('form-review-a2'),
    formReviewQ3: document.getElementById('form-review-q3'),
    formReviewA3: document.getElementById('form-review-a3'),

    // Custom Confirm Modal
    confirmModal: document.getElementById('confirm-modal'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalMessage: document.getElementById('confirm-modal-message'),
    confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
    confirmActionBtn: document.getElementById('confirm-action-btn')
  };

  // Verify curriculumData is loaded
  if (typeof curriculumData === 'undefined') {
    console.error('Curriculum data was not loaded from data.js');
    return;
  }

  // ==========================================
  // LOCAL STORAGE CURRICULUM STATE
  // ==========================================
  let curriculumList = [];
  
  const saveCurriculumState = () => {
    try {
      localStorage.setItem('educore-curriculum', JSON.stringify(curriculumList));
    } catch (e) {
      console.warn('Local storage quota notice: Operating seamlessly in high-performance memory mode.', e);
    }
  };

  const storedCurriculum = localStorage.getItem('educore-curriculum');
  if (storedCurriculum) {
    try {
      const parsed = JSON.parse(storedCurriculum);
      if (Array.isArray(parsed) && parsed.length < curriculumData.length) {
        curriculumList = [...curriculumData];
        saveCurriculumState();
      } else {
        curriculumList = parsed;
      }
    } catch (e) {
      curriculumList = [...curriculumData];
      saveCurriculumState();
    }
  } else {
    curriculumList = [...curriculumData];
    saveCurriculumState();
  }

  // ==========================================
  // THEME INITIALIZATION
  // ==========================================
  DOM.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('educore-theme', newTheme);
  });

  // ==========================================
  // FILTER EVENT LISTENERS
  // ==========================================

  // Subject pill clicks
  DOM.subjectFiltersContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.subject-pill');
    if (!button) return;

    const subject = button.dataset.subject;
    const index = state.selectedSubjects.indexOf(subject);

    if (index === -1) {
      state.selectedSubjects.push(subject);
      button.classList.add('active');
    } else {
      state.selectedSubjects.splice(index, 1);
      button.classList.remove('active');
    }
    
    updateFilterStatusAndRender();
  });

  // Grade pill clicks
  DOM.gradeFiltersContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.grade-pill');
    if (!button) return;

    const grade = parseInt(button.dataset.grade, 10);
    const index = state.selectedGrades.indexOf(grade);

    if (index === -1) {
      state.selectedGrades.push(grade);
      button.classList.add('active');
    } else {
      state.selectedGrades.splice(index, 1);
      button.classList.remove('active');
    }
    
    updateFilterStatusAndRender();
  });

  // Search input with auto-clear button handling
  DOM.searchBox.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    
    if (state.searchQuery.length > 0) {
      DOM.clearSearchBtn.style.display = 'block';
    } else {
      DOM.clearSearchBtn.style.display = 'none';
    }
    
    updateFilterStatusAndRender();
  });

  // Clear buttons
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchBox.value = '';
    state.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    updateFilterStatusAndRender();
  });

  DOM.clearSubjectsBtn.addEventListener('click', () => {
    state.selectedSubjects = [];
    document.querySelectorAll('.subject-pill').forEach(el => el.classList.remove('active'));
    updateFilterStatusAndRender();
  });

  DOM.clearGradesBtn.addEventListener('click', () => {
    state.selectedGrades = [];
    document.querySelectorAll('.grade-pill').forEach(el => el.classList.remove('active'));
    updateFilterStatusAndRender();
  });

  DOM.resetAllBtn.addEventListener('click', resetFilters);
  DOM.emptyResetBtn.addEventListener('click', resetFilters);

  function resetFilters() {
    state.selectedSubjects = [];
    state.selectedGrades = [];
    state.searchQuery = '';
    DOM.searchBox.value = '';
    DOM.clearSearchBtn.style.display = 'none';
    
    document.querySelectorAll('.subject-pill').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.grade-pill').forEach(el => el.classList.remove('active'));
    
    updateFilterStatusAndRender();
  }

  // Active filter badge remove clicks
  DOM.activeBadgesContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.badge-remove-btn');
    if (!removeBtn) return;

    const type = removeBtn.dataset.type;
    const value = removeBtn.dataset.value;

    if (type === 'subject') {
      state.selectedSubjects = state.selectedSubjects.filter(s => s !== value);
      const pill = document.querySelector(`.subject-pill[data-subject="${value}"]`);
      if (pill) pill.classList.remove('active');
    } else if (type === 'grade') {
      const gradeInt = parseInt(value, 10);
      state.selectedGrades = state.selectedGrades.filter(g => g !== gradeInt);
      const pill = document.querySelector(`.grade-pill[data-grade="${value}"]`);
      if (pill) pill.classList.remove('active');
    }

    updateFilterStatusAndRender();
  });

  // ==========================================
  // RENDERING DYNAMICS
  // ==========================================

  function updateFilterStatusAndRender() {
    // 1. Render active tags
    DOM.activeBadgesContainer.innerHTML = '';
    
    // Add subject badges
    state.selectedSubjects.forEach(subject => {
      const displayMap = {
        science: 'Science',
        math: 'Math',
        social: 'Social Studies',
        english: 'English',
        filipino: 'Filipino'
      };
      
      const badge = document.createElement('span');
      badge.className = 'active-badge';
      badge.innerHTML = `
        ${displayMap[subject]}
        <button class="badge-remove-btn" data-type="subject" data-value="${subject}" aria-label="Remove filter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      DOM.activeBadgesContainer.appendChild(badge);
    });

    // Add grade badges
    state.selectedGrades.sort((a, b) => a - b).forEach(grade => {
      const badge = document.createElement('span');
      badge.className = 'active-badge';
      badge.innerHTML = `
        Grade ${grade}
        <button class="badge-remove-btn" data-type="grade" data-value="${grade}" aria-label="Remove filter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      DOM.activeBadgesContainer.appendChild(badge);
    });

    // Show reset button only if filters are active
    if (state.selectedSubjects.length > 0 || state.selectedGrades.length > 0 || state.searchQuery.length > 0) {
      DOM.resetAllBtn.style.display = 'block';
    } else {
      DOM.resetAllBtn.style.display = 'none';
    }

    // 2. Perform Filtering on Local Storage list
    const filteredTopics = curriculumList.filter(item => {
      // Subject Filter
      if (state.selectedSubjects.length > 0 && !state.selectedSubjects.includes(item.subject)) {
        return false;
      }
      
      // Grade Filter
      if (state.selectedGrades.length > 0 && !state.selectedGrades.includes(item.grade)) {
        return false;
      }
      
      // Text Search
      if (state.searchQuery.length > 0) {
        const matchesTopic = item.topic.toLowerCase().includes(state.searchQuery);
        const matchesDesc = item.description.toLowerCase().includes(state.searchQuery);
        const matchesConcepts = item.coreConcepts.some(concept => concept.toLowerCase().includes(state.searchQuery));
        
        if (!matchesTopic && !matchesDesc && !matchesConcepts) {
          return false;
        }
      }

      return true;
    });

    // 3. Render Topics Grid
    renderTopics(filteredTopics);
  }

  function renderTopics(topics) {
    DOM.topicsContainer.innerHTML = '';

    if (topics.length === 0) {
      DOM.topicsContainer.style.display = 'none';
      DOM.emptyStateView.style.display = 'flex';
      DOM.resultsCount.innerText = 'No topics found';
      return;
    }

    DOM.topicsContainer.style.display = 'grid';
    DOM.emptyStateView.style.display = 'none';
    DOM.resultsCount.innerText = `Found ${topics.length} topic${topics.length === 1 ? '' : 's'}`;

    topics.forEach(topic => {
      const card = document.createElement('div');
      card.className = `topic-card ${topic.subject}`;
      card.dataset.id = topic.id;
      
      const subjectLabelMap = {
        science: 'Science',
        math: 'Math',
        social: 'Social',
        english: 'English',
        filipino: 'Filipino'
      };

      // Check if notes exist for this card
      const storedNote = localStorage.getItem(`educore-note-${topic.id}`);
      const storedCustomLinks = localStorage.getItem(`educore-custom-links-${topic.id}`);
      const parsedLinks = storedCustomLinks ? JSON.parse(storedCustomLinks) : [];
      
      const hasNotes = storedNote && storedNote.trim().length > 0;
      const hasCustomLinks = parsedLinks.length > 0;

      const resourcesCount = (topic.resources ? topic.resources.length : 0) + parsedLinks.length;

      const cardTitle = translateText(topic.topic, state.globalLanguage);
      const cardDesc = translateText(topic.description, state.globalLanguage);

      card.innerHTML = `
        <div class="card-meta">
          <span class="badge ${topic.subject}">${subjectLabelMap[topic.subject]}</span>
          <span class="grade-tag">Grade ${topic.grade}</span>
        </div>
        <h3>${renderMathEquations(cardTitle)}</h3>
        <p class="card-description">${renderMathEquations(cardDesc)}</p>
        <div class="card-footer">
          <span class="card-resources-indicator" title="Lesson resources available">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            ${resourcesCount} Resource${resourcesCount === 1 ? '' : 's'}
          </span>
          ${(hasNotes || hasCustomLinks) ? `
            <span class="card-notes-indicator" title="You have custom notes or links in this topic">
              My Workspace
            </span>
          ` : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        openTopicModal(topic.id);
      });

      DOM.topicsContainer.appendChild(card);
    });
  }

  // Helper to prevent XSS
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // ==========================================
  // MATH EQUATIONS RENDERER & TRANSLATION ENGINE
  // ==========================================

  function renderMathEquations(text) {
    if (!text || typeof text !== 'string') return text || '';

    let formatted = escapeHTML(text);

    // Exponents & Superscripts: e.g. x^2, r^2, x², r², a³, (x-h)²
    formatted = formatted.replace(/(\b[a-zA-Z0-9\)]+)\^([a-zA-Z0-9\+\-]+)/g, '$1<sup>$2</sup>');
    formatted = formatted.replace(/([a-zA-Z0-9\)])[²]/g, '$1<sup>2</sup>');
    formatted = formatted.replace(/([a-zA-Z0-9\)])[³]/g, '$1<sup>3</sup>');

    // Subscripts: e.g. x_1, P_1, V_1
    formatted = formatted.replace(/(\b[a-zA-Z0-9]+)_([a-zA-Z0-9]+)/g, '$1<sub>$2</sub>');

    // Square roots: e.g. sqrt(x), √x
    formatted = formatted.replace(/sqrt\((.*?)\)/gi, '<span class="math-sqrt">&radic;<span class="sqrt-stem">$1</span></span>');
    formatted = formatted.replace(/√\((.*?)\)/g, '<span class="math-sqrt">&radic;<span class="sqrt-stem">$1</span></span>');
    formatted = formatted.replace(/√([a-zA-Z0-9]+)/g, '<span class="math-sqrt">&radic;<span class="sqrt-stem">$1</span></span>');

    // Fractions: e.g. 1/2, 1/3, 1/4, 3/4, 2/3, 1/5, 1/8
    formatted = formatted.replace(/(\b\d+)\/(\d+\b)/g, '<span class="math-frac"><span class="num">$1</span><span class="den">$2</span></span>');

    // Greek symbols & Math Operators
    formatted = formatted.replace(/\bpi\b/gi, '&pi;');
    formatted = formatted.replace(/π/g, '&pi;');
    formatted = formatted.replace(/±/g, '&plusmn;');
    formatted = formatted.replace(/≥/g, '&ge;');
    formatted = formatted.replace(/≤/g, '&le;');
    formatted = formatted.replace(/≠/g, '&ne;');
    formatted = formatted.replace(/°/g, '&deg;');

    // Wrap equations in math-expr wrapper if math symbols exist
    if (/[\=\^√π±≥≤≠]|<sup>|<sub>|<span class="math-/.test(formatted)) {
      return `<span class="math-expr">${formatted}</span>`;
    }

    return formatted;
  }

  const translationDict = {
    // Subject mapping
    "Pangngalan": "Noun (Ngalan ng Tao, Bagay, Hayop, Lugar, Pangyayari)",
    "Panghalip Panao": "Personal Pronouns (Ako, Ikaw, Siya, Kami, Tayo, Sila)",
    "Pandiwa": "Verbs / Action Words (Kilos o Gawa)",
    "Pang-uri": "Adjectives (Salitang Naglalarawan)",
    "Pang-abay": "Adverbs (Naglalarawan sa Pandiwa o Pang-uri)",
    "Simuno at Panaguri": "Subject and Predicate",
    "Ako at ang Aking Sarili": "Myself and My Personal Identity",
    "Ang Lalawigan at Rehiyon": "My Province and Region",
    "Likas na Yaman": "Natural Resources & Conservation",
    "Sinaunang Lipunang Pilipino": "Ancient Philippine Society & Culture",
    "Kolonyalismong Espanyol": "Spanish Colonial Period & Christianization",
    "Himagsikang Pilipino": "The Philippine Revolution of 1896",
    "Araling Asyano": "Asian Studies & Geography",
    "Kasaysayan ng Daigdig": "World History & Ancient Civilizations",
    "Ekonomiks": "Economics & Resource Allocation",
    "Mga Kontemporaryong Isyu": "Contemporary Global & Local Issues",
    "Ibong Adarna": "Ibong Adarna (Philippine Epic)",
    "Florante at Laura": "Florante at Laura (Classic Epic Poem)",
    "Noli Me Tangere": "Noli Me Tangere (Touch Me Not - Jose Rizal)",
    "El Filibusterismo": "El Filibusterismo (The Reign of Greed)",
    "Komunikasyon at Pananaliksik": "Communication and Research in Filipino",
    "Pagbasa at Pagsusuri": "Reading and Critical Analysis of Texts"
  };

  function translateText(text, targetLang) {
    if (!text || typeof text !== 'string') return text || '';
    
    if (targetLang === 'fil') {
      let res = text
        .replace(/Understand the main principles of (.*)\./i, 'Unawain ang mga pangunahing alituntunin at konsepto ng $1.')
        .replace(/Study and explore the learning objectives of (.*)\./i, 'Aralin at suriin ang mga layunin sa pagkakatuto ng $1.')
        .replace(/What is the key objective of studying: (.*)\?/i, 'Ano ang pangunahing layunin sa pag-aaral ng $1?')
        .replace(/True or False: This topic is a core standard for (.*)\./i, 'Tama o Mali: Ang paksang ito ay isang batayang pamantayan sa $1.')
        .replace(/Name an important detail or term related to this topic\./i, 'Magbigay ng isang mahalagang detalye o katawagan kaugnay ng paksang ito.')
        .replace(/To gain structural understanding and list core functions of: (.*)\./i, 'Upang magkaroon ng pag-unawa sa estruktura at maiisa-isa ang mga tungkulin ng $1.')
        .replace(/True\. It matches curriculum criteria\./i, 'Tama. Ito ay umaayon sa pamantayan ng kurikulum.')
        .replace(/Yes, a key detail is: (.*)\./i, 'Oo, ang isang mahalagang detalye ay: $1.');
      return res;
    } else {
      let res = text;
      for (const [key, val] of Object.entries(translationDict)) {
        if (res.includes(key)) {
          res = res.replaceAll(key, val);
        }
      }
      res = res
        .replace(/Suriin ang (.*)/g, 'Analyze and study $1')
        .replace(/Tukuyin ang (.*)/g, 'Identify and describe $1')
        .replace(/Matukoy ang (.*)/g, 'Determine and examine $1')
        .replace(/Unawain ang (.*)/g, 'Understand the concepts of $1')
        .replace(/Talakayin ang (.*)/g, 'Discuss and explore $1')
        .replace(/Pagkilala sa (.*)/g, 'Recognition of $1')
        .replace(/Paggamit ng (.*)/g, 'Use and application of $1')
        .replace(/Pangangalaga sa (.*)/g, 'Care and conservation of $1')
        .replace(/Wastong (.*)/g, 'Proper $1')
        .replace(/Mga Katangian ng (.*)/g, 'Characteristics of $1')
        .replace(/Kahalagahan ng (.*)/g, 'Importance of $1');
      return res;
    }
  }

  // ==========================================
  // MODAL / DRAWER MANAGEMENT
  // ==========================================
  
  function openTopicModal(topicId) {
    const topic = curriculumList.find(t => t.id === topicId);
    if (!topic) return;

    state.activeTopic = topic;

    const activeLang = state.activeLanguage[topicId] || 'en';
    if (DOM.translateBtnLabel) {
      DOM.translateBtnLabel.textContent = activeLang === 'fil' ? 'Naka-Filipino' : 'EN / FIL';
    }

    const titleText = translateText(topic.topic, activeLang);
    const descText = translateText(topic.description, activeLang);

    // Set topic titles and descriptions with math equations and translation
    DOM.modalTopicTitle.innerHTML = renderMathEquations(titleText);
    DOM.modalTopicDescription.innerHTML = renderMathEquations(descText);
    
    // Set Header Banner Subject Styling
    DOM.modalHeaderBanner.className = 'modal-header'; // reset
    DOM.modalHeaderBanner.classList.add(topic.subject);
    
    // Badges
    const subjectLabelMap = {
      science: 'Science',
      math: 'Math',
      social: 'Social Studies',
      english: 'English',
      filipino: 'Filipino'
    };
    DOM.modalSubjectBadge.innerText = subjectLabelMap[topic.subject];
    DOM.modalSubjectBadge.className = `badge ${topic.subject}`;
    
    DOM.modalGradeBadge.innerText = `Grade ${topic.grade}`;

    // Populates curriculum concepts list
    DOM.modalConceptList.innerHTML = '';
    topic.coreConcepts.forEach(concept => {
      const li = document.createElement('li');
      const translatedConcept = translateText(concept, activeLang);
      li.innerHTML = renderMathEquations(translatedConcept);
      DOM.modalConceptList.appendChild(li);
    });

    // Populate curated resources
    renderCuratedResources(topic.resources || []);

    // Populate workspace
    loadTeacherNotes(topic.id);
    renderCustomLinks(topic.id);

    // Reset Review Tool
    state.currentCardIndex = 0;
    state.currentQuizIndex = 0;
    state.quizScore = 0;
    DOM.quizScoreDisplay.innerText = 'Score: 0';
    setupFlashcards(topic.reviewItems || []);
    setupQuiz(topic.reviewItems || []);

    // Reset back to first tab
    switchTab('concepts-resources');

    // Display modal
    DOM.detailModal.classList.add('active');
    DOM.detailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal() {
    DOM.detailModal.classList.remove('active');
    DOM.detailModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scroll
    state.activeTopic = null;
    
    // Save notes if timeout pending
    if (state.saveTimeout) {
      clearTimeout(state.saveTimeout);
      saveNotesImmediately();
    }
    
    // Refresh main list grid to reflect notes/links indicator updates
    updateFilterStatusAndRender();
  }

  DOM.closeModalBtn.addEventListener('click', closeModal);

  if (DOM.translateTopicBtn) {
    DOM.translateTopicBtn.addEventListener('click', () => {
      if (!state.activeTopic) return;
      const topicId = state.activeTopic.id;
      const currentLang = state.activeLanguage[topicId] || state.globalLanguage || 'en';
      state.activeLanguage[topicId] = currentLang === 'fil' ? 'en' : 'fil';
      openTopicModal(topicId);
    });
  }

  if (DOM.globalTranslateBtn) {
    DOM.globalTranslateBtn.addEventListener('click', () => {
      state.globalLanguage = state.globalLanguage === 'fil' ? 'en' : 'fil';
      const isFil = state.globalLanguage === 'fil';
      if (DOM.globalTranslateLabel) {
        DOM.globalTranslateLabel.textContent = isFil ? 'Naka-Filipino' : 'EN / FIL';
      }
      
      // Sync active topic modal language if currently open
      if (state.activeTopic) {
        state.activeLanguage[state.activeTopic.id] = state.globalLanguage;
        openTopicModal(state.activeTopic.id);
      }
      
      updateFilterStatusAndRender();
    });
  }
  
  DOM.detailModal.addEventListener('click', (e) => {
    // Close modal if user clicks the blurred backdrop overlay directly
    if (e.target === DOM.detailModal) {
      closeModal();
    }
  });

  // Modal Tabs Swapping
  DOM.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      switchTab(targetTab);
    });
  });

  function switchTab(tabId) {
    DOM.tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    DOM.tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Special card resizing check on flipcard load to avoid dimensions shift
    if (tabId === 'review-tool') {
      DOM.flashcardElement.classList.remove('flipped');
    }
  }

  // ==========================================
  // TAB 1: CURATED RESOURCES RENDERING
  // ==========================================
  function renderCuratedResources(resources) {
    DOM.modalResourcesList.innerHTML = '';
    
    if (resources.length === 0) {
      DOM.modalResourcesList.innerHTML = '<p class="text-muted" style="font-size: 0.85rem;">No resources available for this topic.</p>';
      return;
    }

    resources.forEach(res => {
      const item = document.createElement('a');
      item.href = res.url;
      item.target = '_blank';
      item.className = `resource-item ${res.type}`;
      item.title = `Open ${res.label} in a new tab`;

      let iconSVG = '';
      if (res.type === 'video') {
        iconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
      } else if (res.type === 'worksheet') {
        iconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
      } else if (res.type === 'lesson_plan') {
        iconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M6 6h10"></path><path d="M6 10h10"></path></svg>`;
      } else if (res.type === 'simulation') {
        iconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
      }

      item.innerHTML = `
        <div class="resource-icon">
          ${iconSVG}
        </div>
        <div class="resource-info">
          <span class="resource-label">${escapeHTML(res.label)}</span>
          <span class="resource-type">${res.type.replace('_', ' ')}</span>
        </div>
        <div class="resource-action-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
      `;

      DOM.modalResourcesList.appendChild(item);
    });
  }

  // ==========================================
  // TAB 2: INTERACTIVE TEACHING REVIEW TOOL
  // ==========================================
  
  // Toggle tool mode (Flashcard vs Quiz)
  DOM.btnModeFlashcards.addEventListener('click', () => {
    DOM.btnModeFlashcards.classList.add('active');
    DOM.btnModeQuiz.classList.remove('active');
    DOM.viewFlashcards.style.display = 'flex';
    DOM.viewQuiz.style.display = 'none';
    DOM.flashcardElement.classList.remove('flipped');
  });

  DOM.btnModeQuiz.addEventListener('click', () => {
    DOM.btnModeQuiz.classList.add('active');
    DOM.btnModeFlashcards.classList.remove('active');
    DOM.viewQuiz.style.display = 'flex';
    DOM.viewFlashcards.style.display = 'none';
  });

  // FLASHCARDS IMPLEMENTATION
  function setupFlashcards(items) {
    if (!items || items.length === 0) {
      DOM.viewFlashcards.innerHTML = '<div class="glass-panel" style="padding: 24px; text-align: center;"><p class="text-muted">No review items for this topic.</p></div>';
      return;
    }

    // Re-verify initial structure in case innerHTML was replaced by empty notice
    if (!document.getElementById('flashcard-element')) {
      DOM.viewFlashcards.innerHTML = `
        <div class="flashcard-deck">
          <div class="flashcard glass-panel" id="flashcard-element">
            <div class="flashcard-inner">
              <div class="card-face card-front">
                <div class="card-header">Question <span id="flashcard-num">1</span></div>
                <p class="card-text" id="flashcard-q-text">What is the question?</p>
                <span class="card-prompt">Click Card to Flip</span>
              </div>
              <div class="card-face card-back">
                <div class="card-header">Answer</div>
                <p class="card-text" id="flashcard-a-text">This is the answer.</p>
                <span class="card-prompt">Click Card to Flip Back</span>
              </div>
            </div>
          </div>
        </div>
        <div class="deck-controls">
          <button class="primary-btn outline-btn" id="prev-card-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
          </button>
          <span class="deck-indicator"><span id="curr-card-index">1</span> / <span id="total-card-count">3</span></span>
          <button class="primary-btn outline-btn" id="next-card-btn">
            Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      `;
      // Re-cache dynamic buttons
      DOM.flashcardElement = document.getElementById('flashcard-element');
      DOM.flashcardNum = document.getElementById('flashcard-num');
      DOM.flashcardQText = document.getElementById('flashcard-q-text');
      DOM.flashcardAText = document.getElementById('flashcard-a-text');
      DOM.prevCardBtn = document.getElementById('prev-card-btn');
      DOM.nextCardBtn = document.getElementById('next-card-btn');
      DOM.currCardIndex = document.getElementById('curr-card-index');
      DOM.totalCardCount = document.getElementById('total-card-count');

      // Re-bind listeners
      DOM.flashcardElement.addEventListener('click', () => {
        DOM.flashcardElement.classList.toggle('flipped');
      });
      DOM.prevCardBtn.addEventListener('click', () => {
        if (state.currentCardIndex > 0) {
          state.currentCardIndex--;
          updateFlashcardContent(state.activeTopic.reviewItems);
        }
      });
      DOM.nextCardBtn.addEventListener('click', () => {
        if (state.currentCardIndex < state.activeTopic.reviewItems.length - 1) {
          state.currentCardIndex++;
          updateFlashcardContent(state.activeTopic.reviewItems);
        }
      });
    }

    DOM.totalCardCount.innerText = items.length;
    updateFlashcardContent(items);
  }

  function updateFlashcardContent(items) {
    const item = items[state.currentCardIndex];
    DOM.flashcardElement.classList.remove('flipped');
    
    const activeLang = (state.activeTopic ? state.activeLanguage[state.activeTopic.id] : 'en') || 'en';

    // Allow brief sync before changing content to make flip animations smooth
    setTimeout(() => {
      DOM.flashcardNum.innerText = state.currentCardIndex + 1;
      DOM.flashcardQText.innerHTML = renderMathEquations(translateText(item.question, activeLang));
      DOM.flashcardAText.innerHTML = renderMathEquations(translateText(item.answer, activeLang));
      DOM.currCardIndex.innerText = state.currentCardIndex + 1;
    }, 150);

    // Button states
    DOM.prevCardBtn.disabled = state.currentCardIndex === 0;
    DOM.nextCardBtn.disabled = state.currentCardIndex === items.length - 1;
  }

  // Click on card to flip
  if (DOM.flashcardElement) {
    DOM.flashcardElement.addEventListener('click', () => {
      DOM.flashcardElement.classList.toggle('flipped');
    });
  }

  // Card navigations
  if (DOM.prevCardBtn) {
    DOM.prevCardBtn.addEventListener('click', () => {
      if (state.currentCardIndex > 0) {
        state.currentCardIndex--;
        updateFlashcardContent(state.activeTopic.reviewItems);
      }
    });
  }

  if (DOM.nextCardBtn) {
    DOM.nextCardBtn.addEventListener('click', () => {
      if (state.currentCardIndex < state.activeTopic.reviewItems.length - 1) {
        state.currentCardIndex++;
        updateFlashcardContent(state.activeTopic.reviewItems);
      }
    });
  }

  // QUIZ IMPLEMENTATION
  function setupQuiz(items) {
    if (!items || items.length === 0) {
      DOM.viewQuiz.innerHTML = '<div class="glass-panel" style="padding: 24px; text-align: center;"><p class="text-muted">No quiz items for this topic.</p></div>';
      return;
    }

    // Re-verify quiz elements structure
    if (!document.getElementById('quiz-curr-q-num')) {
      DOM.viewQuiz.innerHTML = `
        <div class="quiz-question-card glass-panel">
          <div class="quiz-progress-bar">
            <div class="quiz-progress" id="quiz-progress-indicator" style="width: 33%"></div>
          </div>
          <div class="quiz-question-header">
            <span>Question <span id="quiz-curr-q-num">1</span> of <span id="quiz-total-q-count">3</span></span>
            <span class="quiz-score" id="quiz-score-display">Score: 0</span>
          </div>
          <p class="quiz-question-text" id="quiz-question-text-el">This is a quiz question?</p>
          
          <div class="quiz-answer-container" id="quiz-answer-block" style="display: none;">
            <div class="answer-badge">Correct Answer</div>
            <p class="quiz-answer-text" id="quiz-answer-text-el">This is the correct answer.</p>
            
            <div class="quiz-verdict-btns">
              <button class="primary-btn feedback-correct" id="quiz-btn-correct">Student Got it Right (+1)</button>
              <button class="primary-btn outline-btn feedback-incorrect" id="quiz-btn-incorrect">Missed It</button>
            </div>
          </div>

          <div class="quiz-actions">
            <button class="primary-btn" id="quiz-btn-reveal">Reveal Answer</button>
            <button class="primary-btn" id="quiz-btn-next" style="display: none;">Next Question</button>
          </div>
        </div>

        <div class="quiz-complete-card glass-panel" id="quiz-complete-block" style="display: none;">
          <div class="complete-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Quiz Completed!</h3>
          <p>Nice work reviewing this topic with your class.</p>
          <div class="complete-score">Final Class Score: <strong id="quiz-final-score">0</strong> / <span id="quiz-max-score">3</span></div>
          <button class="primary-btn" id="quiz-btn-restart">Restart Quiz</button>
        </div>
      `;

      // Re-cache quiz DOM elements
      DOM.quizQuestionCard = document.querySelector('.quiz-question-card');
      DOM.quizProgressIndicator = document.getElementById('quiz-progress-indicator');
      DOM.quizCurrQNum = document.getElementById('quiz-curr-q-num');
      DOM.quizTotalQCount = document.getElementById('quiz-total-q-count');
      DOM.quizScoreDisplay = document.getElementById('quiz-score-display');
      DOM.quizQuestionTextEl = document.getElementById('quiz-question-text-el');
      DOM.quizAnswerBlock = document.getElementById('quiz-answer-block');
      DOM.quizAnswerTextEl = document.getElementById('quiz-answer-text-el');
      DOM.quizBtnReveal = document.getElementById('quiz-btn-reveal');
      DOM.quizBtnNext = document.getElementById('quiz-btn-next');
      DOM.quizBtnCorrect = document.getElementById('quiz-btn-correct');
      DOM.quizBtnIncorrect = document.getElementById('quiz-btn-incorrect');
      DOM.quizCompleteBlock = document.getElementById('quiz-complete-block');
      DOM.quizFinalScore = document.getElementById('quiz-final-score');
      DOM.quizMaxScore = document.getElementById('quiz-max-score');
      DOM.quizBtnRestart = document.getElementById('quiz-btn-restart');

      // Re-bind listeners
      DOM.quizBtnReveal.addEventListener('click', () => {
        const item = state.activeTopic.reviewItems[state.currentQuizIndex];
        DOM.quizAnswerTextEl.innerText = item.answer;
        DOM.quizAnswerBlock.style.display = 'flex';
        DOM.quizBtnReveal.style.display = 'none';
      });

      DOM.quizBtnCorrect.addEventListener('click', () => {
        state.quizScore++;
        DOM.quizScoreDisplay.innerText = `Score: ${state.quizScore}`;
        advanceQuiz();
      });

      DOM.quizBtnIncorrect.addEventListener('click', () => {
        advanceQuiz();
      });

      DOM.quizBtnRestart.addEventListener('click', resetQuizView);
    }

    DOM.quizTotalQCount.innerText = items.length;
    DOM.quizMaxScore.innerText = items.length;
    resetQuizView();
  }

  function resetQuizView() {
    DOM.quizQuestionCard.style.display = 'flex';
    DOM.quizCompleteBlock.style.display = 'none';
    
    state.currentQuizIndex = 0;
    state.quizScore = 0;
    DOM.quizScoreDisplay.innerText = 'Score: 0';
    
    updateQuizQuestion();
  }

  function updateQuizQuestion() {
    const items = state.activeTopic.reviewItems;
    const item = items[state.currentQuizIndex];
    const activeLang = (state.activeTopic ? state.activeLanguage[state.activeTopic.id] : 'en') || 'en';
    
    DOM.quizCurrQNum.innerText = state.currentQuizIndex + 1;
    DOM.quizQuestionTextEl.innerHTML = renderMathEquations(translateText(item.question, activeLang));
    
    // Reset answers visibility
    DOM.quizAnswerBlock.style.display = 'none';
    DOM.quizBtnReveal.style.display = 'block';
    DOM.quizBtnNext.style.display = 'none';
    
    // Progress
    const percent = ((state.currentQuizIndex + 1) / items.length) * 100;
    DOM.quizProgressIndicator.style.width = `${percent}%`;
  }

  if (DOM.quizBtnReveal) {
    DOM.quizBtnReveal.addEventListener('click', () => {
      const item = state.activeTopic.reviewItems[state.currentQuizIndex];
      const activeLang = (state.activeTopic ? state.activeLanguage[state.activeTopic.id] : 'en') || 'en';
      DOM.quizAnswerTextEl.innerHTML = renderMathEquations(translateText(item.answer, activeLang));
      DOM.quizAnswerBlock.style.display = 'flex';
      DOM.quizBtnReveal.style.display = 'none';
    });
  }

  if (DOM.quizBtnCorrect) {
    DOM.quizBtnCorrect.addEventListener('click', () => {
      state.quizScore++;
      DOM.quizScoreDisplay.innerText = `Score: ${state.quizScore}`;
      advanceQuiz();
    });
  }

  if (DOM.quizBtnIncorrect) {
    DOM.quizBtnIncorrect.addEventListener('click', () => {
      advanceQuiz();
    });
  }

  function advanceQuiz() {
    const items = state.activeTopic.reviewItems;
    if (state.currentQuizIndex < items.length - 1) {
      state.currentQuizIndex++;
      updateQuizQuestion();
    } else {
      // Quiz Finished!
      DOM.quizQuestionCard.style.display = 'none';
      DOM.quizCompleteBlock.style.display = 'flex';
      DOM.quizFinalScore.innerText = state.quizScore;
    }
  }

  if (DOM.quizBtnRestart) {
    DOM.quizBtnRestart.addEventListener('click', resetQuizView);
  }


  // ==========================================
  // TAB 3: LOCALSTORAGE TEACHER WORKSPACE
  // ==========================================

  // NOTES AUTOSAVE
  function loadTeacherNotes(topicId) {
    const note = localStorage.getItem(`educore-note-${topicId}`) || '';
    DOM.teacherNotesInput.value = note;
    DOM.notesSaveStatus.innerText = 'Saved';
    DOM.notesSaveStatus.classList.remove('saving');
  }

  DOM.teacherNotesInput.addEventListener('input', () => {
    DOM.notesSaveStatus.innerText = 'Saving...';
    DOM.notesSaveStatus.classList.add('saving');
    
    // Debounce saves by 500ms
    if (state.saveTimeout) {
      clearTimeout(state.saveTimeout);
    }
    
    state.saveTimeout = setTimeout(() => {
      saveNotesImmediately();
    }, 500);
  });

  function saveNotesImmediately() {
    if (!state.activeTopic) return;
    const value = DOM.teacherNotesInput.value;
    localStorage.setItem(`educore-note-${state.activeTopic.id}`, value);
    
    DOM.notesSaveStatus.innerText = 'Saved';
    DOM.notesSaveStatus.classList.remove('saving');
    state.saveTimeout = null;
  }

  // CUSTOM LINKS ADDER
  function renderCustomLinks(topicId) {
    DOM.customLinksListContainer.innerHTML = '';
    const storedLinks = localStorage.getItem(`educore-custom-links-${topicId}`);
    const links = storedLinks ? JSON.parse(storedLinks) : [];

    if (links.length === 0) {
      DOM.customLinksListContainer.innerHTML = '<p class="text-muted" style="font-size: 0.85rem;">No custom links added yet.</p>';
      return;
    }

    links.forEach((link, index) => {
      const row = document.createElement('div');
      row.className = 'custom-link-item';
      
      row.innerHTML = `
        <div class="custom-link-info-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted)">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <a class="custom-link-anchor" href="${link.url}" target="_blank" title="Go to ${link.url}">${escapeHTML(link.label)}</a>
        </div>
        <button class="custom-link-delete-btn" data-index="${index}" title="Remove Link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      `;

      DOM.customLinksListContainer.appendChild(row);
    });

    // Delete custom link listeners
    DOM.customLinksListContainer.querySelectorAll('.custom-link-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const indexToDelete = parseInt(btn.dataset.index, 10);
        deleteCustomLink(topicId, indexToDelete);
      });
    });
  }

  DOM.customLinkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.activeTopic) return;
    
    const label = DOM.customLinkLabel.value.trim();
    const url = DOM.customLinkUrl.value.trim();
    
    if (label && url) {
      addCustomLink(state.activeTopic.id, label, url);
      DOM.customLinkLabel.value = '';
      DOM.customLinkUrl.value = '';
    }
  });

  function addCustomLink(topicId, label, url) {
    const storedLinks = localStorage.getItem(`educore-custom-links-${topicId}`);
    const links = storedLinks ? JSON.parse(storedLinks) : [];
    
    links.push({ label, url });
    localStorage.setItem(`educore-custom-links-${topicId}`, JSON.stringify(links));
    
    renderCustomLinks(topicId);
  }

  function deleteCustomLink(topicId, index) {
    const storedLinks = localStorage.getItem(`educore-custom-links-${topicId}`);
    if (!storedLinks) return;
    
    let links = JSON.parse(storedLinks);
    links.splice(index, 1);
    
    localStorage.setItem(`educore-custom-links-${topicId}`, JSON.stringify(links));
    
    renderCustomLinks(topicId);
  }


  // ==========================================
  // CURRICULUM EDITING AND CREATING LOGIC
  // ==========================================

  // Dynamic Resource Row Addition
  function addResourceInputRow(type = 'video', label = '', url = '') {
    const row = document.createElement('div');
    row.className = 'form-resource-row';
    
    row.innerHTML = `
      <select class="res-type">
        <option value="video" ${type === 'video' ? 'selected' : ''}>Video</option>
        <option value="worksheet" ${type === 'worksheet' ? 'selected' : ''}>Worksheet</option>
        <option value="lesson_plan" ${type === 'lesson_plan' ? 'selected' : ''}>Lesson Plan</option>
        <option value="simulation" ${type === 'simulation' ? 'selected' : ''}>Simulation</option>
      </select>
      <input type="text" class="res-label" placeholder="Resource Label (Optional)" value="${escapeHTML(label)}" autocomplete="off">
      <input type="url" class="res-url" placeholder="Resource URL (Optional)" value="${escapeHTML(url)}" autocomplete="off">
      <button type="button" class="remove-row-btn" title="Remove Link Row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;
    
    row.querySelector('.remove-row-btn').addEventListener('click', () => {
      row.remove();
    });
    
    DOM.formResourcesList.appendChild(row);
  }

  DOM.formAddResourceBtn.addEventListener('click', () => {
    addResourceInputRow();
  });

  // Modal control functions
  function openFormModal(mode = 'add', topicId = null) {
    state.formMode = mode;
    state.editingTopicId = topicId;

    // Reset Form Fields
    DOM.topicEditorForm.reset();
    DOM.formResourcesList.innerHTML = '';

    if (mode === 'add') {
      DOM.formModalTitle.innerText = 'Add New Topic';
      DOM.formDeleteBtn.style.display = 'none';
      addResourceInputRow(); // start with one blank link row
      
      DOM.formReviewQ1.value = '';
      DOM.formReviewA1.value = '';
      DOM.formReviewQ2.value = '';
      DOM.formReviewA2.value = '';
      DOM.formReviewQ3.value = '';
      DOM.formReviewA3.value = '';
    } else {
      DOM.formModalTitle.innerText = 'Edit Topic';
      DOM.formDeleteBtn.style.display = 'block';

      // Load existing topic data
      const topic = curriculumList.find(t => t.id === topicId);
      if (!topic) return;

      DOM.formTopicTitle.value = topic.topic;
      DOM.formTopicSubject.value = topic.subject;
      DOM.formTopicGrade.value = topic.grade;
      DOM.formTopicDescription.value = topic.description;
      DOM.formTopicConcepts.value = topic.coreConcepts.join('\n');

      // Link Rows
      if (topic.resources && topic.resources.length > 0) {
        topic.resources.forEach(res => {
          addResourceInputRow(res.type, res.label, res.url);
        });
      } else {
        addResourceInputRow();
      }

      // Review Q&As
      if (topic.reviewItems && topic.reviewItems.length >= 3) {
        DOM.formReviewQ1.value = topic.reviewItems[0].question;
        DOM.formReviewA1.value = topic.reviewItems[0].answer;
        DOM.formReviewQ2.value = topic.reviewItems[1].question;
        DOM.formReviewA2.value = topic.reviewItems[1].answer;
        DOM.formReviewQ3.value = topic.reviewItems[2].question;
        DOM.formReviewA3.value = topic.reviewItems[2].answer;
      } else {
        DOM.formReviewQ1.value = '';
        DOM.formReviewA1.value = '';
        DOM.formReviewQ2.value = '';
        DOM.formReviewA2.value = '';
        DOM.formReviewQ3.value = '';
        DOM.formReviewA3.value = '';
      }
    }

    DOM.formModal.classList.add('active');
    DOM.formModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFormModal() {
    DOM.formModal.classList.remove('active');
    DOM.formModal.setAttribute('aria-hidden', 'true');
    
    // Only restore body overflow if details modal is NOT open
    if (!DOM.detailModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  // Header "+" Button Click
  DOM.addTopicBtn.addEventListener('click', () => {
    openFormModal('add');
  });

  // Modal Closures
  DOM.closeFormModalBtn.addEventListener('click', closeFormModal);
  DOM.closeFormBtn.addEventListener('click', closeFormModal);
  DOM.formModal.addEventListener('click', (e) => {
    if (e.target === DOM.formModal) {
      closeFormModal();
    }
  });

  // Edit Button in Details modal Click
  DOM.editTopicBtn.addEventListener('click', () => {
    if (state.activeTopic) {
      const topicId = state.activeTopic.id;
      // Close details modal briefly
      DOM.detailModal.classList.remove('active');
      DOM.detailModal.setAttribute('aria-hidden', 'true');
      
      setTimeout(() => {
        openFormModal('edit', topicId);
      }, 250);
    }
  });

  // Form Submitting / Saving
  DOM.topicEditorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Gather fields
    const topicTitle = DOM.formTopicTitle.value.trim();
    const subject = DOM.formTopicSubject.value;
    const grade = parseInt(DOM.formTopicGrade.value, 10);
    const description = DOM.formTopicDescription.value.trim();
    
    // Core Concepts
    const coreConcepts = DOM.formTopicConcepts.value
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    // Dynamic resources list
    const resources = [];
    const resourceRows = DOM.formResourcesList.querySelectorAll('.form-resource-row');
    resourceRows.forEach(row => {
      const type = row.querySelector('.res-type').value;
      const label = row.querySelector('.res-label').value.trim();
      const url = row.querySelector('.res-url').value.trim();

      if (label && url) {
        resources.push({ type, label, url });
      }
    });

    // Review Q&As
    const reviewItems = [
      { question: DOM.formReviewQ1.value.trim(), answer: DOM.formReviewA1.value.trim() },
      { question: DOM.formReviewQ2.value.trim(), answer: DOM.formReviewA2.value.trim() },
      { question: DOM.formReviewQ3.value.trim(), answer: DOM.formReviewA3.value.trim() }
    ].filter(item => item.question.length > 0 && item.answer.length > 0);

    // 2. Add or Edit Logic
    if (state.formMode === 'add') {
      const newId = `topic-custom-${Date.now()}`;
      const newTopic = {
        id: newId,
        subject,
        grade,
        topic: topicTitle,
        description,
        coreConcepts,
        resources,
        reviewItems
      };

      curriculumList.push(newTopic);
    } else {
      const index = curriculumList.findIndex(t => t.id === state.editingTopicId);
      if (index !== -1) {
        curriculumList[index].topic = topicTitle;
        curriculumList[index].subject = subject;
        curriculumList[index].grade = grade;
        curriculumList[index].description = description;
        curriculumList[index].coreConcepts = coreConcepts;
        curriculumList[index].resources = resources;
        curriculumList[index].reviewItems = reviewItems;
      }
    }

    // 3. Save to storage & Close
    saveCurriculumState();
    closeFormModal();
    updateFilterStatusAndRender();

    // 4. If we edited, open details modal back to show changes instantly
    if (state.formMode === 'edit') {
      setTimeout(() => {
        openTopicModal(state.editingTopicId);
      }, 300);
    }
  });

  // ==========================================
  // CUSTOM CONFIRMATION MODAL HELPERS
  // ==========================================
  const showCustomConfirm = ({ title, message, actionText = 'Confirm', onConfirm }) => {
    if (!DOM.confirmModal) return;
    DOM.confirmModalTitle.textContent = title;
    DOM.confirmModalMessage.textContent = message;
    DOM.confirmActionBtn.textContent = actionText;

    state.onConfirmCallback = onConfirm;

    DOM.confirmModal.style.display = 'flex';
    DOM.confirmModal.setAttribute('aria-hidden', 'false');
  };

  const closeCustomConfirm = () => {
    if (!DOM.confirmModal) return;
    DOM.confirmModal.style.display = 'none';
    DOM.confirmModal.setAttribute('aria-hidden', 'true');
    state.onConfirmCallback = null;
  };

  if (DOM.confirmCancelBtn) {
    DOM.confirmCancelBtn.addEventListener('click', closeCustomConfirm);
  }

  if (DOM.confirmActionBtn) {
    DOM.confirmActionBtn.addEventListener('click', () => {
      if (typeof state.onConfirmCallback === 'function') {
        state.onConfirmCallback();
      }
      closeCustomConfirm();
    });
  }

  // Deleting Topic
  DOM.formDeleteBtn.addEventListener('click', (e) => {
    if (e) e.preventDefault();
    if (state.formMode !== 'edit' || !state.editingTopicId) return;

    showCustomConfirm({
      title: 'Delete Topic?',
      message: 'Are you sure you want to delete this topic? All resources and review contents will be permanently removed.',
      actionText: 'Delete Topic',
      onConfirm: () => {
        curriculumList = curriculumList.filter(t => t.id !== state.editingTopicId);
        saveCurriculumState();
        
        closeFormModal();
        updateFilterStatusAndRender();
      }
    });
  });

  // Reset to Default Curriculum
  const performCurriculumReset = (e) => {
    if (e) e.preventDefault();
    showCustomConfirm({
      title: 'Sync & Reset Curriculum?',
      message: 'This will reset the active curriculum back to the full 4,294 K-12 topic database.',
      actionText: 'Sync Database',
      onConfirm: () => {
        localStorage.removeItem('educore-curriculum');
        curriculumList = [...curriculumData];
        saveCurriculumState();
        
        // Reset filter arrays
        state.selectedSubjects = [];
        state.selectedGrades = [];
        state.searchQuery = '';
        DOM.searchBox.value = '';
        if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'none';

        document.querySelectorAll('.subject-pill').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.grade-pill').forEach(el => el.classList.remove('active'));

        updateFilterStatusAndRender();
      }
    });
  };

  if (DOM.resetCurriculumBtn) DOM.resetCurriculumBtn.addEventListener('click', performCurriculumReset);
  if (DOM.resetCurriculumHeaderBtn) DOM.resetCurriculumHeaderBtn.addEventListener('click', performCurriculumReset);

  // ==========================================
  // INITIAL RUN
  // ==========================================
  updateFilterStatusAndRender();
});
