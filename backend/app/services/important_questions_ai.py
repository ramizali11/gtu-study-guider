import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

client = genai.Client(api_key=api_key)

MODEL_NAME = "gemini-3.5-flash-lite"


def find_important_questions(results):



    papers_data = []

    for paper in results:

        filename = paper.get("filename", "")

        questions = []

        for q in paper.get("questions", []):

            question = q.get("question", "").strip()

            if question:
                questions.append(question)

        papers_data.append({
            "filename": filename,
            "questions": questions
        })

    prompt = """
You are an expert GTU Diploma examination question-paper
comparison system.

Your job is to compare questions from MULTIPLE DIFFERENT
GTU question papers and identify questions that are repeated
across different papers.

The input contains multiple papers.

Each paper has:
- a unique filename
- a list of extracted questions

============================================================
MAIN OBJECTIVE
============================================================

Find questions that appear in TWO OR MORE DIFFERENT PAPERS.

The frequency MUST mean:

frequency = number of DISTINCT PAPERS containing that question.

The frequency is NOT the number of times the question appears
inside all extracted question objects.

============================================================
PAPER-BASED FREQUENCY
============================================================

You MUST count each paper at most once for a question.

Example:

Paper A:
- Explain JVM.
- Explain JVM.

Paper B:
- Explain JVM.

Paper C:
- Explain JVM.

Correct:

{
    "question": "Explain JVM.",
    "frequency": 3
}

Because the question appears in three different papers.

The duplicate occurrence inside Paper A does NOT increase
the frequency.

============================================================
QUESTION MATCHING RULE
============================================================

Two questions may be considered the SAME question ONLY when:

1. They ask for the same academic concept.
2. They would require essentially the same answer.
3. The difference is only wording, grammar, capitalization,
   punctuation, spacing, or minor phrasing.

Examples that ARE the same:

"Define byte code."

"Define Byte code."

"Explain byte code."

"Define the byte code."

These refer to the same basic concept.

Another example:

"Define thread."

"Define Thread in Java."

"Explain thread in Java."

These refer to the same basic concept.

Another example:

"Explain JVM."

"Describe JVM."

"Explain the Java Virtual Machine."

These refer to the same concept and should be grouped.

============================================================
STRICT MATCHING — DO NOT OVER-MERGE
============================================================

Do NOT merge questions merely because they belong to the same
general topic.

These are DIFFERENT:

"Explain JVM."

"Explain JVM architecture."

"Explain JVM memory areas."

These should NOT be grouped.

These are DIFFERENT:

"Explain inheritance."

"Explain types of inheritance."

These should NOT automatically be grouped.

These are DIFFERENT:

"Explain constructor."

"Explain copy constructor."

"Explain parameterized constructor."

These should NOT be grouped.

These are DIFFERENT:

"Explain String class."

"Differentiate String and StringBuffer."

These should NOT be grouped.

Accuracy is more important than producing more results.

============================================================
ANSWER SCOPE
============================================================

If one question is more specific than another, keep them
separate unless they clearly ask for the same answer.

Example:

Paper A:
"Explain JVM."

Paper B:
"Explain JVM architecture."

Do NOT merge them.

Example:

Paper A:
"Explain parameterized constructor."

Paper B:
"Explain copy constructor."

Do NOT merge them.

============================================================
QUESTION NUMBERS
============================================================

Ignore question numbers completely.

For example:

Paper A:
1. Define byte code.

Paper B:
3. Define byte code.

These are the same question.

============================================================
OR QUESTIONS
============================================================

Questions marked OR are still valid questions.

Treat each OR question independently.

Example:

Paper A:
2(a) Explain JVM.
OR
2(a) Explain JDK.

Paper B:
4(c) Explain JVM.

Then:

"Explain JVM." = frequency 2

"Explain JDK." = frequency 1

Only JVM should be returned.

Do not include the word OR in the output.

============================================================
EXAM INSTRUCTIONS
============================================================

Ignore instructional text such as:

"Answer any seven"
"Answer any five"
"Attempt any seven"
"Attempt any five"
"Answer all questions"

These are NOT questions.

============================================================
DUPLICATES INSIDE ONE PAPER
============================================================

If the same question occurs multiple times inside one paper,
count that paper only once.

Example:

Paper A:
Explain JVM.
Explain JVM.
Explain JVM.

Paper B:
Explain JVM.

Frequency = 2.

============================================================
OCR AND EXTRACTION ERRORS
============================================================

Questions may contain:

- spelling mistakes
- OCR mistakes
- extra spaces
- duplicated words
- missing punctuation
- capitalization differences
- minor grammar errors

Ignore these when the intended question is clearly the same.

However:

NEVER invent missing information.

NEVER rewrite a question into a completely different question.

============================================================
FREQUENCY REQUIREMENT
============================================================

ONLY return questions with frequency >= 2.

Do NOT return questions with frequency = 1.

For example:

frequency 1 → exclude

frequency 2 → include

frequency 3 → include

frequency 4 → include

frequency 5 → include

============================================================
NUMBER OF PAPERS
============================================================

There may be 2, 3, 4, 5, or more papers.

Never assume there are exactly five papers.

Use the actual distinct filenames supplied in the input.

============================================================
FREQUENCY VALIDATION
============================================================

Before returning each result, verify:

1. Which papers contain the question?
2. Count the DISTINCT filenames.
3. Make sure frequency equals that count.
4. Make sure the question does not occur only once.
5. Make sure the grouping is not too broad.

NEVER invent a frequency.

NEVER use the total number of extracted question objects.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return ```json.

Do NOT return explanations.

Use EXACTLY this structure:

{
    "important_questions": [
        {
            "question": "Explain JVM.",
            "frequency": 3
        },
        {
            "question": "Define byte code.",
            "frequency": 2
        }
    ]
}

Rules:

- question must be a string.
- frequency must be an integer.
- frequency must be >= 2.
- Sort by frequency from highest to lowest.
- If two questions have the same frequency, any order is acceptable.
- If no repeated questions exist, return:

{
    "important_questions": []
}

============================================================
INPUT DATA
============================================================

The following JSON contains ALL question papers.

Analyze ALL papers together.

SOURCE_DATA:
PAPERS_PLACEHOLDER
"""

    prompt = prompt.replace(
        "PAPERS_PLACEHOLDER",
        json.dumps(
            papers_data,
            ensure_ascii=False,
            indent=2
        )
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    text = response.text.strip()

    # Remove accidental markdown fences if Gemini adds them
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:
        result = json.loads(text)

    except json.JSONDecodeError as e:

        raise ValueError(
            f"Gemini returned invalid JSON: {str(e)}"
        )

    # ---------------------------------------------------------
    # Final validation
    # ---------------------------------------------------------

    if not isinstance(result, dict):
        raise ValueError("Gemini response must be a JSON object.")

    important_questions = result.get(
        "important_questions",
        []
    )

    if not isinstance(important_questions, list):
        raise ValueError(
            "important_questions must be a list."
        )

    cleaned_results = []

    for item in important_questions:

        if not isinstance(item, dict):
            continue

        question = item.get("question")

        frequency = item.get("frequency")

        if not isinstance(question, str):
            continue

        if not isinstance(frequency, int):
            continue

        if frequency < 2:
            continue

        cleaned_results.append({
            "question": question.strip(),
            "frequency": frequency
        })

    cleaned_results.sort(
        key=lambda x: x["frequency"],
        reverse=True
    )

    return {
        "important_questions": cleaned_results
    }