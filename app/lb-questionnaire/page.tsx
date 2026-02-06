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

  const missingCount = useMemo(
    () => Object.keys(errors).length,
    [errors]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    }
    if (!form.ageYears.trim()) {
      nextErrors.ageYears = "Age is required.";
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
    }
    if (!form.housingType.trim()) {
      nextErrors.housingType = "Housing type is required.";
    }
    if (form.housingType === "Others" && !form.housingOther.trim()) {
      nextErrors.housingOther = "Please specify housing type.";
    }
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
                onChange={(e) => updateField("monthYearBirth", e.target.value)}
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
                type="number"
                min="0"
                value={form.ageYears}
                onChange={(e) => updateField("ageYears", e.target.value)}
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
                onChange={(e) => updateField("placeOfBirth", e.target.value)}
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
                value={form.yearsInSingapore}
                onChange={(e) => updateField("yearsInSingapore", e.target.value)}
                className="mt-1 rounded border border-gray-300 px-2 py-1"
              />
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
                onChange={(e) => updateField("yearsEducation", e.target.value)}
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
                onChange={(e) => updateField("householdCount", e.target.value)}
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
