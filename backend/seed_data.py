from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.classes.delete_many({})
    await db.subjects.delete_many({})
    await db.topics.delete_many({})
    await db.quizzes.delete_many({})
    await db.books.delete_many({})
    await db.mock_tests.delete_many({})
    await db.users.delete_many({})
    
    # Create admin user
    admin_id = str(uuid.uuid4())
    await db.users.insert_one({
        'id': admin_id,
        'name': 'Admin User',
        'email': 'admin@educationroot.com',
        'password': hash_password('admin123'),
        'role': 'admin',
        'language': 'en',
        'created_at': datetime.now(timezone.utc).isoformat()
    })
    
    # Create test student
    student_id = str(uuid.uuid4())
    await db.users.insert_one({
        'id': student_id,
        'name': 'Test Student',
        'email': 'student@test.com',
        'password': hash_password('student123'),
        'role': 'student',
        'language': 'en',
        'created_at': datetime.now(timezone.utc).isoformat()
    })
    
    # Seed Classes (6-12)
    classes_data = []
    for class_num in range(6, 13):
        class_id = str(uuid.uuid4())
        classes_data.append({
            'id': class_id,
            'name': f'Class {class_num}',
            'name_hi': f'कक्षा {class_num}',
            'description': f'Comprehensive learning materials for Class {class_num}',
            'description_hi': f'कक्षा {class_num} के लिए व्यापक शिक्षण सामग्री',
            'class_number': class_num
        })
    
    await db.classes.insert_many(classes_data)
    print(f"Created {len(classes_data)} classes")
    
    # Seed Subjects
    subjects_data = []
    subject_names = [
        {'en': 'Mathematics', 'hi': 'गणित', 'icon': 'Calculator'},
        {'en': 'Science', 'hi': 'विज्ञान', 'icon': 'Microscope'},
        {'en': 'English', 'hi': 'अंग्रेज़ी', 'icon': 'BookOpen'},
        {'en': 'Hindi', 'hi': 'हिन्दी', 'icon': 'Languages'}
    ]
    
    for class_data in classes_data:
        for subject in subject_names:
            subject_id = str(uuid.uuid4())
            subjects_data.append({
                'id': subject_id,
                'class_id': class_data['id'],
                'name': subject['en'],
                'name_hi': subject['hi'],
                'icon': subject['icon'],
                'description': f'{subject["en"]} for {class_data["name"]}',
                'description_hi': f'{class_data["name_hi"]} के लिए {subject["hi"]}'
            })
    
    await db.subjects.insert_many(subjects_data)
    print(f"Created {len(subjects_data)} subjects")
    
    # Seed Topics (10 sample topics)
    topics_data = [
        {
            'id': str(uuid.uuid4()),
            'subject_id': subjects_data[0]['id'],
            'class_id': classes_data[0]['id'],
            'title': 'Introduction to Algebra',
            'title_hi': 'बीजगणित का परिचय',
            'content': '''# Introduction to Algebra

Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.

## What is Algebra?

Algebra uses letters and symbols to represent numbers and quantities in formulas and equations. The key concept is using variables (like x, y, z) to represent unknown values.

## Basic Concepts

1. **Variables**: Letters that represent unknown numbers
2. **Constants**: Fixed numbers that don't change
3. **Expressions**: Combinations of variables and constants
4. **Equations**: Mathematical statements that two expressions are equal

## Example

If x + 5 = 10, then x = 5

This is because 5 + 5 = 10''',
            'content_hi': '''# बीजगणित का परिचय

बीजगणित गणित की एक शाखा है जो प्रतीकों और उन प्रतीकों में हेरफेर के नियमों से संबंधित है।

## बीजगणित क्या है?

बीजगणित सूत्रों और समीकरणों में संख्याओं और मात्राओं का प्रतिनिधित्व करने के लिए अक्षरों और प्रतीकों का उपयोग करता है।''',
            'formulas': [
                'x + y = z',
                'a² + b² = c² (Pythagoras Theorem)',
                '(a + b)² = a² + 2ab + b²'
            ],
            'diagrams': [],
            'duration_minutes': 15
        },
        {
            'id': str(uuid.uuid4()),
            'subject_id': subjects_data[1]['id'],
            'class_id': classes_data[0]['id'],
            'title': 'Photosynthesis',
            'title_hi': 'प्रकाश संश्लेषण',
            'content': '''# Photosynthesis

Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.

## The Process

Plants absorb sunlight through their leaves using chlorophyll, the green pigment that gives leaves their color.

## Key Components

1. **Sunlight**: Energy source
2. **Water**: Absorbed through roots
3. **Carbon Dioxide**: Taken from air through stomata
4. **Chlorophyll**: Green pigment in leaves

## Products

- **Glucose**: Food for the plant
- **Oxygen**: Released into atmosphere''',
            'content_hi': '''# प्रकाश संश्लेषण

प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके ऑक्सीजन और ऊर्जा का उत्पादन करते हैं।''',
            'formulas': [
                '6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂'
            ],
            'diagrams': [],
            'duration_minutes': 20
        },
        {
            'id': str(uuid.uuid4()),
            'subject_id': subjects_data[0]['id'],
            'class_id': classes_data[1]['id'],
            'title': 'Linear Equations',
            'title_hi': 'रैखिक समीकरण',
            'content': '''# Linear Equations

A linear equation is an equation where the highest power of the variable is 1.

## Standard Form

ax + b = c

Where a, b, and c are constants and x is the variable.

## Solving Linear Equations

1. Isolate the variable term
2. Perform inverse operations
3. Simplify to find the value of x

## Example

Solve: 3x + 7 = 16

Step 1: 3x = 16 - 7
Step 2: 3x = 9
Step 3: x = 3''',
            'content_hi': '''# रैखिक समीकरण

रैखिक समीकरण एक ऐसा समीकरण है जहां चर की उच्चतम घात 1 है।''',
            'formulas': [
                'ax + b = c',
                'y = mx + c (Slope-intercept form)'
            ],
            'diagrams': [],
            'duration_minutes': 18
        }
    ]
    
    # Add 7 more topics
    more_topics = [
        {'title': 'Quadratic Equations', 'title_hi': 'द्विघात समीकरण', 'subject_idx': 0},
        {'title': 'Cell Structure', 'title_hi': 'कोशिका संरचना', 'subject_idx': 1},
        {'title': 'Grammar Basics', 'title_hi': 'व्याकरण की मूल बातें', 'subject_idx': 2},
        {'title': 'Acids and Bases', 'title_hi': 'अम्ल और क्षार', 'subject_idx': 1},
        {'title': 'Trigonometry', 'title_hi': 'त्रिकोणमिति', 'subject_idx': 0},
        {'title': 'Electricity', 'title_hi': 'बिजली', 'subject_idx': 1},
        {'title': 'Coordinate Geometry', 'title_hi': 'निर्देशांक ज्यामिति', 'subject_idx': 0}
    ]
    
    for topic in more_topics:
        topics_data.append({
            'id': str(uuid.uuid4()),
            'subject_id': subjects_data[topic['subject_idx']]['id'],
            'class_id': classes_data[0]['id'],
            'title': topic['title'],
            'title_hi': topic['title_hi'],
            'content': f'# {topic["title"]}\n\nComprehensive notes and explanation for {topic["title"]}.',
            'content_hi': f'# {topic["title_hi"]}\n\n{topic["title_hi"]} के लिए व्यापक नोट्स और स्पष्टीकरण।',
            'formulas': [],
            'diagrams': [],
            'duration_minutes': 15
        })
    
    await db.topics.insert_many(topics_data)
    print(f"Created {len(topics_data)} topics")
    
    # Seed Quizzes
    quizzes_data = []
    for topic in topics_data[:5]:
        quiz_id = str(uuid.uuid4())
        quizzes_data.append({
            'id': quiz_id,
            'topic_id': topic['id'],
            'title': f'Quiz: {topic["title"]}',
            'title_hi': f'प्रश्नोत्तरी: {topic["title_hi"]}',
            'duration_minutes': 10,
            'questions': [
                {
                    'id': str(uuid.uuid4()),
                    'question': f'What is the main concept in {topic["title"]}?',
                    'question_hi': f'{topic["title_hi"]} में मुख्य अवधारणा क्या है?',
                    'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                    'correct_answer': 'Option A'
                },
                {
                    'id': str(uuid.uuid4()),
                    'question': f'Which formula is used in {topic["title"]}?',
                    'question_hi': f'{topic["title_hi"]} में कौन सा सूत्र प्रयोग होता है?',
                    'options': ['Formula 1', 'Formula 2', 'Formula 3', 'Formula 4'],
                    'correct_answer': 'Formula 1'
                },
                {
                    'id': str(uuid.uuid4()),
                    'question': 'True or False: This is an important topic?',
                    'question_hi': 'सत्य या असत्य: यह एक महत्वपूर्ण विषय है?',
                    'options': ['True', 'False'],
                    'correct_answer': 'True'
                }
            ]
        })
    
    await db.quizzes.insert_many(quizzes_data)
    print(f"Created {len(quizzes_data)} quizzes")
    
    # Seed Books
    books_data = [
        {
            'id': str(uuid.uuid4()),
            'title': 'Complete Mathematics Guide - Class 10',
            'title_hi': 'पूर्ण गणित गाइड - कक्षा 10',
            'description': 'Comprehensive mathematics guide covering all topics for Class 10 with solved examples and practice questions.',
            'description_hi': 'कक्षा 10 के लिए संपूर्ण गणित गाइड जिसमें हल किए गए उदाहरण और अभ्यास प्रश्न शामिल हैं।',
            'price': 599,
            'image': 'https://images.pexels.com/photos/3747507/pexels-photo-3747507.jpeg',
            'class_id': classes_data[4]['id'],
            'pages': 450,
            'author': 'Dr. R.K. Sharma'
        },
        {
            'id': str(uuid.uuid4()),
            'title': 'Science Mastery - Class 9',
            'title_hi': 'विज्ञान महारत - कक्षा 9',
            'description': 'Complete science book covering Physics, Chemistry, and Biology with diagrams and experiments.',
            'description_hi': 'भौतिकी, रसायन विज्ञान और जीव विज्ञान को कवर करने वाली संपूर्ण विज्ञान पुस्तक।',
            'price': 549,
            'image': 'https://images.pexels.com/photos/3747507/pexels-photo-3747507.jpeg',
            'class_id': classes_data[3]['id'],
            'pages': 380,
            'author': 'Prof. Anjali Verma'
        },
        {
            'id': str(uuid.uuid4()),
            'title': 'English Grammar & Composition - Class 8',
            'title_hi': 'अंग्रेजी व्याकरण और रचना - कक्षा 8',
            'description': 'Essential English grammar rules, composition techniques, and practice exercises.',
            'description_hi': 'आवश्यक अंग्रेजी व्याकरण नियम, रचना तकनीक और अभ्यास।',
            'price': 449,
            'image': 'https://images.pexels.com/photos/3747507/pexels-photo-3747507.jpeg',
            'class_id': classes_data[2]['id'],
            'pages': 320,
            'author': 'Ms. Priya Singh'
        }
    ]
    
    await db.books.insert_many(books_data)
    print(f"Created {len(books_data)} books")
    
    # Seed Mock Tests
    mock_tests_data = [
        {
            'id': str(uuid.uuid4()),
            'title': 'Class 10 Mathematics Final Mock Test',
            'title_hi': 'कक्षा 10 गणित अंतिम मॉक टेस्ट',
            'class_id': classes_data[4]['id'],
            'subject': 'Mathematics',
            'duration_minutes': 120,
            'total_marks': 100,
            'questions_count': 40
        },
        {
            'id': str(uuid.uuid4()),
            'title': 'Class 9 Science Mock Test',
            'title_hi': 'कक्षा 9 विज्ञान मॉक टेस्ट',
            'class_id': classes_data[3]['id'],
            'subject': 'Science',
            'duration_minutes': 90,
            'total_marks': 80,
            'questions_count': 35
        }
    ]
    
    await db.mock_tests.insert_many(mock_tests_data)
    print(f"Created {len(mock_tests_data)} mock tests")
    
    print("\n=== Database seeded successfully! ===")
    print(f"Admin: admin@educationroot.com / admin123")
    print(f"Student: student@test.com / student123")
    print("\nData created:")
    print(f"- {len(classes_data)} classes")
    print(f"- {len(subjects_data)} subjects")
    print(f"- {len(topics_data)} topics")
    print(f"- {len(quizzes_data)} quizzes")
    print(f"- {len(books_data)} books")
    print(f"- {len(mock_tests_data)} mock tests")

if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()