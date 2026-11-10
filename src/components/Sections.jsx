import { skillsData, educationData, projectsData, contactData, langColors } from "../data.js";

// git-style short hash (same logic as original)
const hash = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
};

export function Skills() {
  return (
    <section id="skills">
      <h2>Skills <span className="cmd">$ ls ./skills</span></h2>
      <div className="skill-groups">
        {skillsData.map((r) => (
          <div className="skill-row" key={r.domain}>
            <span className="domain">{r.domain}/</span>
            {r.items.map((i) => <span className="chip" key={i}>{i}</span>)}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education">
      <h2>Education <span className="cmd">$ git log --education</span></h2>
      <div className="log">
        {educationData.map((e, i) => (
          <div className="commit" key={e.degree + e.year}>
            <div className="rail"><span className="node" /><span className="line" /></div>
            <div className="body">
              <div>
                <span className="hash">{hash(e.degree + e.year)}</span>{" "}
                <span className="msg">{e.degree}</span>
                {i === 0 && <span className="tagpill">HEAD</span>}
              </div>
              <div className="meta">
                {e.school}{e.board ? ` · ${e.board}` : ""} · {e.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects">
      <h2>Projects <span className="cmd">$ gh repo list imshivamup92</span></h2>
      <div id="projects-list">
        {projectsData.map((p) => {
          const live = p.link && p.link !== "#";
          return (
            <div className="repo" key={p.title}>
              <div className="name">
                <span className="c-muted">imshivamup92 /</span>
                {live ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer">{p.title}</a>
                ) : (
                  <span className="c-blue">{p.title}</span>
                )}
                <span className="badge">{live ? "live" : "private repo"}</span>
              </div>
              <p>{p.description}</p>
              <ul className="hl">
                {(p.highlights || []).map((h) => <li key={h}>{h}</li>)}
              </ul>
              <div className="langs">
                {p.tags.map((t) => (
                  <span className="lang" key={t}>
                    <i style={{ background: langColors[t] || "#8b949e" }} />{t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact">
      <h2>Contact <span className="cmd">$ ping shivam</span></h2>
      <p className="intro">
        Interested in internships, collaborations or just want to talk tech? I usually reply within a day or two.
      </p>
      <div className="contact-links">
        {contactData.map((c) => (
          <div className="row" key={c.tag}>
            <span className="k">{c.tag}:</span>
            <a href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
