"""ChainScope Flask API.

Boots the app, mounts blueprints, and loads model artifacts via the
model registry. Endpoints deliberately stay thin — heavy lifting lives
in `services/` and the model artifacts under `../ml/artifacts/`.
"""
from __future__ import annotations

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.health import bp as health_bp

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

    app.register_blueprint(health_bp, url_prefix="/api")

    @app.get("/")
    def root():
        return jsonify(
            {
                "name": "ChainScope API",
                "version": "0.1.0",
                "docs": "/api/health",
            }
        )

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG") == "1")
