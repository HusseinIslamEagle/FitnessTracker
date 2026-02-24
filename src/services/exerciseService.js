// src/services/exerciseService.js

const API_BASE = "https://wger.de/api/v2";

// Wger language id للإنجليزي (المستخدم غالبًا 2)
const ENGLISH_LANGUAGE_ID = 2;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetryableStatus(status) {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, "").trim();
}

/**
 * يختار ترجمة إنجليزي من translations إن وجدت
 * ثم fallback لأي ترجمة موجودة
 */
function pickEnglishTranslation(exercise, languageId = ENGLISH_LANGUAGE_ID) {
  const translations = Array.isArray(exercise?.translations)
    ? exercise.translations
    : [];

  // بعض ردود wger بتخزن language كـ id أو object، فهنغطي الحالتين
  const isLangMatch = (t) => {
    const lang = t?.language;
    if (typeof lang === "number") return lang === languageId;
    if (typeof lang === "object" && lang !== null) {
      if (typeof lang.id === "number") return lang.id === languageId;
      if (typeof lang.short_name === "string") return lang.short_name.toLowerCase() === "en";
    }
    return false;
  };

  return translations.find(isLangMatch) || translations[0] || null;
}

/**
 * Normalize exercise shape to stable frontend-friendly object
 * - name & description in English if possible
 * - strip HTML from description
 */
function normalizeExercise(exercise, languageId = ENGLISH_LANGUAGE_ID) {
  const t = pickEnglishTranslation(exercise, languageId);

  const rawName =
    (exercise?.name && String(exercise.name).trim()) ||
    (t?.name && String(t.name).trim()) ||
    (exercise?.name_original && String(exercise.name_original).trim()) ||
    "";

  const rawDesc =
    exercise?.description ||
    t?.description ||
    exercise?.description_original ||
    "";

  const category =
    exercise?.category?.name ||
    exercise?.category?.id ||
    "Unknown";

  const equipment = Array.isArray(exercise?.equipment)
    ? exercise.equipment
        .map((e) => e?.name || e?.id)
        .filter(Boolean)
    : [];

  const muscles = Array.isArray(exercise?.muscles)
    ? exercise.muscles
        .map((m) => m?.name || m?.id)
        .filter(Boolean)
    : [];

  const musclesSecondary = Array.isArray(exercise?.muscles_secondary)
    ? exercise.muscles_secondary
        .map((m) => m?.name || m?.id)
        .filter(Boolean)
    : [];

  return {
    id: exercise?.id,
    name: rawName,
    description: stripHtml(rawDesc),

    // ✅ حقول للفلاتر
    category,
    equipment,
    muscles,
    musclesSecondary,
  };
}
async function fetchJsonWithTimeout(url, { timeoutMs = 12000, signal } = {}) {
  const controller = new AbortController();

  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });

    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }

    if (!res.ok) {
      const err = new Error(
        body?.detail ||
          body?.message ||
          `Request failed with status ${res.status}`
      );
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  } catch (e) {
    if (e.name === "AbortError") {
      const err = new Error("Request aborted or timed out");
      err.code = "ABORTED";
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", onAbort);
  }
}

async function fetchWithRetry(url, options = {}) {
  const {
    retries = 2,
    retryDelayMs = 600,
    timeoutMs = 12000,
    signal,
  } = options;

  let attempt = 0;
  while (true) {
    try {
      return await fetchJsonWithTimeout(url, { timeoutMs, signal });
    } catch (e) {
      attempt += 1;

      const status = e?.status;
      const retryable =
        status == null ? true : isRetryableStatus(status);

      if (e.code === "ABORTED" || attempt > retries || !retryable) {
        throw e;
      }

      await sleep(retryDelayMs * attempt);
    }
  }
}

/**
 * Fetch exercises (English normalized)
 * @param {Object} params
 * @param {number} params.limit
 * @param {number} params.offset
 * @param {number} params.languageId  (default English = 2)
 * @param {AbortSignal} params.signal
 */
export async function fetchExercises({
  limit = 20,
  offset = 0,
  languageId = ENGLISH_LANGUAGE_ID,
  signal,
} = {}) {
  // ملاحظة: الـ endpoint نفسه بيقبل language=...
  // لكننا كمان بنعمل normalize من translations لضمان الإنجليزي
  const url = `${API_BASE}/exerciseinfo/?language=${languageId}&limit=${limit}&offset=${offset}`;

  const data = await fetchWithRetry(url, {
    retries: 2,
    retryDelayMs: 600,
    timeoutMs: 12000,
    signal,
  });

  const rawResults = Array.isArray(data?.results) ? data.results : [];

  // Normalize + فلترة: شيل العناصر اللي مفيهاش اسم واضح
  const results = rawResults
    .map((ex) => normalizeExercise(ex, languageId))
    .filter((ex) => ex?.id != null && ex?.name && ex.name.length > 0);

  return {
    results,               // ✅ دلوقتي {id,name,description} فقط
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    count: data?.count ?? results.length,
    limit,
    offset,
  };
}