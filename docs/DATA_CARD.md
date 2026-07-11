# Data Card — ChainScope

Documents every dataset used, its provenance, licence, and known biases.
Reviewed each time a new source lands.

---

## 1. UN Comtrade — Electronics Trade Flows

- **What:** country-to-country trade values for HS codes 8471 (computers),
  8517 (telephones), 8542 (integrated circuits).
- **Timespan:** 2015 – latest available year.
- **Rows:** ~200k after filtering to relevant HS codes.
- **Licence:** UN Open Data — free for non-commercial use with attribution.
- **Known biases:**
  - Under-reporting from small economies.
  - "Reporter mirror" mismatch: A→B declared by A often ≠ B→A declared by B.
  - Free-zone re-exports (Hong Kong, UAE, Singapore) inflate perceived origin.
- **How we mitigate:** for the risk model we use the **average** of importer
  and exporter declarations, and add a `free_zone_flag` feature.

## 2. World Bank Worldwide Governance Indicators (WGI)

- **What:** six governance dimensions per country per year.
  We use **Political Stability** and **Regulatory Quality**.
- **Timespan:** 1996 – latest.
- **Licence:** CC-BY 4.0.
- **Known biases:**
  - Country coverage improves over time — earlier years missing microstates.
  - Confidence intervals wide for low-income countries.
- **How we mitigate:** impute missing values with regional median before
  feeding to the model; expose imputation flag as a feature.

## 3. Kaggle Electronics Product Images

- **What:** labelled JPGs across ~10 electronics product categories
  (smartphone, laptop, headphones, camera, etc.).
- **Rows:** ~15k images, class distribution roughly 3:1 (see notebook 01).
- **Licence:** dataset-specific — verify per author before commercial use.
- **Known biases:**
  - Studio product-shot bias — real-world photos underrepresented.
  - Western-brand overrepresentation.
  - Class overlap: some "smartphone" images include a laptop in-frame.
- **How we mitigate:** augment with random crops + colour jitter, and flag
  the studio-bias limitation in the model card.

## 4. iFixit Teardown Images (component detector)

- **What:** small (~500-image) manually-curated subset of teardown photos
  with bounding boxes labelled via LabelStudio.
- **Licence:** iFixit content is CC BY-NC-SA — attribution + non-commercial
  only. Model weights are **not redistributable** for commercial use.
- **Known biases:**
  - Very heavy on Apple products in the source corpus.
  - Old devices (pre-2015) overrepresented.
- **How we mitigate:** documented in the detector model card. We do not ship
  the raw images; only the trained weights.

## 5. Wikidata (label cross-reference)

- **What:** SPARQL queries returning canonical product names, brands,
  release years.
- **Licence:** CC0.
- **Known biases:** notability threshold — obscure products missing.

---

## Version log

| Date | Change |
|---|---|
| _pending first data pull_ | initial commit |
