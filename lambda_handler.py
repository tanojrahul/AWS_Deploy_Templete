import awsgi
from app.main import app

def handler(event, context):
    """AWS Lambda handler function that wraps the FastAPI application."""
    return awsgi.response(app, event, context)
