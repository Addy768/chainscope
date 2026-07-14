export default function About() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2>About ChainScope</h2>
      <p className="text-muted">
        An ML-first rebuild of the <em>Sourced</em> hackathon prototype.
        Three trained models — a fine-tuned ResNet50 classifier, a YOLOv8n
        component detector, and an XGBoost supply-chain risk regressor —
        with SHAP explanations end-to-end. Aligned with UN SDG 12
        (Responsible Consumption and Production).
      </p>
      <p className="text-muted">
        See <code>docs/model_cards/</code> and <code>docs/DATA_CARD.md</code>
        for every model's provenance, metrics, and known limitations.
      </p>
    </article>
  );
}
