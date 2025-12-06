import os
import dotenv
import logging
from pydantic_settings import BaseSettings
from sqlalchemy.ext.asyncio import create_async_engine

try:
    APPLICATION_SETTINGS_PATH: str = os.environ.get("APPLICATION_SETTINGS")
    if not APPLICATION_SETTINGS_PATH:
        APPLICATION_SETTINGS_PATH = os.path.join(os.getcwd(), ".vars")
    dotenv.load_dotenv(APPLICATION_SETTINGS_PATH)
except:
    pass


class DevelopmentDBConfig(BaseSettings):
    DEV_DB_SQLITE_FILENAME: str
    DEV_CONN_STRING: str = "sqlite+aiosqlite:///{filename}"


class ProductionDBConfig(BaseSettings):
    PROD_DB_HOST: str
    PROD_DB_PORT: int
    PROD_DB_USERNAME: str
    PROD_DB_PASSWORD: str
    PROD_DB_DATABASE: str
    PROD_CONN_STRING: str = (
        "mysql+aiomysql://{username}:{password}@{host}:{port}/{database}"
    )


class JWTConfig(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_REFRESH_TOKEN_EXPIRE_MINUTES: int


class Environment(BaseSettings):
    APP_ENVIRONMENT: str


class EmailConfig(BaseSettings):
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    FRONTEND_URL: str = "http://localhost:3000"


class Configuration:
    ENVIRONMENT: Environment = Environment()
    APP_ENVIRONMENT: str = ENVIRONMENT.APP_ENVIRONMENT

    # DB Configuration
    DEV_DB_CONFIG: DevelopmentDBConfig = DevelopmentDBConfig()
    PROD_DB_CONFIG: ProductionDBConfig = ProductionDBConfig()
    
    # Email Configuration
    EMAIL_CONFIG: EmailConfig = EmailConfig()

    # SQLAlchemy Engines
    # Enable echo=True for SQL query logging (controlled by LOG_LEVEL env var)
    enable_sql_logging = os.getenv("LOG_LEVEL", "DEBUG").upper() in ["DEBUG", "INFO"]
    SQLALCHEMY_ENGINES: dict = {
        "development": create_async_engine(
            DEV_DB_CONFIG.DEV_CONN_STRING.format(
                filename=DEV_DB_CONFIG.DEV_DB_SQLITE_FILENAME
            ),
            echo=enable_sql_logging,
        ),
        "production": create_async_engine(
            PROD_DB_CONFIG.PROD_CONN_STRING.format(
                username=PROD_DB_CONFIG.PROD_DB_USERNAME,
                password=PROD_DB_CONFIG.PROD_DB_PASSWORD,
                host=PROD_DB_CONFIG.PROD_DB_HOST,
                port=PROD_DB_CONFIG.PROD_DB_PORT,
                database=PROD_DB_CONFIG.PROD_DB_DATABASE,
            ),
            echo=enable_sql_logging,
        ),
    }

    # Alembic URLs
    # Alembic requires sync engines instead of async ones
    ALEMBIC_URLS: dict = {
        "development": "sqlite:///{filename}".format(
            filename=DEV_DB_CONFIG.DEV_DB_SQLITE_FILENAME
        ),
        "production": "mysql+pymysql://{username}:{password}@{host}:{port}/{database}".format(
            username=PROD_DB_CONFIG.PROD_DB_USERNAME,
            password=PROD_DB_CONFIG.PROD_DB_PASSWORD,
            host=PROD_DB_CONFIG.PROD_DB_HOST,
            port=PROD_DB_CONFIG.PROD_DB_PORT,
            database=PROD_DB_CONFIG.PROD_DB_DATABASE,
        ),
    }

    # JWT Configuration
    JWT_CONFIG: JWTConfig = JWTConfig()

    # Logging
    LOGS_DIR: str = ".logs"
    LOGGING_LEVEL: int = logging.WARNING

    # API
    API_PREFIX: str = "ecommerce"

    # Storage
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local")
    LOCAL_STORAGE_PATH: str = os.getenv(
        "LOCAL_STORAGE_PATH", os.path.join(os.getcwd(), "uploads")
    )
    LOCAL_STORAGE_BASE_URL: str = os.getenv("LOCAL_STORAGE_BASE_URL", "/uploads")
    STORAGE_BUCKET_NAME: str = os.getenv("STORAGE_BUCKET_NAME", "ecommerce-images")


config = Configuration()
