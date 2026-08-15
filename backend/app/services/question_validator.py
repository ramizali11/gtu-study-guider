

def validate_questions(data):
    if not isinstance(data, dict):
        return []

    questions = data.get("questions", [])

    if not isinstance(questions, list):
        return []

    valid = []

    for item in questions:

        if not isinstance(item, dict):
            continue

        question_number = item.get("question_number")
        question = item.get("question")
        option = item.get("option")

        if not question_number:
            continue

        if not question:
            continue

        if not isinstance(question, str):
            continue

        question = question.strip()

        if len(question) < 5:
            continue


        if option not in (None, "OR"):
            option = None

        valid.append({
            "question_number": str(question_number),
            "question": question,
            "option": option,
        })

    return valid