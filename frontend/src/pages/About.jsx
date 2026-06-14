function About() {
  return (
    <section>
      <div className="page-title">
        <div>
          <p className="eyebrow">About TrafficUndo</p>
          <h1>Community-powered Kerala traffic relief</h1>
          <p>TrafficUndo helps commuters, volunteers, and authorities share verified road-block information in realtime.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "Live Road Intelligence",
            body: "Users report blocked routes from Point A to Point B, and the platform broadcasts updates to every connected map.",
          },
          {
            title: "District Coordination",
            body: "Anonymous district rooms let people coordinate safer routes without signup or personal identity exposure.",
          },
          {
            title: "Social Support",
            body: "The donation module provides a direct UPI path to support homeless people during traffic, flood, and emergency disruption.",
          },
        ].map((item) => (
          <article className="glass-panel p-6" key={item.title}>
            <h2 className="text-2xl font-black">{item.title}</h2>
            <p className="mt-4 font-semibold leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default About;
