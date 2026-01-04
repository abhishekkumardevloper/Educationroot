from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import razorpay

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 30

# Razorpay Configuration (Test mode)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_secret')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    language: str = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    role: str = "student"
    language: str = "en"
    created_at: str

class TopicCreate(BaseModel):
    class_id: str
    subject_id: str
    title: str
    title_hi: str
    content: str
    content_hi: str
    formulas: Optional[List[str]] = []
    diagrams: Optional[List[str]] = []

class QuizSubmit(BaseModel):
    quiz_id: str
    topic_id: str
    answers: Dict[str, str]

class BookCreate(BaseModel):
    title: str
    title_hi: str
    description: str
    price: int
    image: str
    class_id: str

class OrderCreate(BaseModel):
    amount: int
    currency: str = "INR"
    items: List[Dict[str, Any]]

class BookmarkCreate(BaseModel):
    topic_id: str
    title: str

# ===== HELPER FUNCTIONS =====

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        user = await db.users.find_one({'id': user_id}, {'_id': 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===== AUTH ROUTES =====

@api_router.post("/auth/register")
async def register(data: UserRegister):
    existing = await db.users.find_one({'email': data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        'id': user_id,
        'name': data.name,
        'email': data.email,
        'password': hash_password(data.password),
        'role': 'student',
        'language': data.language,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_id)
    
    return {
        'token': token,
        'user': {
            'id': user_id,
            'name': data.name,
            'email': data.email,
            'role': 'student',
            'language': data.language
        }
    }

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({'email': data.email})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'])
    
    return {
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'language': user.get('language', 'en')
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {'user': current_user}

# ===== CONTENT ROUTES =====

@api_router.get("/classes")
async def get_classes():
    classes = await db.classes.find({}, {'_id': 0}).to_list(100)
    return {'classes': classes}

@api_router.get("/subjects/{class_id}")
async def get_subjects(class_id: str):
    subjects = await db.subjects.find({'class_id': class_id}, {'_id': 0}).to_list(100)
    return {'subjects': subjects}

@api_router.get("/topics/{subject_id}")
async def get_topics(subject_id: str):
    topics = await db.topics.find({'subject_id': subject_id}, {'_id': 0, 'content': 0, 'content_hi': 0}).to_list(100)
    return {'topics': topics}

@api_router.get("/topic/{topic_id}")
async def get_topic(topic_id: str):
    topic = await db.topics.find_one({'id': topic_id}, {'_id': 0})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {'topic': topic}

@api_router.get("/quiz/{topic_id}")
async def get_quiz(topic_id: str):
    quiz = await db.quizzes.find_one({'topic_id': topic_id}, {'_id': 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {'quiz': quiz}

@api_router.post("/quiz/submit")
async def submit_quiz(data: QuizSubmit, current_user: dict = Depends(get_current_user)):
    quiz = await db.quizzes.find_one({'id': data.quiz_id}, {'_id': 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    correct_count = 0
    total = len(quiz['questions'])
    
    for question in quiz['questions']:
        q_id = question['id']
        if data.answers.get(q_id) == question['correct_answer']:
            correct_count += 1
    
    score = (correct_count / total) * 100
    
    result_doc = {
        'id': str(uuid.uuid4()),
        'user_id': current_user['id'],
        'quiz_id': data.quiz_id,
        'topic_id': data.topic_id,
        'score': score,
        'correct': correct_count,
        'total': total,
        'submitted_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.quiz_results.insert_one(result_doc)
    
    return {
        'score': score,
        'correct': correct_count,
        'total': total
    }

@api_router.get("/mock-tests")
async def get_mock_tests():
    tests = await db.mock_tests.find({}, {'_id': 0}).to_list(100)
    return {'tests': tests}

# ===== BOOKSTORE ROUTES =====

@api_router.get("/books")
async def get_books():
    books = await db.books.find({}, {'_id': 0}).to_list(100)
    return {'books': books}

@api_router.get("/book/{book_id}")
async def get_book(book_id: str):
    book = await db.books.find_one({'id': book_id}, {'_id': 0})
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return {'book': book}

# ===== ORDER ROUTES =====

@api_router.post("/orders/create")
async def create_order(data: OrderCreate, current_user: dict = Depends(get_current_user)):
    try:
        razor_order = razorpay_client.order.create({
            'amount': data.amount * 100,
            'currency': data.currency,
            'payment_capture': 1
        })
        
        order_doc = {
            'id': str(uuid.uuid4()),
            'user_id': current_user['id'],
            'razorpay_order_id': razor_order['id'],
            'amount': data.amount,
            'currency': data.currency,
            'items': data.items,
            'status': 'created',
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.insert_one(order_doc)
        
        return {
            'order_id': razor_order['id'],
            'amount': data.amount,
            'currency': data.currency,
            'key_id': RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")

@api_router.post("/orders/verify")
async def verify_payment(payment_data: dict, current_user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({'razorpay_order_id': payment_data['order_id']})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    await db.orders.update_one(
        {'razorpay_order_id': payment_data['order_id']},
        {'$set': {
            'status': 'completed',
            'razorpay_payment_id': payment_data.get('payment_id'),
            'completed_at': datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {'status': 'success', 'message': 'Payment verified'}

# ===== STUDENT ROUTES =====

@api_router.get("/student/progress")
async def get_progress(current_user: dict = Depends(get_current_user)):
    results = await db.quiz_results.find({'user_id': current_user['id']}, {'_id': 0}).to_list(1000)
    return {'progress': results}

@api_router.get("/student/bookmarks")
async def get_bookmarks(current_user: dict = Depends(get_current_user)):
    bookmarks = await db.bookmarks.find({'user_id': current_user['id']}, {'_id': 0}).to_list(1000)
    return {'bookmarks': bookmarks}

@api_router.post("/student/bookmarks")
async def add_bookmark(data: BookmarkCreate, current_user: dict = Depends(get_current_user)):
    bookmark_doc = {
        'id': str(uuid.uuid4()),
        'user_id': current_user['id'],
        'topic_id': data.topic_id,
        'title': data.title,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    await db.bookmarks.insert_one(bookmark_doc)
    return {'message': 'Bookmark added'}

@api_router.get("/student/purchases")
async def get_purchases(current_user: dict = Depends(get_current_user)):
    orders = await db.orders.find(
        {'user_id': current_user['id'], 'status': 'completed'}, 
        {'_id': 0}
    ).to_list(1000)
    return {'purchases': orders}

# ===== ADMIN ROUTES =====

@api_router.post("/admin/topics")
async def create_topic(data: TopicCreate, current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    topic_id = str(uuid.uuid4())
    topic_doc = {
        'id': topic_id,
        **data.model_dump(),
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.topics.insert_one(topic_doc)
    return {'message': 'Topic created', 'id': topic_id}

@api_router.post("/admin/books")
async def create_book(data: BookCreate, current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    book_id = str(uuid.uuid4())
    book_doc = {
        'id': book_id,
        **data.model_dump(),
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.books.insert_one(book_doc)
    return {'message': 'Book created', 'id': book_id}

@api_router.get("/admin/analytics")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = await db.users.count_documents({})
    total_topics = await db.topics.count_documents({})
    total_orders = await db.orders.count_documents({'status': 'completed'})
    
    revenue_pipeline = [
        {'$match': {'status': 'completed'}},
        {'$group': {'_id': None, 'total': {'$sum': '$amount'}}}
    ]
    revenue_result = await db.orders.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]['total'] if revenue_result else 0
    
    return {
        'total_users': total_users,
        'total_topics': total_topics,
        'total_orders': total_orders,
        'total_revenue': total_revenue
    }

@api_router.get("/search")
async def search(q: str):
    topics = await db.topics.find(
        {'$or': [
            {'title': {'$regex': q, '$options': 'i'}},
            {'title_hi': {'$regex': q, '$options': 'i'}}
        ]},
        {'_id': 0}
    ).to_list(50)
    
    return {'results': topics}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()