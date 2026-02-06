"use client";

import { useMemo, useState } from "react";

type FieldErrors = { [key: string]: string };

interface FormState {
  participantId: string;
  todayDate: string;
  monthYearBirth: string;
  ageYears: string;
  placeOfBirth: string;
  yearsInSingapore: string;
  nationality: string;
  nationalityOther: string;
  ethnicity: string;
  ethnicityOther: string;
  gender: string;
  handedness: string;
  yearsEducation: string;
  highestEducation: string;
  fatherQualification: string;
  motherQualification: string;
  householdIncome: string;
  householdCount: string;
  housingType: string;
  housingOther: string;
}

interface LanguageEntry {
  language: string;
  exposureAge: string;
}

interface LanguageProficiency {
  listening: string;
  speaking: string;
  reading: string;
  writing: string;
}

interface UsageEntry {
  language: string;
  percent: string;
}

interface UsageMix {
  a: string;
  b: string;
  c: string;
}

interface UsageContext {
  entries: UsageEntry[];
  mix: UsageMix;
}

const educationOptions = [
  "Secondary School",
  "Junior College",
  "ITE",
  "Diploma",
  "Advanced Diploma",
  "Undergraduate",
  "Masters",
  "PhD",
];

const parentQualificationOptions = [
  "Below Secondary",
  "Secondary",
  "Post-secondary (Tertiary)",
  "Diploma/professional",
  "Undergraduate",
  "Post-graduate",
  "Masters",
  "Advanced Diploma",
  "PhD",
];

const incomeOptions = [
  "No Employed Person",
  "Less than $3,000",
  "$3,000 - $5,999",
  "$6,000 - $8,9999",
  "$9,000 - $11,999",
  "$12,000 - $14,999",
  "$15,000 - $17,999",
  "More than $18,000",
];

const housingOptions = ["HDB", "Condominium", "Landed property", "Others"];

const ethnicityOptions = ["Chinese", "Malay", "Indian", "Others"];

const initialLanguageColumns = 4;

const emptyUsageEntries = (count: number): UsageEntry[] =>
  Array.from({ length: count }, () => ({ language: "", percent: "" }));

const usageSections = [
  {
    key: "home",
    title:
      "(1) List all the languages you use at Home, and estimate how much time (in %) you spend using each of them:",
    mixTitle:
      "If you use two (or more) languages at home, what is the percentage you speak in the following manners?",
  },
  {
    key: "school",
    title:
      "(2) List all the languages you use at School, and estimate how much time (in %) you spend using each of them:",
    mixTitle:
      "If you use two (or more) languages at school, what is the percentage you speak in the following manners?",
  },
  {
    key: "work",
    title:
      "(3) List all the languages you use at Work, and estimate how much time (in %) you spend using each of them:",
    mixTitle:
      "If you use two (or more) languages at work, what is the percentage you speak in the following manners?",
  },
  {
    key: "other",
    title:
      "(4) List all the languages you use at places other than home, school, and work, and estimate how much time (in %) you spend using each of them:",
    mixTitle:
      "If you use two (or more) languages at places other than home, school, and work, what is the percentage you speak in the following manners?",
  },
] as const;

export default function LBQuestionnairePage() {
  const [form, setForm] = useState<FormState>({
    participantId: "",
    todayDate: "",
    monthYearBirth: "",
    ageYears: "",
    placeOfBirth: "",
    yearsInSingapore: "",
    nationality: "",
    nationalityOther: "",
    ethnicity: "",
    ethnicityOther: "",
    gender: "",
    handedness: "",
    yearsEducation: "",
    highestEducation: "",
    fatherQualification: "",
    motherQualification: "",
    householdIncome: "",
    householdCount: "",
    housingType: "",
    housingOther: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [languageEntries, setLanguageEntries] = useState<LanguageEntry[]>(
    Array.from({ length: initialLanguageColumns }, () => ({
      language: "",
      exposureAge: "",
    }))
  );
  const [proficiency, setProficiency] = useState<LanguageProficiency[]>(
    Array.from({ length: initialLanguageColumns }, () => ({
      listening: "",
      speaking: "",
      reading: "",
      writing: "",
    }))
  );
  const [usageDistribution, setUsageDistribution] = useState({
    home: "",
    school: "",
    work: "",
    other: "",
  });
  const [usageContexts, setUsageContexts] = useState<{
    home: UsageContext;
    school: UsageContext;
    work: UsageContext;
    other: UsageContext;
  }>({
    home: { entries: emptyUsageEntries(4), mix: { a: "", b: "", c: "" } },
    school: { entries: emptyUsageEntries(4), mix: { a: "", b: "", c: "" } },
    work: { entries: emptyUsageEntries(4), mix: { a: "", b: "", c: "" } },
    other: { entries: emptyUsageEntries(4), mix: { a: "", b: "", c: "" } },
  });

  const missingCount = useMemo(
    () => Object.keys(errors).length,
    [errors]
  );
  const usageDistributionTotal = useMemo(() => {
    return (["home", "school", "work", "other"] as const).reduce(
      (sum, key) => sum + (Number(usageDistribution[key]) || 0),
      0
    );
  }, [usageDistribution]);

  function digitsOnly(value: string, maxLen = 6) {
    return value.replace(/\D/g, "").slice(0, maxLen);
  }

  function formatMonthYear(value: string) {
    const digits = digitsOnly(value, 6);
    if (digits.length === 0) return "";
    let month = digits.slice(0, 2);
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum <= 0) month = "01";
      if (monthNum > 12) month = "12";
    }
    const year = digits.slice(2);
    return year.length > 0 ? `${month}/${year}` : month;
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function stripNumbers(value: string) {
    return value.replace(/\d/g, "");
  }

  function clampPercent(value: string) {
    const digits = digitsOnly(value, 3);
    if (!digits) return "";
    const num = Math.min(100, parseInt(digits, 10));
    return num.toString();
  }

  function normalizeProficiency(value: string) {
    const raw = value.trim().toUpperCase();
    if (raw === "NA") return "NA";
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const num = Math.max(1, Math.min(10, parseInt(digits, 10)));
    return num.toString();
  }

  function addLanguageColumn() {
    setLanguageEntries((prev) => [...prev, { language: "", exposureAge: "" }]);
    setProficiency((prev) => [
      ...prev,
      { listening: "", speaking: "", reading: "", writing: "" },
    ]);
  }

  function removeLanguageColumn() {
    setLanguageEntries((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : prev
    );
    setProficiency((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function addUsageColumn(section: keyof typeof usageContexts) {
    setUsageContexts((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        entries: [...prev[section].entries, { language: "", percent: "" }],
      },
    }));
  }

  function removeUsageColumn(section: keyof typeof usageContexts) {
    setUsageContexts((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        entries:
          prev[section].entries.length > 1
            ? prev[section].entries.slice(0, -1)
            : prev[section].entries,
      },
    }));
  }

  function updateLanguageEntry(
    index: number,
    key: keyof LanguageEntry,
    value: string
  ) {
    setLanguageEntries((prev) =>
      prev.map((entry, idx) =>
        idx === index ? { ...entry, [key]: value } : entry
      )
    );
  }

  function updateProficiency(
    index: number,
    key: keyof LanguageProficiency,
    value: string
  ) {
    setProficiency((prev) =>
      prev.map((entry, idx) =>
        idx === index ? { ...entry, [key]: value } : entry
      )
    );
  }

  function updateUsageEntry(
    section: keyof typeof usageContexts,
    index: number,
    key: keyof UsageEntry,
    value: string
  ) {
    setUsageContexts((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        entries: prev[section].entries.map((entry, idx) =>
          idx === index ? { ...entry, [key]: value } : entry
        ),
      },
    }));
  }

  function updateUsageMix(
    section: keyof typeof usageContexts,
    key: keyof UsageMix,
    value: string
  ) {
    setUsageContexts((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        mix: { ...prev[section].mix, [key]: value },
      },
    }));
  }

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};
    if (!form.participantId.trim()) {
      nextErrors.participantId = "Participant ID is required.";
    }
    if (!form.todayDate.trim()) {
      nextErrors.todayDate = "Today's date is required.";
    }
    if (!form.monthYearBirth.trim()) {
      nextErrors.monthYearBirth = "Month and year of birth is required.";
    } else if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(form.monthYearBirth.trim())) {
      nextErrors.monthYearBirth = "Use MM/YYYY format (e.g., 11/2002).";
    }
    if (!form.ageYears.trim()) {
      nextErrors.ageYears = "Age is required.";
    } else if (Number.isNaN(Number(form.ageYears))) {
      nextErrors.ageYears = "Age must be a number.";
    }
    if (!form.placeOfBirth.trim()) {
      nextErrors.placeOfBirth = "Place of birth is required.";
    }
    if (!form.nationality.trim()) {
      nextErrors.nationality = "Nationality is required.";
    }
    if (form.nationality === "Others" && !form.nationalityOther.trim()) {
      nextErrors.nationalityOther = "Please specify nationality.";
    }
    if (!form.ethnicity.trim()) {
      nextErrors.ethnicity = "Ethnicity is required.";
    }
    if (form.ethnicity === "Others" && !form.ethnicityOther.trim()) {
      nextErrors.ethnicityOther = "Please specify ethnicity.";
    }
    if (!form.gender.trim()) {
      nextErrors.gender = "Gender is required.";
    }
    if (!form.handedness.trim()) {
      nextErrors.handedness = "Handedness is required.";
    }
    if (!form.yearsEducation.trim()) {
      nextErrors.yearsEducation = "Years of formal education is required.";
    } else if (Number.isNaN(Number(form.yearsEducation))) {
      nextErrors.yearsEducation = "Years of formal education must be a number.";
    }
    if (!form.highestEducation.trim()) {
      nextErrors.highestEducation = "Highest education level is required.";
    }
    if (!form.fatherQualification.trim()) {
      nextErrors.fatherQualification =
        "Father's highest qualification is required.";
    }
    if (!form.motherQualification.trim()) {
      nextErrors.motherQualification =
        "Mother's highest qualification is required.";
    }
    if (!form.householdIncome.trim()) {
      nextErrors.householdIncome = "Household income is required.";
    }
    if (!form.householdCount.trim()) {
      nextErrors.householdCount = "Household size is required.";
    } else if (Number.isNaN(Number(form.householdCount))) {
      nextErrors.householdCount = "Household size must be a number.";
    }
    if (!form.housingType.trim()) {
      nextErrors.housingType = "Housing type is required.";
    }
    if (form.housingType === "Others" && !form.housingOther.trim()) {
      nextErrors.housingOther = "Please specify housing type.";
    }

    const ageValue = Number(form.ageYears);
    const yearsInSpore = Number(form.yearsInSingapore);
    if (
      form.yearsInSingapore.trim() &&
      !Number.isNaN(ageValue) &&
      !Number.isNaN(yearsInSpore) &&
      yearsInSpore > ageValue
    ) {
      nextErrors.yearsInSingapore =
        "Years living in Singapore cannot exceed age.";
    }

    const firstLanguage = languageEntries[0];
    if (!firstLanguage?.language.trim()) {
      nextErrors.languagePrimary = "At least one language is required.";
    }
    languageEntries.forEach((entry, idx) => {
      if (entry.language.trim() && !entry.exposureAge.trim()) {
        nextErrors[`languageExposure-${idx}`] =
          "Provide age/grade of first exposure.";
      }
      if (entry.exposureAge.trim() && !entry.language.trim()) {
        nextErrors[`languageName-${idx}`] = "Provide the language name.";
      }
    });

    const isValidProf = (value: string) =>
      value.trim().toUpperCase() === "NA" ||
      (/^\d+$/.test(value.trim()) &&
        Number(value) >= 1 &&
        Number(value) <= 10);

    languageEntries.forEach((entry, idx) => {
      if (!entry.language.trim()) return;
      const prof = proficiency[idx];
      if (!prof) return;
      (["listening", "speaking", "reading", "writing"] as const).forEach(
        (key) => {
          if (!prof[key].trim()) {
            nextErrors[`prof-${idx}-${key}`] = "Provide a rating (1-10 or NA).";
          } else if (!isValidProf(prof[key])) {
            nextErrors[`prof-${idx}-${key}`] =
              "Use 1-10 or NA for proficiency.";
          }
        }
      );
    });

    const distValues = Object.values(usageDistribution)
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value));
    if (distValues.length > 0) {
      const total = distValues.reduce((sum, value) => sum + value, 0);
      if (
        Object.values(usageDistribution).some((value) => value.trim() === "")
      ) {
        nextErrors.usageDistribution =
          "Fill all usage distribution percentages.";
      } else if (total !== 100) {
        nextErrors.usageDistribution = "Usage distribution must total 100%.";
      }
    }

    (["home", "school", "work", "other"] as const).forEach((section) => {
      const context = usageContexts[section];
      const anyLanguage = context.entries.some(
        (entry) => entry.language.trim() || entry.percent.trim()
      );
      if (anyLanguage) {
        const languageTotal = context.entries
          .map((entry) => Number(entry.percent))
          .filter((value) => !Number.isNaN(value))
          .reduce((sum, value) => sum + value, 0);
        if (
          context.entries.some(
            (entry) =>
              (entry.language.trim() && !entry.percent.trim()) ||
              (!entry.language.trim() && entry.percent.trim())
          )
        ) {
          nextErrors[`usage-${section}`] =
            "Provide both language and percentage.";
        } else if (languageTotal !== 100) {
          nextErrors[`usage-${section}`] =
            "Language usage must total 100%.";
        }
      }

      const mixValues = Object.values(context.mix)
        .map((value) => Number(value))
        .filter((value) => !Number.isNaN(value));
      if (mixValues.length > 0) {
        const mixTotal = mixValues.reduce((sum, value) => sum + value, 0);
        if (Object.values(context.mix).some((value) => value.trim() === "")) {
          nextErrors[`mix-${section}`] =
            "Fill all percentages for language mixing.";
        } else if (mixTotal !== 100) {
          nextErrors[`mix-${section}`] = "Mixing percentages must total 100%.";
        }
      }
    });

    return nextErrors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(true);
    if (Object.keys(nextErrors).length > 0) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  function handleDownload() {
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(true);
    if (Object.keys(nextErrors).length > 0) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
      return;
    }
    window.print();
  }

  return (
    <main className="min-h-screen bg-white px-8 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-center text-xl font-semibold text-gray-900">
          Language Background Questionnaire – Adult Version
        </h1>

        <section className="mt-6 rounded border border-gray-300 p-4">
          <p className="text-sm font-semibold text-gray-900">
            Participant information{" "}
            <span className="text-gray-500">
              - To be filled out by the researcher
            </span>
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm">
              Participant ID
              <input
                type="text"
                value={form.participantId}
                onChange={(e) => updateField("participantId", e.target.value)}
                placeholder="e.g., P-001"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.participantId ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.participantId}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col text-sm">
              Today's date
              <input
                type="date"
                value={form.todayDate}
                onChange={(e) => updateField("todayDate", e.target.value)}
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.todayDate ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.todayDate}
                </span>
              ) : null}
            </label>
          </div>
        </section>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {submitted && missingCount > 0 ? (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Please fill all required fields. Missing: {missingCount}
            </div>
          ) : null}

          <p className="text-sm text-gray-900">
            Please answer all the following questions as best as you can:
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm">
              Month and Year of birth
              <input
                type="text"
                value={form.monthYearBirth}
                onChange={(e) =>
                  updateField("monthYearBirth", formatMonthYear(e.target.value))
                }
                placeholder="MM/YYYY"
                inputMode="numeric"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.monthYearBirth ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.monthYearBirth}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col text-sm">
              Age (in Years)
              <input
                type="text"
                value={form.ageYears ? `${form.ageYears} Years` : ""}
                onChange={(e) =>
                  updateField("ageYears", digitsOnly(e.target.value, 3))
                }
                placeholder="e.g., 24 Years"
                inputMode="numeric"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.ageYears ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.ageYears}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col text-sm sm:col-span-2">
              Place of birth
              <input
                type="text"
                value={form.placeOfBirth}
                onChange={(e) =>
                  updateField("placeOfBirth", stripNumbers(e.target.value))
                }
                placeholder="e.g., Singapore"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.placeOfBirth ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.placeOfBirth}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col text-sm sm:col-span-2">
              If not Singapore, years living in Singapore
              <input
                type="text"
                value={form.yearsInSingapore ? `${form.yearsInSingapore} Years` : ""}
                onChange={(e) =>
                  updateField("yearsInSingapore", digitsOnly(e.target.value, 3))
                }
                placeholder="e.g., 5 Years"
                inputMode="numeric"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.yearsInSingapore ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.yearsInSingapore}
                </span>
              ) : null}
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Nationality</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                {["Singaporean", "Others"].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="nationality"
                      checked={form.nationality === option}
                      onChange={() => updateField("nationality", option)}
                    />
                    {option}
                  </label>
                ))}
                {form.nationality === "Others" ? (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={form.nationalityOther}
                    onChange={(e) =>
                      updateField("nationalityOther", e.target.value)
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : null}
              </div>
              {errors.nationality ? (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.nationality}
                </span>
              ) : null}
              {errors.nationalityOther ? (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.nationalityOther}
                </span>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Ethnicity</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                {ethnicityOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ethnicity"
                      checked={form.ethnicity === option}
                      onChange={() => updateField("ethnicity", option)}
                    />
                    {option}
                  </label>
                ))}
                {form.ethnicity === "Others" ? (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={form.ethnicityOther}
                    onChange={(e) =>
                      updateField("ethnicityOther", e.target.value)
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : null}
              </div>
              {errors.ethnicity ? (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.ethnicity}
                </span>
              ) : null}
              {errors.ethnicityOther ? (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.ethnicityOther}
                </span>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Gender</p>
              <div className="mt-2 flex gap-6 text-sm">
                {["Male", "Female"].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      checked={form.gender === option}
                      onChange={() => updateField("gender", option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.gender ? (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.gender}
                </span>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Are you left-handed or right-handed?
              </p>
              <div className="mt-2 flex gap-6 text-sm">
                {["Left", "Right"].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="handedness"
                      checked={form.handedness === option}
                      onChange={() => updateField("handedness", option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.handedness ? (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.handedness}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm sm:col-span-2">
              How many years of formal education do you have? (from Primary 1)
              <input
                type="text"
                value={form.yearsEducation}
                onChange={(e) =>
                  updateField("yearsEducation", digitsOnly(e.target.value, 2))
                }
                placeholder="e.g., 16"
                inputMode="numeric"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.yearsEducation ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.yearsEducation}
                </span>
              ) : null}
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Please check your highest education level:
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {educationOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="highestEducation"
                    checked={form.highestEducation === option}
                    onChange={() => updateField("highestEducation", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.highestEducation ? (
              <span className="mt-1 block text-xs text-red-600">
                {errors.highestEducation}
              </span>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              What is your father's highest qualification?
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {parentQualificationOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fatherQualification"
                    checked={form.fatherQualification === option}
                    onChange={() => updateField("fatherQualification", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.fatherQualification ? (
              <span className="mt-1 block text-xs text-red-600">
                {errors.fatherQualification}
              </span>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              What is your mother's highest qualification?
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {parentQualificationOptions
                .filter((option) => option !== "Masters" && option !== "PhD")
                .map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="motherQualification"
                      checked={form.motherQualification === option}
                      onChange={() => updateField("motherQualification", option)}
                    />
                    {option}
                  </label>
                ))}
            </div>
            {errors.motherQualification ? (
              <span className="mt-1 block text-xs text-red-600">
                {errors.motherQualification}
              </span>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              What is the gross household income per month (SGD)?
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {incomeOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="householdIncome"
                    checked={form.householdIncome === option}
                    onChange={() => updateField("householdIncome", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.householdIncome ? (
              <span className="mt-1 block text-xs text-red-600">
                {errors.householdIncome}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm sm:col-span-2">
              How many people currently live in your household, including
              yourself?
              <input
                type="text"
                value={form.householdCount}
                onChange={(e) =>
                  updateField("householdCount", digitsOnly(e.target.value, 2))
                }
                placeholder="e.g., 4"
                inputMode="numeric"
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
              {errors.householdCount ? (
                <span className="mt-1 text-xs text-red-600">
                  {errors.householdCount}
                </span>
              ) : null}
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              What is your housing type?
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              {housingOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="housingType"
                    checked={form.housingType === option}
                    onChange={() => updateField("housingType", option)}
                  />
                  {option}
                </label>
              ))}
              {form.housingType === "Others" ? (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={form.housingOther}
                  onChange={(e) => updateField("housingOther", e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                />
              ) : null}
            </div>
            {errors.housingType ? (
              <span className="mt-1 block text-xs text-red-600">
                {errors.housingType}
              </span>
            ) : null}
            {errors.housingOther ? (
              <span className="mt-1 block text-xs text-red-600">
                {errors.housingOther}
              </span>
            ) : null}
          </div>

          <section className="rounded border border-gray-300 p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              1. Basic Language Information
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              (1) In the first row, please list all the spoken or signed
              languages (including dialects) of which you have ANY current or
              previous knowledge in order of DOMINANCE.
            </p>
            <p className="mt-2 text-sm text-gray-700">
              (2) In the second row, please write the age at which you were
              first exposed to this language. If you were exposed at birth,
              write 0.
            </p>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-left">
                      Dominance
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 text-center"
                      colSpan={languageEntries.length}
                    >
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Most comfortable</span>
                        <span>Least comfortable</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-left">
                      Language
                    </th>
                    {languageEntries.map((entry, idx) => (
                      <td
                        key={`lang-${idx}`}
                        className="border border-gray-300 px-2 py-2 align-top"
                      >
                        <div className="text-xs text-gray-500">{idx + 1}.</div>
                        <input
                          type="text"
                          value={entry.language}
                          onChange={(e) =>
                            updateLanguageEntry(
                              idx,
                              "language",
                              e.target.value
                            )
                          }
                          placeholder={`Language ${idx + 1}`}
                          className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                        {errors[`languageName-${idx}`] ? (
                          <span className="mt-1 block text-xs text-red-600">
                            {errors[`languageName-${idx}`]}
                          </span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-left">
                      Age/grade of first exposure
                    </th>
                    {languageEntries.map((entry, idx) => (
                      <td
                        key={`expo-${idx}`}
                        className="border border-gray-300 px-2 py-2 align-top"
                      >
                        <input
                          type="text"
                          value={entry.exposureAge}
                          onChange={(e) =>
                            updateLanguageEntry(
                              idx,
                              "exposureAge",
                              digitsOnly(e.target.value, 3)
                            )
                          }
                          placeholder="0"
                          inputMode="numeric"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                        {errors[`languageExposure-${idx}`] ? (
                          <span className="mt-1 block text-xs text-red-600">
                            {errors[`languageExposure-${idx}`]}
                          </span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {errors.languagePrimary ? (
              <span className="mt-2 block text-xs text-red-600">
                {errors.languagePrimary}
              </span>
            ) : null}

            <div className="mt-3 flex justify-end">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={removeLanguageColumn}
                  className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-lg leading-none">−</span> Remove language
                </button>
                <button
                  type="button"
                  onClick={addLanguageColumn}
                  className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-lg leading-none">+</span> Add language
                </button>
              </div>
            </div>
          </section>

          <section className="rounded border border-gray-300 p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              2. Language Proficiency
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              For each of the above-listed languages, please rate how proficient
              you are in listening, speaking, reading, and writing (1-10 or NA).
            </p>
            <div className="mt-3 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
              <div className="mt-1 flex justify-between text-[11px]">
                <span>Not proficient</span>
                <span>Moderately proficient</span>
                <span>Very proficient</span>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-left">
                      Language
                    </th>
                    {languageEntries.map((entry, idx) => (
                      <th
                        key={`prof-head-${idx}`}
                        className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-700"
                      >
                        {entry.language.trim() || `Language ${idx + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Listening", "listening"],
                    ["Speaking", "speaking"],
                    ["Reading", "reading"],
                    ["Writing", "writing"],
                  ] as const).map(([label, key]) => (
                    <tr key={key}>
                      <th className="border border-gray-300 px-2 py-2 text-left">
                        {label}
                      </th>
                      {languageEntries.map((_, idx) => (
                        <td
                          key={`${key}-${idx}`}
                          className="border border-gray-300 px-2 py-2 align-top"
                        >
                          <input
                            type="text"
                            value={proficiency[idx]?.[key] ?? ""}
                            onChange={(e) =>
                              updateProficiency(
                                idx,
                                key,
                                normalizeProficiency(e.target.value)
                              )
                            }
                            placeholder="1-10 or NA"
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                          {errors[`prof-${idx}-${key}`] ? (
                            <span className="mt-1 block text-xs text-red-600">
                              {errors[`prof-${idx}-${key}`]}
                            </span>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addLanguageColumn}
                className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className="text-lg leading-none">+</span> Add language
              </button>
            </div>
          </section>

          <section className="rounded border border-gray-300 p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              3. Current Language Usage
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              For a typical week currently, please estimate how much time (in %)
              you spend in each situation. Percentages should add up to 100%.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-4">
              {(
                [
                  ["home", "Home"],
                  ["school", "School"],
                  ["work", "Work"],
                  ["other", "Others"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex flex-col text-sm">
                  {label}
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={usageDistribution[key]}
                      onChange={(e) =>
                        setUsageDistribution((prev) => ({
                          ...prev,
                          [key]: clampPercent(e.target.value),
                        }))
                      }
                      placeholder="0-100"
                      inputMode="numeric"
                      className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Total: {usageDistributionTotal}%{" "}
              {errors.usageDistribution ? (
                <span className="ml-2 text-xs text-red-600">
                  {errors.usageDistribution}
                </span>
              ) : null}
            </div>

            <div className="mt-6 space-y-6">
              {usageSections.map((section) => {
                const key = section.key;
                const context = usageContexts[key];
                const usageTotal = context.entries
                  .map((entry) => Number(entry.percent))
                  .filter((value) => !Number.isNaN(value))
                  .reduce((sum, value) => sum + value, 0);
                const mixTotal = Object.values(context.mix)
                  .map((value) => Number(value))
                  .filter((value) => !Number.isNaN(value))
                  .reduce((sum, value) => sum + value, 0);

                return (
                  <div key={key} className="space-y-3">
                    <p className="text-sm font-medium text-gray-900">
                      {section.title}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <tbody>
                          <tr>
                            {context.entries.map((entry, idx) => (
                              <td
                                key={`${key}-lang-${idx}`}
                                className="border border-gray-300 px-2 py-2 align-top"
                              >
                                <div className="text-xs text-gray-500">
                                  {idx + 1}.
                                </div>
                                <input
                                  type="text"
                                  value={entry.language}
                                  onChange={(e) =>
                                    updateUsageEntry(
                                      key,
                                      idx,
                                      "language",
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Language ${idx + 1}`}
                                  className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                />
                                <div className="mt-2 flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={entry.percent}
                                    onChange={(e) =>
                                      updateUsageEntry(
                                        key,
                                        idx,
                                        "percent",
                                        clampPercent(e.target.value)
                                      )
                                    }
                                    placeholder="0-100"
                                    inputMode="numeric"
                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                  />
                                  <span className="text-xs text-gray-500">
                                    %
                                  </span>
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-gray-600">
                      Total: {usageTotal}%{" "}
                      {errors[`usage-${key}`] ? (
                        <span className="ml-2 text-xs text-red-600">
                          {errors[`usage-${key}`]}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex justify-end">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => removeUsageColumn(key)}
                          className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <span className="text-lg leading-none">−</span> Remove
                          column
                        </button>
                        <button
                          type="button"
                          onClick={() => addUsageColumn(key)}
                          className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <span className="text-lg leading-none">+</span> Add
                          column
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        {section.mixTitle}
                      </p>
                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                        {([
                          [
                            "a",
                            "I speak only one language and rarely switch to the other language.",
                          ],
                          [
                            "b",
                            "I speak two or more languages when I converse with different speakers. I often switch languages but rarely mix languages within a sentence.",
                          ],
                          [
                            "c",
                            "I routinely mix two or more languages within a sentence to most speakers.",
                          ],
                        ] as const).map(([mixKey, label]) => (
                          <label
                            key={`${key}-mix-${mixKey}`}
                            className="flex flex-col gap-1"
                          >
                            <span className="text-xs text-gray-600">
                              {label}
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={context.mix[mixKey]}
                                onChange={(e) =>
                                  updateUsageMix(
                                    key,
                                    mixKey,
                                    clampPercent(e.target.value)
                                  )
                                }
                                placeholder="0-100"
                                inputMode="numeric"
                                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              />
                              <span className="text-xs text-gray-500">%</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="text-xs text-gray-600">
                        Total: {mixTotal}%{" "}
                        {errors[`mix-${key}`] ? (
                          <span className="ml-2 text-xs text-red-600">
                            {errors[`mix-${key}`]}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Download PDF
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
