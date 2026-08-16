from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.important_questions_ai import find_important_questions
import json

from app.services.pdf_extractor import extract_pdf_text
from app.services.question_ai import extract_questions_with_ai
from app.services.question_validator import validate_questions


router = APIRouter(
    prefix="/important-questions",
    tags=["Important Questions"],
)


@router.post("/upload")
async def upload_question_papers(
    files: List[UploadFile] = File(...)
):
    if not files:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least one PDF."
        )

    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least two PDF question papers to identify repeated important questions."
        )

    
        
    results = []

    for file in files:

        # Check filename
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="Filename is missing."
            )

        # Check PDF
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"Only PDF files are allowed: {file.filename}"
            )

        # Read file
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"Uploaded PDF is empty: {file.filename}"
            )

        try:

            # Extract PDF text
            pdf_text = extract_pdf_text(file_bytes)

            if not pdf_text.strip():
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not extract text from PDF: {file.filename}"
                )

            # Send text to AI
            ai_result = extract_questions_with_ai(
                pdf_text
            )

            # Validate AI result
            questions = validate_questions(
                ai_result
            )

            # Add result
            results.append({
                "filename": file.filename,
                "question_count": len(questions),
                "questions": questions,
            })

        except HTTPException:
            raise

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"Processing failed for {file.filename}: {str(e)}"
            )


    important_questions = find_important_questions(
    results
    )

# Debug: see exactly what Gemini returned
    print("\n========== IMPORTANT QUESTIONS AI RESULT ==========")
    print(important_questions)
    print("===================================================\n")

    important_questions = important_questions.get(
    "important_questions",
    []
    )

    return {
        "message": "Question papers processed successfully.",
        "papers": results,
        "important_questions": important_questions,
    }