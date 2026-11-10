import { aboutObj, aboutData, focusData } from "../data.js";

const Value = ({ v }) => {
  if (Array.isArray(v)) {
    return (
      <>
        [
        {v.map((x, i) => (
          <span key={i}>
            <span className="c-orange">"{x}"</span>
            {i < v.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </>
    );
  }
  if (typeof v === "string") return <span className="c-orange">"{v}"</span>;
  return <span className="c-blue">{String(v)}</span>;
};

export default function About() {
  const entries = Object.entries(aboutObj);
  const total = entries.length + 2;

  return (
    <section id="about">
      <h2>About <span className="cmd">$ cat about.js</span></h2>
      <div className="win">
        <div className="win-bar"><span className="title">about.js</span></div>
        <div className="win-body">
          <div className="code">
            <div className="nums">
              {Array.from({ length: total }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <div className="src">
              <div>
                <span className="c-red">const</span> <span className="c-purple">developer</span> = {"{"}
              </div>
              {entries.map(([k, v]) => (
                <div key={k}>
                  {"  "}<span className="c-blue">{k}</span>: <Value v={v} />,
                </div>
              ))}
              <div>{"};"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bio">
        {aboutData.map((p, i) => <p key={i}>// {p}</p>)}
      </div>

      <div className="cards">
        {focusData.map((f) => (
          <div className="card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
