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

import re



def extract_questions_with_ai(pdf_text: str):

    prompt = """
You are an expert GTU question-paper extraction system.

You are given the extracted text of an actual Gujarat Technological
University (GTU) Diploma question paper.

Your job is to extract the questions EXACTLY from the source paper.

IMPORTANT:
The source paper may use different formats. Do NOT assume that all
GTU papers follow the same numbering or marks format.

============================================================
1. EXTRACT QUESTIONS FROM THE SOURCE
============================================================

Extract EVERY actual academic question that appears in the paper.

Do NOT reduce the number of questions because the paper says:

"Answer any seven"
"Answer any five"
"Attempt any seven"
"Attempt any five"

For example, if the paper contains:

Q.1 Answer any seven.
1. Define byte code.
2. List four different OOP concepts.
3. Define class.
4. Explain inheritance.
5. Explain JVM.
6. Define thread.
7. Explain constructor.
8. Define interface.
9. Explain exception.
10. Define package.

You MUST extract all 10 questions.

The instruction "Answer any seven" is NOT a question.

============================================================
2. QUESTION NUMBER
============================================================

Preserve the question number from the source.

Examples:

1.       -> "1"
2.       -> "2"
10.      -> "10"

Q.2 (a) -> "2(a)"
Q.2 (b) -> "2(b)"

2(a)     -> "2(a)"
2(b)     -> "2(b)"

Do NOT invent numbering.

============================================================
3. OR QUESTIONS
============================================================

If a question appears after OR, keep it as a separate question.

Example:

2(a) Explain JVM. 03
OR
2(a) Explain JDK. 03

Return:

{
    "question_number": "2(a)",
    "question": "Explain JVM.",
    "option": null
}

and:

{
    "question_number": "2(a)",
    "question": "Explain JDK.",
    "option": "OR"
}



============================================================
6. SECTION INSTRUCTIONS
============================================================

Ignore instructions such as:

- Answer any seven
- Answer any five
- Attempt any seven
- Attempt all questions
- Make suitable assumptions
- Figures to the right
- Use of simple calculator
- English version is authentic

These are NOT questions.

Do not include these instructions inside the question text.

============================================================
7. QUESTION CONTINUATION
============================================================

A question can continue across multiple extracted PDF lines.

Example:

Write a program that illustrates interface. Interface P12 inherits
from both P1 and P2. Each interface declares one constant and one
method.

This must remain ONE question.

Combine continuation lines into the same question.

Do not split it into multiple questions unless the source clearly
starts another numbered question.

============================================================
8. DO NOT CORRECT THE SOURCE
============================================================

Preserve the actual question wording.

Do NOT correct grammar.

Do NOT rewrite questions.

Do NOT remove wording just because it looks repetitive.

If the source paper itself contains:

"Explain types of inheritance. Explain types of inheritance."

keep it exactly like that.

Do not treat source repetition as a PDF extraction error.

============================================================
9. IGNORE NON-QUESTION CONTENT
============================================================

Ignore:

- university headers
- university logos
- page numbers
- dates
- time
- seat numbers
- enrolment numbers
- subject code
- subject name
- semester information
- examination information
- total marks
- header/footer information
- Gujarati-language text

============================================================
10. OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return ```json.

Do NOT write explanations.

Use exactly this structure:

{
    "questions": [
        {
            "question_number": "1",
            "question": "Define byte code.",
            "option": null
        },
        {
            "question_number": "2(a)",
            "question": "Explain JVM.",
            "option": null
        },
        {
            "question_number": "2(a)",
            "question": "Explain JDK.",
            "option": "OR"
        }
    ]
}

SOURCE TEXT:
----------------
SOURCE_PLACEHOLDER
----------------
"""

    prompt = prompt.replace(
        "SOURCE_PLACEHOLDER",
        pdf_text
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    text = response.text.strip()

    return json.loads(text)



def clean_ai_questions(data):
    questions = data.get("questions", [])

    cleaned = []

    for q in questions:

        question_number = str(
            q.get("question_number", "")
        ).strip()

        question = str(
            q.get("question", "")
        ).strip()

        option = q.get("option")

        # Clean whitespace only
        question = re.sub(
            r"\s+",
            " ",
            question
        ).strip()

        # Validate OR
        if option not in [None, "OR"]:
            option = None

        # Ignore invalid/empty questions
        if not question_number:
            continue

        if len(question) < 5:
            continue

        cleaned.append({
            "question_number": question_number,
            "question": question,
            "option": option
        })

    return cleaned
