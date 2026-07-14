export function ResumeFormSection({
  id,
  title,
  description,
  action,
  children,
}) {
  return (
    <section
      className="resume-form-section"
      aria-labelledby={`${id}-title`}
    >
      <header className="resume-form-section__header">
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{description}</p>
        </div>
        {action}
      </header>

      {children}
    </section>
  );
}
