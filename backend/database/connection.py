"""
PhishGuard - Database Connection Module
Manages MongoDB connection using PyMongo.
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import Config
from utils.logger import logger

# Global database reference
db = None
client = None


def init_db():
    """
    Initialize MongoDB connection.
    Returns the database instance.
    """
    global db, client

    try:
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
        # Verify connection
        client.admin.command("ping")
        db = client[Config.DATABASE_NAME]

        # Create indexes for performance
        _create_indexes(db)

        logger.info(f"✅ Connected to MongoDB: {Config.DATABASE_NAME}")
        return db

    except ConnectionFailure as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise


def get_db():
    """Get the database instance. Initializes if not already connected."""
    global db
    if db is None:
        init_db()
    return db


def _create_indexes(database):
    """Create database indexes for optimal query performance."""
    # Users collection indexes
    database.users.create_index("email", unique=True)
    database.users.create_index("username", unique=True)

    # Analyses collection indexes
    database.analyses.create_index("user_id")
    database.analyses.create_index("created_at")
    database.analyses.create_index([("user_id", 1), ("created_at", -1)])

    # Reports collection indexes
    database.reports.create_index("user_id")
    database.reports.create_index("analysis_id")

    logger.info("📊 Database indexes created")


def close_db():
    """Close the MongoDB connection gracefully."""
    global client
    if client:
        client.close()
        logger.info("🔌 MongoDB connection closed")
