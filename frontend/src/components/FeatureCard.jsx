import './FeatureCard.css';

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <article
      className="feature-card animate-fade-in-up card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-card__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </article>
  );
}
