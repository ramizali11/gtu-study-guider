BASE_URL = "https://www.gtu.ac.in/uploads"

COURSE_MAP = {
    "Diploma": "DI",
    "BE": "BE",
    "MBA": "MBA",
    "MCA": "MCA",
    "ME": "ME",
}


def build_pdf_url(session: str, course: str, subject_code: str):

    season, year = session.split()

    session_folder = (
        f"W{year}"
        if season.lower() == "winter"
        else f"S{year}"
    )

    course_folder = COURSE_MAP[course]

    return (
        f"{BASE_URL}/"
        f"{session_folder}/"
        f"{course_folder}/"
        f"{subject_code}.pdf"
    )