from fastapi import APIRouter

from app.schemas import PaperSearchRequest
from app.services.url_builder import build_pdf_url

router = APIRouter(
    prefix="/papers",
    tags=["Papers"]
)


@router.post("/search")
def search_paper(data: PaperSearchRequest):

    url = build_pdf_url(
        data.session,
        data.course,
        data.subject_code
    )

    return {
        "status": "success",
        "url": url
    }