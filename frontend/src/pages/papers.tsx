import { useState } from "react";

function Papers() {
  const [session, setSession] = useState("Winter 2025");
  const [course, setCourse] = useState("Diploma");
  const [subjectCode, setSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const sessions = [];

  for (let year = currentYear; year >= 2017; year--) {
  sessions.push(`Winter ${year}`);
  sessions.push(`Summer ${year}`);
}

  const searchPaper = async () => {
    if (!subjectCode.trim()) {
      alert("Enter Subject Code");
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
          subject_code: subjectCode,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
         console.log("PDF URL:", data.url);
         if (newTab) {
           newTab.location.href = data.url;
         }
      } else {
        alert("Paper not found");
      }
    } catch (err) {
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center items-center transition-colors border-slate-300 dark:border-border">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm transition-colors">
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">
          Previous Year Papers
        </h1>

        <div className="space-y-5">
          <div>
            <label className="text-foreground">Session</label>

            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-foreground"
            >
              {sessions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-foreground">Course</label>

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-foreground"
            >
              <option>Diploma</option>
              
            </select>
          </div>

          <div>
            <label className="text-foreground">Subject Code</label>

            <input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="4320001"
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-border bg-background p-3 text-foreground outline-none"
            />
          </div>

          <button
            onClick={searchPaper}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Searching..." : "Search Paper"}
          </button>
          <p className = "textsize-small justify-center item-senter"> if you want another caurses paper to be available in this site email at : charizadpoki@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default Papers;
