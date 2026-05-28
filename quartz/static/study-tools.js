/**
 * study-tools.js — Interactive study platform for LPIC Linux certification content
 * Built on top of Quartz v5. Provides Quiz Runner, Flashcard Viewer (SM-2),
 * Dashboard, and Data Portability features.
 *
 * Activates based on page content / frontmatter "tipo" field:
 *   - ejercicios  → Quiz Runner
 *   - flashcards  → Flashcard Viewer with SM-2 spaced repetition
 *   - dashboard   → Dashboard + Data Portability
 */
;(function () {
  "use strict"

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const LS_PREFIX = "lpic-study:"
  const QUIZ_PREFIX = LS_PREFIX + "quiz:"
  const FC_PREFIX = LS_PREFIX + "fc:"

  // ---------------------------------------------------------------------------
  // Utility helpers
  // ---------------------------------------------------------------------------

  /** Extract a subtema identifier from the current page URL / slug. */
  function getSubtema() {
    const slug = document.body.getAttribute("data-slug") || ""
    // Typically something like "lpic-1/tema-101/101-1/ejercicios"
    // We want a stable key, so use the slug with slashes replaced
    return slug.replace(/\//g, "_").replace(/^_|_$/g, "")
  }

  /** Simple DOM helper: create element with optional classes and text. */
  function el(tag, classNames, textContent) {
    var node = document.createElement(tag)
    if (classNames) {
      var arr = Array.isArray(classNames) ? classNames : classNames.split(" ")
      arr.forEach(function (c) {
        if (c) node.classList.add(c)
      })
    }
    if (textContent !== undefined && textContent !== null) {
      node.textContent = textContent
    }
    return node
  }

  /** Safely read JSON from localStorage. */
  function lsGet(key) {
    try {
      var raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch (_) {
      return null
    }
  }

  /** Safely write JSON to localStorage. */
  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (_) {
      /* quota exceeded – silently ignore */
    }
  }

  /** Get all localStorage keys with our prefix. */
  function lsAllKeys() {
    var keys = []
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i)
      if (k && k.startsWith(LS_PREFIX)) {
        keys.push(k)
      }
    }
    return keys
  }

  /** Today as YYYY-MM-DD string */
  function todayStr() {
    return new Date().toISOString().slice(0, 10)
  }

  /** Add days to a Date and return YYYY-MM-DD */
  function addDays(date, days) {
    var d = new Date(date)
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
  }

  /** Shuffle an array in place (Fisher-Yates). */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }

  /** Detect which certification the current page belongs to for Anki download. */
  function detectAnkiCert() {
    var slug = (document.body.getAttribute("data-slug") || window.location.pathname).toLowerCase()
    if (slug.indexOf("lpic-1") !== -1 || slug.indexOf("lpic1") !== -1) return { file: "lpic-1.apkg", label: "LPIC-1" }
    if (slug.indexOf("lpic-2") !== -1 || slug.indexOf("lpic2") !== -1) return { file: "lpic-2.apkg", label: "LPIC-2" }
    if (slug.indexOf("lpic-3") !== -1 || slug.indexOf("lpic3") !== -1) return { file: "lpic-3.apkg", label: "LPIC-3" }
    if (slug.indexOf("hacking") !== -1) return { file: "hacking-vault.apkg", label: "Hacking" }
    return null
  }

  /** Get the base URL for static assets (handles GitHub Pages subpath). */
  function getBaseUrl() {
    // Detect from our own script src (most reliable)
    var scripts = document.querySelectorAll('script[src*="study-tools"]')
    if (scripts.length > 0) {
      var src = scripts[0].getAttribute("src") || ""
      var idx = src.indexOf("/static/")
      if (idx > 0) return src.substring(0, idx)
    }
    // Fallback: check if we're on a subpath like /unix/
    var path = window.location.pathname
    var match = path.match(/^(\/[^/]+)\//)
    if (match) return match[1]
    return ""
  }

  // =========================================================================
  // FEATURE 1: Quiz Runner
  // =========================================================================

  function initQuizRunner() {
    // Find all h3 elements that match "Pregunta N"
    var articleEl =
      document.querySelector("article.popover-hint") ||
      document.querySelector("article") ||
      document.querySelector("#quartz-root .center")
    if (!articleEl) return

    var headings = articleEl.querySelectorAll("h3")
    var questions = []

    headings.forEach(function (h3) {
      if (!/^Pregunta\s+\d+/i.test(h3.textContent.trim())) return

      var q = {
        title: h3.textContent.trim(),
        textParts: [],
        options: [],
        correctLetter: "",
        explanation: "",
      }

      // Collect sibling elements until we hit the next h3 or h2, or end
      var sibling = h3.nextElementSibling
      var detailsFound = false

      while (sibling && !/^H[1-3]$/i.test(sibling.tagName)) {
        if (sibling.tagName === "DETAILS") {
          detailsFound = true
          // Parse the answer from the details block
          var detailContent = sibling.innerHTML
          // Find the bold answer, e.g. <strong>c) Option C</strong>
          var strongMatch = sibling.querySelector("strong")
          if (strongMatch) {
            var answerText = strongMatch.textContent.trim()
            // Extract the letter: first char before ')'
            var letterMatch = answerText.match(/^([a-dA-D])\)/)
            if (letterMatch) {
              q.correctLetter = letterMatch[1].toLowerCase()
            }
          }
          // The explanation is everything in <details> after the <summary>
          var explanationParts = []
          var detChildren = sibling.children
          for (var ci = 0; ci < detChildren.length; ci++) {
            if (detChildren[ci].tagName !== "SUMMARY") {
              explanationParts.push(detChildren[ci].innerHTML)
            }
          }
          q.explanation = explanationParts.join("")
        } else if (!detailsFound) {
          // Try to parse options from this element
          var text = sibling.innerHTML || ""
          // Check if this paragraph contains options (a) ... b) ... c) ... d) ...)
          if (/[a-dA-D]\)\s/.test(text)) {
            // Split on <br> or newline patterns to find each option
            var optionLines = text.split(/<br\s*\/?>|\n/).map(function (s) {
              return s.trim()
            })
            optionLines.forEach(function (line) {
              var m = line.match(/^([a-dA-D])\)\s*(.+)/)
              if (m) {
                q.options.push({
                  letter: m[1].toLowerCase(),
                  text: m[2].trim(),
                })
              }
            })
          } else {
            q.textParts.push(sibling.innerHTML)
          }
        }
        sibling = sibling.nextElementSibling
      }

      if (q.options.length > 0 && q.correctLetter) {
        questions.push(q)
      }
    })

    if (questions.length === 0) return

    // Hide original article content
    var originalHTML = articleEl.innerHTML
    articleEl.innerHTML = ""
    articleEl.classList.add("st-quiz-active")

    // Build quiz UI
    var container = el("div", "st-quiz")
    articleEl.appendChild(container)

    // State
    var mode = "practica" // "practica" or "examen"
    var currentIdx = 0
    var answers = new Array(questions.length).fill(null) // user selected letter
    var checked = new Array(questions.length).fill(false)
    var score = 0

    // --- Header ---
    var header = el("div", "st-quiz-header")
    container.appendChild(header)

    var modeToggle = el("div", "st-quiz-mode-toggle")
    header.appendChild(modeToggle)

    var btnPractica = el("button", "st-btn st-btn-mode st-active", "Modo Practica")
    var btnExamen = el("button", "st-btn st-btn-mode", "Modo Examen")
    modeToggle.appendChild(btnPractica)
    modeToggle.appendChild(btnExamen)

    btnPractica.addEventListener("click", function () {
      mode = "practica"
      btnPractica.classList.add("st-active")
      btnExamen.classList.remove("st-active")
    })
    btnExamen.addEventListener("click", function () {
      mode = "examen"
      btnExamen.classList.add("st-active")
      btnPractica.classList.remove("st-active")
    })

    var progressText = el("div", "st-quiz-progress")
    header.appendChild(progressText)

    var scoreText = el("div", "st-quiz-score")
    header.appendChild(scoreText)

    // --- Question area ---
    var questionArea = el("div", "st-quiz-question-area")
    container.appendChild(questionArea)

    // --- Navigation ---
    var nav = el("div", "st-quiz-nav")
    container.appendChild(nav)

    var btnPrev = el("button", "st-btn st-btn-nav", "Anterior")
    var btnCheck = el("button", "st-btn st-btn-check", "Comprobar")
    var btnNext = el("button", "st-btn st-btn-nav", "Siguiente")
    nav.appendChild(btnPrev)
    nav.appendChild(btnCheck)
    nav.appendChild(btnNext)

    // --- Results area (hidden initially) ---
    var resultsArea = el("div", "st-quiz-results st-hidden")
    container.appendChild(resultsArea)

    function updateProgress() {
      var answeredCount = answers.filter(function (a) {
        return a !== null
      }).length
      progressText.textContent =
        "Pregunta " + (currentIdx + 1) + " de " + questions.length + " (" + answeredCount + " respondidas)"
      score = 0
      for (var i = 0; i < questions.length; i++) {
        if (checked[i] && answers[i] === questions[i].correctLetter) {
          score++
        }
      }
      var checkedCount = checked.filter(Boolean).length
      scoreText.textContent = checkedCount > 0 ? "Puntuacion: " + score + "/" + checkedCount : ""
    }

    function renderQuestion() {
      questionArea.innerHTML = ""
      var q = questions[currentIdx]

      var card = el("div", "st-quiz-card")
      questionArea.appendChild(card)

      var titleEl = el("h3", "st-quiz-title", q.title)
      card.appendChild(titleEl)

      if (q.textParts.length > 0) {
        var textDiv = el("div", "st-quiz-text")
        textDiv.innerHTML = q.textParts.join("")
        card.appendChild(textDiv)
      }

      var optionsDiv = el("div", "st-quiz-options")
      card.appendChild(optionsDiv)

      q.options.forEach(function (opt) {
        var optBtn = el("label", "st-quiz-option")
        var radio = document.createElement("input")
        radio.type = "radio"
        radio.name = "st-quiz-q" + currentIdx
        radio.value = opt.letter
        if (answers[currentIdx] === opt.letter) {
          radio.checked = true
        }
        // If already checked in practica mode, disable
        if (checked[currentIdx]) {
          radio.disabled = true
        }

        var span = el("span", null, opt.letter + ") " + opt.text)
        optBtn.appendChild(radio)
        optBtn.appendChild(span)

        // Feedback classes
        if (checked[currentIdx]) {
          if (opt.letter === q.correctLetter) {
            optBtn.classList.add("st-correct")
          } else if (opt.letter === answers[currentIdx] && opt.letter !== q.correctLetter) {
            optBtn.classList.add("st-incorrect")
          }
        }

        radio.addEventListener("change", function () {
          if (!checked[currentIdx]) {
            answers[currentIdx] = opt.letter
          }
        })

        optionsDiv.appendChild(optBtn)
      })

      // Show explanation if already checked in practica mode
      if (checked[currentIdx] && mode === "practica") {
        showExplanation(card, q)
      }
      // In examen mode, show feedback after all checked
      if (checked[currentIdx] && mode === "examen") {
        showExplanation(card, q)
      }

      updateBtnStates()
      updateProgress()
    }

    function showExplanation(card, q) {
      var feedbackDiv = el("div", "st-quiz-feedback")
      if (answers[currentIdx] === q.correctLetter) {
        feedbackDiv.classList.add("st-feedback-correct")
        feedbackDiv.innerHTML = "<strong>¡Correcto!</strong>"
      } else {
        feedbackDiv.classList.add("st-feedback-incorrect")
        feedbackDiv.innerHTML =
          "<strong>Incorrecto.</strong> La respuesta correcta es <strong>" + q.correctLetter + ")</strong>"
      }
      card.appendChild(feedbackDiv)

      if (q.explanation) {
        var explDiv = el("div", "st-quiz-explanation")
        explDiv.innerHTML = "<strong>Explicacion:</strong> " + q.explanation
        card.appendChild(explDiv)
      }
    }

    function updateBtnStates() {
      btnPrev.disabled = currentIdx === 0
      btnNext.textContent = currentIdx === questions.length - 1 ? "Finalizar" : "Siguiente"

      if (checked[currentIdx]) {
        btnCheck.disabled = true
        btnCheck.textContent = "Comprobado"
      } else {
        btnCheck.disabled = false
        btnCheck.textContent = "Comprobar"
      }
    }

    btnCheck.addEventListener("click", function () {
      if (answers[currentIdx] === null) {
        // Highlight that user must select
        var opts = questionArea.querySelectorAll(".st-quiz-option")
        opts.forEach(function (o) {
          o.classList.add("st-shake")
          setTimeout(function () {
            o.classList.remove("st-shake")
          }, 500)
        })
        return
      }

      if (mode === "practica") {
        checked[currentIdx] = true
        renderQuestion()
      } else {
        // Examen mode: just mark answer recorded, don't reveal yet
        checked[currentIdx] = true
        btnCheck.disabled = true
        btnCheck.textContent = "Respondida"
        updateProgress()
      }
    })

    btnPrev.addEventListener("click", function () {
      if (currentIdx > 0) {
        currentIdx--
        renderQuestion()
      }
    })

    btnNext.addEventListener("click", function () {
      if (currentIdx < questions.length - 1) {
        currentIdx++
        renderQuestion()
      } else {
        // Finish
        finishQuiz()
      }
    })

    function finishQuiz() {
      // In examen mode, reveal all answers now
      if (mode === "examen") {
        for (var i = 0; i < questions.length; i++) {
          if (answers[i] !== null) {
            checked[i] = true
          }
        }
      }

      // Calculate final score
      score = 0
      var totalAnswered = 0
      for (var j = 0; j < questions.length; j++) {
        if (checked[j]) {
          totalAnswered++
          if (answers[j] === questions[j].correctLetter) {
            score++
          }
        }
      }

      var pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0

      // Save best score
      var subtema = getSubtema()
      var key = QUIZ_PREFIX + subtema
      var prev = lsGet(key)
      var entry = {
        score: score,
        total: questions.length,
        answered: totalAnswered,
        percentage: pct,
        date: new Date().toISOString(),
        mode: mode,
      }
      if (!prev || pct > (prev.bestPercentage || 0)) {
        entry.bestPercentage = pct
        entry.bestScore = score
        entry.bestTotal = questions.length
      } else {
        entry.bestPercentage = prev.bestPercentage
        entry.bestScore = prev.bestScore
        entry.bestTotal = prev.bestTotal
      }
      lsSet(key, entry)

      // Show results
      questionArea.classList.add("st-hidden")
      nav.classList.add("st-hidden")
      resultsArea.classList.remove("st-hidden")
      resultsArea.innerHTML = ""

      var resCard = el("div", "st-quiz-results-card")
      resultsArea.appendChild(resCard)

      var resTitle = el("h2", "st-quiz-results-title", "Resultados")
      resCard.appendChild(resTitle)

      var resScore = el("div", "st-quiz-results-score")
      resScore.innerHTML =
        '<span class="st-big-number">' +
        score +
        "</span> / " +
        totalAnswered +
        ' correctas (<span class="st-big-number">' +
        pct +
        "%</span>)"
      resCard.appendChild(resScore)

      // Progress bar
      var progressBar = el("div", "st-progress-bar-container")
      var progressFill = el("div", "st-progress-bar-fill")
      progressFill.style.width = pct + "%"
      if (pct >= 70) {
        progressFill.classList.add("st-progress-good")
      } else if (pct >= 50) {
        progressFill.classList.add("st-progress-ok")
      } else {
        progressFill.classList.add("st-progress-bad")
      }
      progressBar.appendChild(progressFill)
      resCard.appendChild(progressBar)

      if (prev && prev.bestPercentage !== undefined) {
        var best = el(
          "p",
          "st-quiz-best",
          "Mejor puntuacion anterior: " + (prev.bestPercentage || 0) + "%"
        )
        resCard.appendChild(best)
      }

      // Per-question breakdown
      var breakdown = el("div", "st-quiz-breakdown")
      resCard.appendChild(breakdown)
      var breakdownTitle = el("h3", null, "Desglose por pregunta")
      breakdown.appendChild(breakdownTitle)

      questions.forEach(function (q, idx) {
        var item = el("div", "st-quiz-breakdown-item")
        var isCorrect = answers[idx] === q.correctLetter
        item.classList.add(isCorrect ? "st-bd-correct" : "st-bd-incorrect")

        var label = el("span", "st-bd-label", q.title)
        var status = el(
          "span",
          "st-bd-status",
          isCorrect ? "Correcto" : "Incorrecto (" + (answers[idx] || "-") + " → " + q.correctLetter + ")"
        )
        item.appendChild(label)
        item.appendChild(status)
        breakdown.appendChild(item)
      })

      // Buttons
      var resActions = el("div", "st-quiz-results-actions")
      resCard.appendChild(resActions)

      var btnRetry = el("button", "st-btn st-btn-primary", "Reintentar")
      btnRetry.addEventListener("click", function () {
        currentIdx = 0
        answers = new Array(questions.length).fill(null)
        checked = new Array(questions.length).fill(false)
        score = 0
        questionArea.classList.remove("st-hidden")
        nav.classList.remove("st-hidden")
        resultsArea.classList.add("st-hidden")
        renderQuestion()
      })
      resActions.appendChild(btnRetry)

      if (mode === "examen") {
        var btnReview = el("button", "st-btn st-btn-secondary", "Revisar respuestas")
        btnReview.addEventListener("click", function () {
          currentIdx = 0
          questionArea.classList.remove("st-hidden")
          nav.classList.remove("st-hidden")
          resultsArea.classList.add("st-hidden")
          renderQuestion()
        })
        resActions.appendChild(btnReview)
      }
    }

    // Start
    renderQuestion()

    // Cleanup function for Quartz SPA navigation
    function cleanup() {
      articleEl.innerHTML = originalHTML
      articleEl.classList.remove("st-quiz-active")
    }
    if (window.addCleanup) {
      window.addCleanup(cleanup)
    }
  }

  // =========================================================================
  // FEATURE 2: Flashcard Viewer with SM-2
  // =========================================================================

  function initFlashcardViewer() {
    var articleEl =
      document.querySelector("article.popover-hint") ||
      document.querySelector("article") ||
      document.querySelector("#quartz-root .center")
    if (!articleEl) return

    // Strategy 1: Look for structured flashcard elements
    var cards = []
    var deckEl = articleEl.querySelector(".flashcard-deck")

    if (deckEl) {
      var cardEls = deckEl.querySelectorAll(".flashcard")
      cardEls.forEach(function (cardEl) {
        var id = cardEl.getAttribute("data-id") || ""
        var front = cardEl.querySelector(".flashcard-front")
        var back = cardEl.querySelector(".flashcard-back")
        if (front && back) {
          cards.push({
            id: id,
            front: front.innerHTML,
            back: back.innerHTML,
          })
        }
      })
    }

    // Strategy 2: Fallback — parse content between <hr> elements as Q&A pairs
    if (cards.length === 0) {
      var hrs = articleEl.querySelectorAll("hr")
      if (hrs.length === 0) return

      hrs.forEach(function (hr, idx) {
        // Collect content before this hr (question) and after (answer)
        var questionParts = []
        var answerParts = []

        // Question: elements between previous hr (or start) and this hr
        var prev = hr.previousElementSibling
        while (prev && prev.tagName !== "HR") {
          questionParts.unshift(prev.outerHTML)
          prev = prev.previousElementSibling
        }

        // Answer: elements between this hr and next hr (or end)
        var next = hr.nextElementSibling
        while (next && next.tagName !== "HR") {
          answerParts.push(next.outerHTML)
          next = next.nextElementSibling
        }

        if (questionParts.length > 0 && answerParts.length > 0) {
          cards.push({
            id: getSubtema() + "_fc_" + idx,
            front: questionParts.join(""),
            back: answerParts.join(""),
          })
        }
      })
    }

    if (cards.length === 0) return

    // Load SM-2 state for each card
    cards.forEach(function (card) {
      var state = lsGet(FC_PREFIX + card.id)
      if (state) {
        card.easeFactor = state.easeFactor || 2.5
        card.interval = state.interval || 1
        card.repetitions = state.repetitions || 0
        card.nextReview = state.nextReview || todayStr()
        card.lastReview = state.lastReview || null
        card.lastQuality = state.lastQuality !== undefined ? state.lastQuality : null
      } else {
        card.easeFactor = 2.5
        card.interval = 1
        card.repetitions = 0
        card.nextReview = todayStr()
        card.lastReview = null
        card.lastQuality = null
      }
    })

    // Sort: due cards first, then by next review date
    var today = todayStr()
    var dueCards = cards.filter(function (c) {
      return c.nextReview <= today
    })
    var futureCards = cards.filter(function (c) {
      return c.nextReview > today
    })

    // Shuffle due cards for variety
    shuffle(dueCards)

    var studyOrder = dueCards.concat(futureCards)

    // Hide original content
    var originalHTML = articleEl.innerHTML
    articleEl.innerHTML = ""
    articleEl.classList.add("st-fc-active")

    var container = el("div", "st-fc")
    articleEl.appendChild(container)

    // State
    var currentIdx = 0
    var isFlipped = false
    var sessionResults = [] // { cardId, quality }

    // --- Header ---
    var header = el("div", "st-fc-header")
    container.appendChild(header)

    var dueInfo = el("div", "st-fc-due-info")
    dueInfo.textContent =
      dueCards.length +
      " tarjeta" +
      (dueCards.length !== 1 ? "s" : "") +
      " pendiente" +
      (dueCards.length !== 1 ? "s" : "") +
      " hoy — " +
      cards.length +
      " total" +
      (cards.length !== 1 ? "es" : "")
    header.appendChild(dueInfo)

    // --- Anki download button ---
    var ankiCert = detectAnkiCert()
    if (ankiCert) {
      var ankiBtn = el("a", "st-btn st-btn-anki")
      ankiBtn.href = getBaseUrl() + "/anki/" + ankiCert.file
      ankiBtn.download = ankiCert.file
      ankiBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ' +
        "Anki (" + ankiCert.label + ")"
      header.appendChild(ankiBtn)
    }

    var progressBar = el("div", "st-progress-bar-container")
    var progressFill = el("div", "st-progress-bar-fill st-progress-good")
    progressBar.appendChild(progressFill)
    header.appendChild(progressBar)

    var countText = el("div", "st-fc-count")
    header.appendChild(countText)

    // --- Card area ---
    var cardArea = el("div", "st-fc-card-area")
    container.appendChild(cardArea)

    var cardOuter = el("div", "st-fc-card-outer")
    cardArea.appendChild(cardOuter)

    var cardInner = el("div", "st-fc-card-inner")
    cardOuter.appendChild(cardInner)

    var cardFront = el("div", "st-fc-card-front")
    var cardBack = el("div", "st-fc-card-back")
    cardInner.appendChild(cardFront)
    cardInner.appendChild(cardBack)

    // Flip instruction
    var flipHint = el("div", "st-fc-flip-hint", "Clic o Espacio para voltear")
    container.appendChild(flipHint)

    // --- Rating buttons (hidden until flipped) ---
    var ratingArea = el("div", "st-fc-rating st-hidden")
    container.appendChild(ratingArea)

    var ratingLabel = el("div", "st-fc-rating-label", "¿Que tal lo recordaste?")
    ratingArea.appendChild(ratingLabel)

    var ratingBtns = el("div", "st-fc-rating-btns")
    ratingArea.appendChild(ratingBtns)

    var ratings = [
      { quality: 0, label: "Olvide", cls: "st-rating-0" },
      { quality: 2, label: "Dificil", cls: "st-rating-2" },
      { quality: 3, label: "Bien", cls: "st-rating-3" },
      { quality: 4, label: "Facil", cls: "st-rating-4" },
      { quality: 5, label: "Perfecto", cls: "st-rating-5" },
    ]

    ratings.forEach(function (r) {
      var btn = el("button", "st-btn st-btn-rating " + r.cls, r.label)
      btn.addEventListener("click", function () {
        rateCard(r.quality)
      })
      ratingBtns.appendChild(btn)
    })

    // --- Summary (hidden) ---
    var summaryArea = el("div", "st-fc-summary st-hidden")
    container.appendChild(summaryArea)

    function updateDisplay() {
      if (currentIdx >= studyOrder.length) {
        showSummary()
        return
      }

      var card = studyOrder[currentIdx]
      isFlipped = false
      cardOuter.classList.remove("st-flipped")
      ratingArea.classList.add("st-hidden")
      flipHint.classList.remove("st-hidden")

      cardFront.innerHTML = card.front
      cardBack.innerHTML = card.back

      var pct = studyOrder.length > 0 ? Math.round((currentIdx / studyOrder.length) * 100) : 0
      progressFill.style.width = pct + "%"
      countText.textContent = (currentIdx + 1) + " / " + studyOrder.length
    }

    function flipCard() {
      if (currentIdx >= studyOrder.length) return
      if (isFlipped) return
      isFlipped = true
      cardOuter.classList.add("st-flipped")
      ratingArea.classList.remove("st-hidden")
      flipHint.classList.add("st-hidden")
    }

    function rateCard(quality) {
      var card = studyOrder[currentIdx]

      // SM-2 algorithm
      if (quality >= 3) {
        if (card.repetitions === 0) {
          card.interval = 1
        } else if (card.repetitions === 1) {
          card.interval = 6
        } else {
          card.interval = Math.round(card.interval * card.easeFactor)
        }
        card.repetitions++
      } else {
        card.repetitions = 0
        card.interval = 1
      }

      card.easeFactor = Math.max(
        1.3,
        card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      )

      card.lastReview = todayStr()
      card.nextReview = addDays(new Date(), card.interval)
      card.lastQuality = quality

      // Save to localStorage
      lsSet(FC_PREFIX + card.id, {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
        nextReview: card.nextReview,
        lastReview: card.lastReview,
        lastQuality: card.lastQuality,
      })

      sessionResults.push({ cardId: card.id, quality: quality })

      currentIdx++
      updateDisplay()
    }

    function showSummary() {
      cardArea.classList.add("st-hidden")
      flipHint.classList.add("st-hidden")
      ratingArea.classList.add("st-hidden")
      summaryArea.classList.remove("st-hidden")
      summaryArea.innerHTML = ""

      var sumCard = el("div", "st-fc-summary-card")
      summaryArea.appendChild(sumCard)

      var sumTitle = el("h2", "st-fc-summary-title", "Sesion completada")
      sumCard.appendChild(sumTitle)

      var totalReviewed = sessionResults.length
      var forgotten = sessionResults.filter(function (r) {
        return r.quality < 3
      }).length
      var good = sessionResults.filter(function (r) {
        return r.quality >= 3
      }).length

      var stats = el("div", "st-fc-summary-stats")
      stats.innerHTML =
        '<div class="st-fc-stat">' +
        '<span class="st-fc-stat-number">' +
        totalReviewed +
        "</span>" +
        '<span class="st-fc-stat-label">Tarjetas revisadas</span>' +
        "</div>" +
        '<div class="st-fc-stat">' +
        '<span class="st-fc-stat-number st-text-green">' +
        good +
        "</span>" +
        '<span class="st-fc-stat-label">Recordadas</span>' +
        "</div>" +
        '<div class="st-fc-stat">' +
        '<span class="st-fc-stat-number st-text-red">' +
        forgotten +
        "</span>" +
        '<span class="st-fc-stat-label">Olvidadas</span>' +
        "</div>"
      sumCard.appendChild(stats)

      // Breakdown
      if (sessionResults.length > 0) {
        var ratingLabels = { 0: "Olvide", 2: "Dificil", 3: "Bien", 4: "Facil", 5: "Perfecto" }
        var breakdownTitle = el("h3", null, "Detalle de respuestas")
        sumCard.appendChild(breakdownTitle)

        var dist = {}
        sessionResults.forEach(function (r) {
          var label = ratingLabels[r.quality] || "Q" + r.quality
          dist[label] = (dist[label] || 0) + 1
        })

        var distDiv = el("div", "st-fc-dist")
        Object.keys(dist).forEach(function (label) {
          var row = el("div", "st-fc-dist-row")
          row.innerHTML =
            '<span class="st-fc-dist-label">' +
            label +
            "</span>" +
            '<span class="st-fc-dist-count">' +
            dist[label] +
            "</span>"
          distDiv.appendChild(row)
        })
        sumCard.appendChild(distDiv)
      }

      // Actions
      var actions = el("div", "st-fc-summary-actions")
      sumCard.appendChild(actions)

      var btnRestart = el("button", "st-btn st-btn-primary", "Estudiar de nuevo")
      btnRestart.addEventListener("click", function () {
        currentIdx = 0
        sessionResults = []
        shuffle(studyOrder)
        cardArea.classList.remove("st-hidden")
        summaryArea.classList.add("st-hidden")
        updateDisplay()
      })
      actions.appendChild(btnRestart)
    }

    // Event listeners
    cardOuter.addEventListener("click", flipCard)

    function onKeyDown(e) {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault()
        if (!isFlipped) {
          flipCard()
        }
      }
      // Arrow keys for quick rating after flip
      if (isFlipped && currentIdx < studyOrder.length) {
        var keyMap = { "1": 0, "2": 2, "3": 3, "4": 4, "5": 5 }
        if (keyMap[e.key] !== undefined) {
          rateCard(keyMap[e.key])
        }
      }
    }
    document.addEventListener("keydown", onKeyDown)

    // Start
    updateDisplay()

    // Cleanup
    function cleanup() {
      document.removeEventListener("keydown", onKeyDown)
      articleEl.innerHTML = originalHTML
      articleEl.classList.remove("st-fc-active")
    }
    if (window.addCleanup) {
      window.addCleanup(cleanup)
    }
  }

  // =========================================================================
  // FEATURE 3: Dashboard
  // =========================================================================

  function initDashboard() {
    var dashEl = document.getElementById("study-dashboard")
    if (!dashEl) return

    dashEl.innerHTML = ""
    dashEl.classList.add("st-dashboard")

    // Gather data from localStorage
    var allKeys = lsAllKeys()
    var quizEntries = []
    var fcEntries = []

    allKeys.forEach(function (key) {
      if (key.startsWith(QUIZ_PREFIX)) {
        var data = lsGet(key)
        if (data) {
          data._key = key
          data._subtema = key.slice(QUIZ_PREFIX.length)
          quizEntries.push(data)
        }
      } else if (key.startsWith(FC_PREFIX)) {
        var fcData = lsGet(key)
        if (fcData) {
          fcData._key = key
          fcData._cardId = key.slice(FC_PREFIX.length)
          fcEntries.push(fcData)
        }
      }
    })

    // --- Title ---
    var title = el("h2", "st-dash-title", "Panel de estudio LPIC")
    dashEl.appendChild(title)

    // --- Stats overview ---
    var statsGrid = el("div", "st-dash-stats-grid")
    dashEl.appendChild(statsGrid)

    // Total quizzes done
    var quizCount = quizEntries.length
    addStatCard(statsGrid, quizCount.toString(), "Quizzes realizados", "st-stat-blue")

    // Total flashcards tracked
    var fcCount = fcEntries.length
    addStatCard(statsGrid, fcCount.toString(), "Flashcards en seguimiento", "st-stat-purple")

    // Flashcards due today
    var today = todayStr()
    var fcDue = fcEntries.filter(function (fc) {
      return (fc.nextReview || today) <= today
    }).length
    addStatCard(statsGrid, fcDue.toString(), "Flashcards pendientes hoy", "st-stat-orange")

    // Average quiz score
    var avgScore = 0
    if (quizEntries.length > 0) {
      var totalPct = 0
      quizEntries.forEach(function (q) {
        totalPct += q.percentage || 0
      })
      avgScore = Math.round(totalPct / quizEntries.length)
    }
    addStatCard(statsGrid, avgScore + "%", "Puntuacion media", "st-stat-green")

    // --- LPIC Progress ---
    var progressSection = el("div", "st-dash-section")
    dashEl.appendChild(progressSection)
    var progTitle = el("h3", "st-dash-section-title", "Progreso por certificacion")
    progressSection.appendChild(progTitle)

    var lpicLevels = [
      { key: "lpic-1", label: "LPIC-1", color: "st-progress-lpic1" },
      { key: "lpic-2", label: "LPIC-2", color: "st-progress-lpic2" },
      { key: "lpic-3", label: "LPIC-3", color: "st-progress-lpic3" },
    ]

    lpicLevels.forEach(function (level) {
      var levelQuizzes = quizEntries.filter(function (q) {
        return q._subtema.toLowerCase().includes(level.key)
      })
      var count = levelQuizzes.length
      var avgPct = 0
      if (count > 0) {
        var sum = 0
        levelQuizzes.forEach(function (q) {
          sum += q.bestPercentage || q.percentage || 0
        })
        avgPct = Math.round(sum / count)
      }

      var row = el("div", "st-dash-progress-row")
      progressSection.appendChild(row)

      var rowLabel = el("div", "st-dash-progress-label")
      rowLabel.innerHTML =
        "<strong>" + level.label + "</strong> — " + count + " quiz" + (count !== 1 ? "zes" : "") + " completado" + (count !== 1 ? "s" : "")
      row.appendChild(rowLabel)

      var bar = el("div", "st-progress-bar-container")
      var fill = el("div", "st-progress-bar-fill " + level.color)
      fill.style.width = avgPct + "%"
      bar.appendChild(fill)
      row.appendChild(bar)

      var pctLabel = el("div", "st-dash-progress-pct", avgPct + "%")
      row.appendChild(pctLabel)
    })

    // --- Recent quiz scores ---
    if (quizEntries.length > 0) {
      var recentSection = el("div", "st-dash-section")
      dashEl.appendChild(recentSection)
      var recentTitle = el("h3", "st-dash-section-title", "Puntuaciones recientes")
      recentSection.appendChild(recentTitle)

      // Sort by date, most recent first
      var sorted = quizEntries.slice().sort(function (a, b) {
        return (b.date || "").localeCompare(a.date || "")
      })

      var recentList = el("div", "st-dash-recent-list")
      recentSection.appendChild(recentList)

      sorted.slice(0, 10).forEach(function (q) {
        var item = el("div", "st-dash-recent-item")
        var subtemaLabel = q._subtema.replace(/_/g, "/")
        var dateStr = q.date ? new Date(q.date).toLocaleDateString("es-ES") : "—"
        var pct = q.percentage || 0

        item.innerHTML =
          '<div class="st-dash-recent-name">' +
          subtemaLabel +
          '</div><div class="st-dash-recent-meta">' +
          '<span class="st-dash-recent-score ' +
          (pct >= 70 ? "st-text-green" : pct >= 50 ? "st-text-orange" : "st-text-red") +
          '">' +
          pct +
          "%</span>" +
          '<span class="st-dash-recent-date">' +
          dateStr +
          "</span>" +
          '<span class="st-dash-recent-mode">' +
          (q.mode === "examen" ? "Examen" : "Practica") +
          "</span>" +
          "</div>"
        recentList.appendChild(item)
      })
    }

    // --- Quick nav ---
    var navSection = el("div", "st-dash-section")
    dashEl.appendChild(navSection)
    var navTitle = el("h3", "st-dash-section-title", "Navegacion rapida")
    navSection.appendChild(navTitle)

    var navGrid = el("div", "st-dash-nav-grid")
    navSection.appendChild(navGrid)

    var navLinks = [
      { label: "LPIC-1 Temas", href: "/lpic-1/" },
      { label: "LPIC-2 Temas", href: "/lpic-2/" },
      { label: "LPIC-3 Temas", href: "/lpic-3/" },
      { label: "Todos los comandos", href: "/comandos/" },
    ]

    navLinks.forEach(function (link) {
      var a = document.createElement("a")
      a.href = link.href
      a.className = "st-dash-nav-btn st-btn"
      a.textContent = link.label
      navGrid.appendChild(a)
    })

    // Cleanup
    function cleanup() {
      dashEl.innerHTML = ""
      dashEl.classList.remove("st-dashboard")
    }
    if (window.addCleanup) {
      window.addCleanup(cleanup)
    }
  }

  function addStatCard(parent, value, label, colorClass) {
    var card = el("div", "st-dash-stat-card " + (colorClass || ""))
    card.innerHTML =
      '<div class="st-dash-stat-value">' + value + "</div>" + '<div class="st-dash-stat-label">' + label + "</div>"
    parent.appendChild(card)
  }

  // =========================================================================
  // FEATURE 4: Data Portability
  // =========================================================================

  function initPortability() {
    var portEl = document.getElementById("study-portability")
    if (!portEl) return

    portEl.innerHTML = ""
    portEl.classList.add("st-portability")

    var title = el("h3", "st-port-title", "Gestion de datos")
    portEl.appendChild(title)

    var desc = el("p", "st-port-desc", "Exporta o importa tus datos de estudio para transferirlos entre dispositivos o hacer una copia de seguridad.")
    portEl.appendChild(desc)

    var btnRow = el("div", "st-port-btn-row")
    portEl.appendChild(btnRow)

    // Export button
    var btnExport = el("button", "st-btn st-btn-primary", "Exportar datos")
    btnExport.addEventListener("click", function () {
      exportData()
    })
    btnRow.appendChild(btnExport)

    // Import button + hidden file input
    var btnImport = el("button", "st-btn st-btn-secondary", "Importar datos")
    var fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".jsonl,.json,.txt"
    fileInput.style.display = "none"

    btnImport.addEventListener("click", function () {
      fileInput.click()
    })

    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) {
        importData(fileInput.files[0])
      }
      fileInput.value = ""
    })

    btnRow.appendChild(btnImport)
    btnRow.appendChild(fileInput)

    // Status area
    var statusArea = el("div", "st-port-status")
    portEl.appendChild(statusArea)

    // Data count
    var allKeys = lsAllKeys()
    var countInfo = el("p", "st-port-count", "Datos almacenados: " + allKeys.length + " entradas con prefijo '" + LS_PREFIX + "'")
    portEl.appendChild(countInfo)

    // Clear data button
    var dangerZone = el("div", "st-port-danger")
    portEl.appendChild(dangerZone)

    var dangerTitle = el("h4", "st-port-danger-title", "Zona de peligro")
    dangerZone.appendChild(dangerTitle)

    var btnClear = el("button", "st-btn st-btn-danger", "Borrar todos los datos")
    btnClear.addEventListener("click", function () {
      if (confirm("¿Estas seguro de que quieres borrar todos los datos de estudio? Esta accion no se puede deshacer.")) {
        var keys = lsAllKeys()
        keys.forEach(function (k) {
          localStorage.removeItem(k)
        })
        statusArea.textContent = "Se eliminaron " + keys.length + " entradas."
        statusArea.classList.add("st-port-status-warn")
        countInfo.textContent = "Datos almacenados: 0 entradas"
        // Refresh dashboard if present
        initDashboard()
      }
    })
    dangerZone.appendChild(btnClear)

    function exportData() {
      var keys = lsAllKeys()
      if (keys.length === 0) {
        statusArea.textContent = "No hay datos para exportar."
        statusArea.classList.remove("st-port-status-ok")
        statusArea.classList.add("st-port-status-warn")
        return
      }

      var lines = []
      keys.forEach(function (key) {
        try {
          var val = localStorage.getItem(key)
          var entry = {
            key: key,
            value: JSON.parse(val),
            exportedAt: new Date().toISOString(),
          }
          lines.push(JSON.stringify(entry))
        } catch (_) {
          // Skip non-JSON entries
        }
      })

      var content = lines.join("\n")
      var blob = new Blob([content], { type: "application/x-jsonlines" })
      var url = URL.createObjectURL(blob)

      var a = document.createElement("a")
      a.href = url
      a.download = "lpic-study-backup-" + todayStr() + ".jsonl"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      statusArea.textContent = "Exportados " + lines.length + " entradas correctamente."
      statusArea.classList.remove("st-port-status-warn")
      statusArea.classList.add("st-port-status-ok")
    }

    function importData(file) {
      var reader = new FileReader()
      reader.onload = function (e) {
        var text = e.target.result
        var lines = text.split("\n").filter(function (l) {
          return l.trim().length > 0
        })

        var imported = 0
        var skipped = 0
        var errors = 0

        lines.forEach(function (line) {
          try {
            var entry = JSON.parse(line)
            if (!entry.key || entry.value === undefined) {
              errors++
              return
            }

            // Only import our prefixed keys
            if (!entry.key.startsWith(LS_PREFIX)) {
              skipped++
              return
            }

            // Merge strategy: keep the entry with the more recent date
            var existing = lsGet(entry.key)
            if (existing) {
              var existingDate = existing.date || existing.lastReview || existing.exportedAt || ""
              var importDate = entry.value.date || entry.value.lastReview || entry.exportedAt || ""
              if (existingDate && importDate && existingDate > importDate) {
                skipped++
                return
              }
            }

            lsSet(entry.key, entry.value)
            imported++
          } catch (_) {
            errors++
          }
        })

        statusArea.innerHTML =
          "Importacion completada: <strong>" +
          imported +
          "</strong> importadas, <strong>" +
          skipped +
          "</strong> omitidas, <strong>" +
          errors +
          "</strong> errores."
        statusArea.classList.remove("st-port-status-warn")
        statusArea.classList.add("st-port-status-ok")

        // Update count
        var newKeys = lsAllKeys()
        countInfo.textContent = "Datos almacenados: " + newKeys.length + " entradas con prefijo '" + LS_PREFIX + "'"

        // Refresh dashboard if present
        initDashboard()
      }

      reader.onerror = function () {
        statusArea.textContent = "Error al leer el archivo."
        statusArea.classList.remove("st-port-status-ok")
        statusArea.classList.add("st-port-status-warn")
      }

      reader.readAsText(file)
    }

    // Cleanup
    function cleanup() {
      portEl.innerHTML = ""
      portEl.classList.remove("st-portability")
    }
    if (window.addCleanup) {
      window.addCleanup(cleanup)
    }
  }

  // =========================================================================
  // INITIALIZATION & SPA NAVIGATION
  // =========================================================================

  function detectAndInit() {
    // Detect page type by inspecting DOM content

    // 1. Check for quiz (ejercicios) pages: h3 elements starting with "Pregunta"
    var articleEl =
      document.querySelector("article.popover-hint") ||
      document.querySelector("article") ||
      document.querySelector("#quartz-root .center")

    if (articleEl) {
      var h3s = articleEl.querySelectorAll("h3")
      var hasPregunta = false
      h3s.forEach(function (h3) {
        if (/^Pregunta\s+\d+/i.test(h3.textContent.trim())) {
          hasPregunta = true
        }
      })

      if (hasPregunta) {
        initQuizRunner()
        return
      }

      // 2. Check for flashcard pages
      var hasFlashcardDeck = !!articleEl.querySelector(".flashcard-deck")
      var hrs = articleEl.querySelectorAll("hr")
      // Only treat as flashcard page if there are multiple hr elements
      // suggesting Q/A pairs, and no quiz content detected
      if (hasFlashcardDeck) {
        initFlashcardViewer()
        return
      }
    }

    // 3. Check for dashboard
    if (document.getElementById("study-dashboard")) {
      initDashboard()
    }

    // 4. Check for portability section
    if (document.getElementById("study-portability")) {
      initPortability()
    }

    // 5. Check for flashcard fallback (hr-based) only if we find
    //    certain signals that this is a flashcard page
    if (articleEl) {
      var slug = document.body.getAttribute("data-slug") || ""
      var isFlashcardPage = slug.toLowerCase().includes("flashcard")
      if (isFlashcardPage) {
        var hrCount = articleEl.querySelectorAll("hr").length
        if (hrCount >= 1) {
          initFlashcardViewer()
          return
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Exam Simulator
  // ---------------------------------------------------------------------------

  var examTimerInterval = null

  function initExamSimulator() {
    var sims = document.querySelectorAll(".exam-simulator")
    if (!sims.length) return

    sims.forEach(function (sim) {
      // Hide all answer details initially
      var answers = sim.querySelectorAll(".exam-answer")
      answers.forEach(function (a) { a.style.display = "none" })

      // Make checkboxes into radio-like behavior per question
      var questions = sim.querySelectorAll(".exam-question")
      questions.forEach(function (q) {
        var items = q.querySelectorAll("li")
        items.forEach(function (li) {
          li.style.cursor = "pointer"
          li.addEventListener("click", function () {
            // Deselect siblings
            items.forEach(function (s) {
              s.classList.remove("exam-selected")
              var cb = s.querySelector("input[type=checkbox]")
              if (cb) cb.checked = false
            })
            // Select this one
            li.classList.add("exam-selected")
            var cb = li.querySelector("input[type=checkbox]")
            if (cb) cb.checked = true
          })
        })
      })
    })
  }

  window.startExamTimer = function (simEl) {
    var duration = parseInt(simEl.getAttribute("data-duration") || "90", 10)
    var timerDiv = simEl.querySelector(".exam-timer")
    var timeSpan = simEl.querySelector(".exam-time")
    var submitBtn = simEl.querySelector(".exam-submit-btn")

    if (timerDiv) timerDiv.style.display = "block"
    if (submitBtn) submitBtn.style.display = "inline-block"

    var remaining = duration * 60 // seconds

    function updateDisplay() {
      var mins = Math.floor(remaining / 60)
      var secs = remaining % 60
      if (timeSpan) {
        timeSpan.textContent = mins + ":" + (secs < 10 ? "0" : "") + secs
      }
      if (remaining <= 300 && timerDiv) {
        timerDiv.classList.add("exam-timer-warning")
      }
    }

    updateDisplay()

    if (examTimerInterval) clearInterval(examTimerInterval)
    examTimerInterval = setInterval(function () {
      remaining--
      updateDisplay()
      if (remaining <= 0) {
        clearInterval(examTimerInterval)
        window.gradeExam(simEl)
      }
    }, 1000)
  }

  window.gradeExam = function (simEl) {
    if (examTimerInterval) {
      clearInterval(examTimerInterval)
      examTimerInterval = null
    }

    var questions = simEl.querySelectorAll(".exam-question")
    var correct = 0
    var total = questions.length
    var subtemaStats = {}

    questions.forEach(function (q) {
      var correctLetter = (q.getAttribute("data-correct") || "").trim().toLowerCase()
      var subtema = q.getAttribute("data-subtema") || "?"
      var selected = q.querySelector("li.exam-selected")
      var userLetter = ""

      if (selected) {
        var text = selected.textContent.trim()
        var letterMatch = text.match(/^([a-d])\)/)
        if (letterMatch) userLetter = letterMatch[1]
      }

      var isCorrect = userLetter === correctLetter

      // Visual feedback
      q.classList.add(isCorrect ? "exam-correct" : "exam-wrong")
      if (!isCorrect) {
        // Highlight the correct option
        var items = q.querySelectorAll("li")
        items.forEach(function (li) {
          var t = li.textContent.trim()
          if (t.indexOf(correctLetter + ")") === 0) {
            li.classList.add("exam-correct-option")
          }
        })
      }

      // Show answer explanation
      var answerDetail = q.querySelector(".exam-answer")
      if (answerDetail) answerDetail.style.display = "block"

      if (isCorrect) correct++

      // Track per-subtema
      if (!subtemaStats[subtema]) subtemaStats[subtema] = { correct: 0, total: 0 }
      subtemaStats[subtema].total++
      if (isCorrect) subtemaStats[subtema].correct++
    })

    // Show results
    var resultsDiv = simEl.querySelector(".exam-results")
    if (resultsDiv) {
      resultsDiv.style.display = "block"
      var pct = total > 0 ? Math.round((correct / total) * 100) : 0
      var passed = pct >= 65

      var scoreDiv = resultsDiv.querySelector(".exam-score")
      if (scoreDiv) {
        scoreDiv.innerHTML =
          '<h3 class="' + (passed ? "exam-passed" : "exam-failed") + '">' +
          (passed ? "APROBADO" : "SUSPENSO") + " - " + pct + "%" +
          "</h3>" +
          "<p>" + correct + " de " + total + " preguntas correctas</p>"
      }

      var breakdownDiv = resultsDiv.querySelector(".exam-breakdown")
      if (breakdownDiv) {
        var html = "<h4>Desglose por subtema:</h4><table><tr><th>Subtema</th><th>Aciertos</th><th>%</th></tr>"
        Object.keys(subtemaStats).sort().forEach(function (st) {
          var s = subtemaStats[st]
          var stPct = Math.round((s.correct / s.total) * 100)
          html += "<tr><td>" + st + "</td><td>" + s.correct + "/" + s.total +
            "</td><td>" + stPct + "%</td></tr>"
        })
        html += "</table>"
        breakdownDiv.innerHTML = html
      }
    }

    // Hide submit, show timer as final
    var submitBtn = simEl.querySelector(".exam-submit-btn")
    if (submitBtn) submitBtn.style.display = "none"
    var timerDiv = simEl.querySelector(".exam-timer")
    if (timerDiv) timerDiv.innerHTML = "<strong>Examen finalizado</strong>"

    // Scroll to results
    if (resultsDiv) resultsDiv.scrollIntoView({ behavior: "smooth" })

    // Save to localStorage
    var examId = simEl.getAttribute("data-exam") || "unknown"
    lsSet(LS_PREFIX + "exam:" + examId, {
      date: new Date().toISOString(),
      score: pct,
      correct: correct,
      total: total,
      breakdown: subtemaStats
    })
  }

  // ---------------------------------------------------------------------------
  // Copy-to-clipboard buttons on code blocks
  // ---------------------------------------------------------------------------

  function initCopyButtons() {
    var blocks = document.querySelectorAll("pre > code")
    blocks.forEach(function (code) {
      var pre = code.parentElement
      if (!pre || pre.querySelector(".copy-btn")) return

      pre.style.position = "relative"

      var btn = document.createElement("button")
      btn.className = "copy-btn"
      btn.setAttribute("aria-label", "Copiar comando")
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'

      btn.addEventListener("click", function () {
        var text = code.textContent || ""
        navigator.clipboard.writeText(text).then(function () {
          btn.classList.add("copy-ok")
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
          setTimeout(function () {
            btn.classList.remove("copy-ok")
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
          }, 1500)
        })
      })

      pre.appendChild(btn)
    })
  }

  // ---------------------------------------------------------------------------
  // Entry point — detect page type and initialize
  // ---------------------------------------------------------------------------

  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      detectAndInit()
      initExamSimulator()
      initCopyButtons()
    })
  } else {
    detectAndInit()
    initExamSimulator()
    initCopyButtons()
  }

  // Quartz SPA navigation event
  document.addEventListener("nav", function () {
    // Quartz fires "nav" after SPA page transitions. Re-detect and initialize.
    // Use a small delay to ensure the new DOM is fully rendered.
    setTimeout(function () {
      detectAndInit()
      initExamSimulator()
      initCopyButtons()
    }, 50)
  })
})()
