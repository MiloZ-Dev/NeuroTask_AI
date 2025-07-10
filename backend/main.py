from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from core.init_db import create_database_if_not_exists
from models.task import Task
from routers.task_router import router as task_router

# Create the database if it does not exist
create_database_if_not_exists()

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title="NeuroTask AI ",
    description="Sistema de gestión de tareas con IA",
    version="1.0.0",
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; adjust in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(task_router, prefix="/api", tags=["tasks"])