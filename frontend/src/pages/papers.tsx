import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Papers() {
  const [session, setSession] = useState("Winter 2025");
  const [course, setCourse] = useState("Diploma");
  const [subjectCode, setSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const sessions: string[] = [];

  for (let year = currentYear; year >= 2017; year--) {
    sessions.push(`Winter ${year}`);
    sessions.push(`Summer ${year}`);
  }

  const searchPaper = async () => {
    if (!subjectCode.trim()) {
      alert("Please enter a subject code.");
      return;
    }

    setLoading(true);

    try {
      const newTab = window.open("", "_blank");

      const response = await fetch("http://127.0.0.1:8000/papers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session,
          course,
          subject_code: subjectCode.trim(),
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        if (newTab) {
          newTab.location.href = data.url;
        }
      } else {
        if (newTab) {
          newTab.close();
        }

        alert("Paper not found. Please check the session and subject code.");
      }
    } catch (err) {
      console.error("Paper search error:", err);

      alert(
        "Unable to connect to the server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute right-30gf top-[20%] h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="absolute bottom-37.5 left-[30%] h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* ================= MAIN ================= */}

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            ← Dashboard
          </button>
          {/* Logo */}

          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 text-3xl shadow-xl shadow-blue-500/20">
              🎓
            </div>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
            GTU AI Study Assistant
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Previous Year Papers
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Find GTU previous year question papers quickly by selecting your
            exam session and entering the subject code.
          </p>
        </div>

        {/* ================= SEARCH CARD ================= */}

        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            {/* Card Header */}

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                📚
              </div>

              <div>
                <h2 className="font-semibold">Find your question paper</h2>

                <p className="text-xs text-muted-foreground">
                  Search from available GTU papers
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* ================= SESSION ================= */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Exam Session
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    📅
                  </span>

                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {sessions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ▼
                  </span>
                </div>
              </div>

              {/* ================= COURSE ================= */}

              <div>
                <label className="mb-2 block text-sm font-medium">Course</label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    🎓
                  </span>

                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Diploma">Diploma</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ▼
                  </span>
                </div>
              </div>

              {/* ================= SUBJECT CODE ================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Subject Code
                  </label>

                  <span className="text-xs text-muted-foreground">
                    Example: 4320001
                  </span>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    🔢
                  </span>

                  <input
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchPaper();
                      }
                    }}
                    placeholder="Enter subject code"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-11 text-sm outline-none transition placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* ================= SEARCH BUTTON ================= */}

              <button
                onClick={searchPaper}
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:to-purple-500 hover:shadow-xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching GTU papers...
                  </>
                ) : (
                  <>
                    <span className="text-lg">🔍</span>
                    Search Paper
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* ================= TIP ================= */}

            <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex gap-3">
                <span className="text-lg">💡</span>

                <div>
                  <p className="text-sm font-medium">Quick tip</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    You can find the subject code on your GTU syllabus,
                    timetable, or previous question paper.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= REQUEST PAPER ================= */}

          <div className="mt-5 rounded-2xl border border-border bg-card/50 p-5 text-center backdrop-blur-xl">
            <div className="mb-2 text-xl">📩</div>

            <p className="text-sm font-medium">Can't find your paper?</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              If you want another course or subject paper to be available on
              this site, send a request.
            </p>

            <a
              href="mailto:charizadpoki@gmail.com"
              className="mt-3 inline-block text-sm font-medium text-blue-500 transition hover:text-blue-400 hover:underline"
            >
              Request a paper →
            </a>
          </div>

          {/* ================= HOW IT WORKS ================= */}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/40 p-4 text-center backdrop-blur">
              <div className="mb-2 text-xl">1️⃣</div>

              <p className="text-xs font-semibold">Select session</p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Choose Winter or Summer
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-4 text-center backdrop-blur">
              <div className="mb-2 text-xl">2️⃣</div>

              <p className="text-xs font-semibold">Enter subject</p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Enter your GTU code
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-4 text-center backdrop-blur">
              <div className="mb-2 text-xl">3️⃣</div>

              <p className="text-xs font-semibold">Get paper</p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Open your PDF instantly
              </p>
            </div>
          </div>

          {/* ================= FOOTER ================= */}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Built for GTU Diploma students • Study smarter, not harder 🎓
          </p>
        </div>
      </div>
    </div>
  );
}

export default Papers;
