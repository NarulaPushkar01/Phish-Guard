"""
PhishGuard - WSGI Entry Point
This file serves as the entry point for production WSGI servers like Gunicorn.
Usage: gunicorn wsgi:app
"""

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
