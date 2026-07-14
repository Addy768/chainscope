"""ChainScope Flask API."""
from __future__ import annotations

import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from routes.classify import bp as classify_bp
from routes.detect import bp as detect_bp
from routes.health import bp as health_bp
from routes.risk import bp as risk_bp

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

    for bp in (health_bp, classify_bp, detect_bp, risk_bp):
        app.register_blueprint(bp, url_prefix="/api")

    @app.get("/")
    def root():
        return jsonify(
            {
                "name": "ChainScope API",
                "version": "0.1.0",
                "endpoints": [
                    "/api/health",
                    "/api/classify",
                    "/api/detect-components",
                    "/api/risk-score",
                ],
            }
        )

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG") == "1")
