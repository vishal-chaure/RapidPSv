import os
import logging
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Initialize SQLAlchemy with the Base class
db = SQLAlchemy(model_class=Base)

# Create the Flask application
app = Flask(__name__)
# Provide a fallback session secret for local dev
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-for-local")

# Required for proper URL generation behind proxies (useful in some deploys)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Enable CORS for local dev. Keep origins restricted to dev hosts; '*' is allowed here for convenience.
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///safety_predictor.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

# Import local modules (your data processing / predictor code)
# Make sure these files exist: data_processor.py and predictor.py (they were in your tree)
from data_processor import DataProcessor
from predictor import SafetyPredictor

# Initialize data processor and predictor
data_processor = DataProcessor()
safety_predictor = SafetyPredictor()

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/about')
def about():
    """Render the about page."""
    return render_template('about.html')

@app.route('/api/predict', methods=['GET'])
def predict():
    """API endpoint to get safety predictions based on hour of day."""
    try:
        hour = int(request.args.get('hour', 12))
        if hour < 0 or hour > 23:
            return jsonify({'error': 'Hour must be between 0 and 23'}), 400
        predictions = safety_predictor.predict(hour)
        return jsonify(predictions)
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.exception("Error during prediction")
        return jsonify({'error': 'An error occurred during prediction'}), 500

@app.route('/api/wards', methods=['GET'])
def get_wards():
    """Return GeoJSON FeatureCollection of wards."""
    try:
        wards = data_processor.get_wards()
        return jsonify(wards)
    except Exception as e:
        logger.exception("Error retrieving ward data")
        return jsonify({'error': 'Failed to retrieve ward data'}), 500

@app.route('/api/historical/<ward_id>', methods=['GET'])
def get_historical_data(ward_id):
    try:
        days = int(request.args.get('days', 7))
        historical_data = safety_predictor.get_historical_safety_data(ward_id, days)
        return jsonify(historical_data)
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception:
        logger.exception("Error retrieving historical data")
        return jsonify({'error': 'Failed to retrieve historical data'}), 500

@app.route('/api/future/<ward_id>', methods=['GET'])
def predict_future(ward_id):
    try:
        hours = int(request.args.get('hours', 24))
        future_data = safety_predictor.predict_future_risk(ward_id, hours)
        return jsonify(future_data)
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception:
        logger.exception("Error predicting future data")
        return jsonify({'error': 'Failed to generate future predictions'}), 500

@app.route('/api/tips/<ward_id>', methods=['GET'])
def get_safety_tips(ward_id):
    try:
        hour = request.args.get('hour')
        if hour is not None:
            hour = int(hour)
            if hour < 0 or hour > 23:
                return jsonify({'error': 'Hour must be between 0 and 23'}), 400
        tips = safety_predictor.get_safety_tips(ward_id, hour)
        return jsonify(tips)
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception:
        logger.exception("Error retrieving safety tips")
        return jsonify({'error': 'Failed to retrieve safety tips'}), 500

@app.route('/api/search', methods=['GET'])
def search_location():
    """Search for a query and return ward mapping (latitude/longitude)."""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        ward_data = data_processor.map_search_query_to_ward(query)
        if not ward_data:
            return jsonify({'error': 'Location not found or not in Mumbai area'}), 404
        return jsonify(ward_data)
    except Exception:
        logger.exception("Error during location search")
        return jsonify({'error': 'Failed to search location'}), 500

# Create all database tables (safe guard to not crash server)
with app.app_context():
    try:
        import models  # noqa: F401
        db.create_all()
    except Exception:
        logger.exception("Error creating DB tables (continuing)")

if __name__ == '__main__':
    # helpful debug mode while developing - set FLASK_ENV=production in real deploys
    app.run(host='0.0.0.0', port=5000, debug=True)
