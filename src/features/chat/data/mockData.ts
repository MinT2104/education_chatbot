import { Conversation, ConversationFolder } from '../types'

export const mockConversations: Conversation[] = [
  {
    id: 'conv_abc',
    title: 'How to write REST API with Spring Boot',
    pinned: false,
    createdAt: 1730619600000,
    updatedAt: 1730630000000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Help me understand how to write REST API with Spring Boot',
        timestamp: 1730619601000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### Getting Started with Spring Boot REST API

To create a REST API with Spring Boot, you need to follow these steps:

#### 1. Create Controller

\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
\`\`\`

#### 2. Configure Dependencies

In \`pom.xml\` or \`build.gradle\`:

\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
\`\`\`

Would you like me to explain any part in more detail?`,
        citations: [
          {
            id: 'c1',
            title: 'Spring Boot Documentation',
            url: 'https://spring.io/projects/spring-boot',
            snippet: 'Official Spring Boot documentation and guides',
          },
          {
            id: 'c2',
            title: 'REST API Best Practices',
            url: 'https://restfulapi.net/',
            snippet: 'Best practices for designing RESTful APIs',
          },
        ],
        variants: [
          {
            id: 'v1',
            contentMd: `### Version 1: Basic

This is the simplest approach...`,
            timestamp: 1730619605000,
          },
        ],
        feedback: {
          like: true,
          note: 'Clear and easy to understand',
        },
        timestamp: 1730619605000,
        streamed: true,
      },
    ],
    tools: {
      web: true,
      code: true,
      vision: false,
    },
    memory: {
      enabled: true,
    },
  },
  {
    id: 'conv_def',
    title: 'How to use React Hooks',
    pinned: true,
    createdAt: 1730523000000,
    updatedAt: 1730523600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Explain React Hooks for beginners',
        timestamp: 1730523001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### What are React Hooks?

React Hooks are special functions that allow you to "hook into" React features like state and lifecycle methods from functional components.

#### Common Hooks:

1. **useState**: Manage state
2. **useEffect**: Handle side effects
3. **useContext**: Access context
4. **useMemo**: Memoize expensive calculations
5. **useCallback**: Memoize functions

#### Example: useState

\`\`\`tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

#### Example: useEffect

\`\`\`tsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]); // Only re-run if count changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

#### Custom Hooks Example

\`\`\`tsx
function useFetch(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
\`\`\``,
        timestamp: 1730523005000,
        streamed: true,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: false,
    },
  },
  {
    id: 'conv_ghi',
    title: 'Python List vs Tuple',
    pinned: false,
    createdAt: 1730436000000,
    updatedAt: 1730436600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What is the difference between list and tuple in Python?',
        timestamp: 1730436001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### List vs Tuple in Python

**List**:
- Can be changed (mutable)
- Uses square brackets \`[]\`
- Slower performance
- More memory usage

**Tuple**:
- Cannot be changed (immutable)
- Uses parentheses \`()\`
- Faster performance
- Less memory usage

#### Code Examples:

\`\`\`python
# List - Mutable
my_list = [1, 2, 3]
my_list.append(4)  # OK - [1, 2, 3, 4]
my_list[0] = 10    # OK - [10, 2, 3, 4]
my_list.remove(2) # OK - [10, 3, 4]

# Tuple - Immutable
my_tuple = (1, 2, 3)
my_tuple.append(4)  # Error! AttributeError
my_tuple[0] = 10     # Error! TypeError

# When to use Tuple
coordinates = (10, 20)  # Fixed values
RGB = (255, 128, 0)     # Constants
\`\`\`

#### Performance Comparison:

\`\`\`python
import timeit

# List creation
list_time = timeit.timeit(lambda: [1, 2, 3, 4, 5], number=1000000)
print(f"List: {list_time:.6f} seconds")

# Tuple creation
tuple_time = timeit.timeit(lambda: (1, 2, 3, 4, 5), number=1000000)
print(f"Tuple: {tuple_time:.6f} seconds")
# Tuple is typically faster!
\`\`\``,
        timestamp: 1730436005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: true,
    },
  },
  {
    id: 'conv_jkl',
    title: 'TypeScript Type Guards and Assertions',
    pinned: false,
    createdAt: 1730349000000,
    updatedAt: 1730349600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Show me TypeScript type guards and type assertions',
        timestamp: 1730349001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### TypeScript Type Guards and Assertions

Type guards help TypeScript narrow down types, while type assertions tell the compiler to trust your type knowledge.

#### Type Guards

\`\`\`typescript
// typeof guard
function printValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // TypeScript knows value is string
  } else {
    console.log(value.toFixed(2)); // TypeScript knows value is number
  }
}

// instanceof guard
class Dog {
  bark() { console.log('Woof!'); }
}

class Cat {
  meow() { console.log('Meow!'); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript knows it's a Dog
  } else {
    animal.meow(); // TypeScript knows it's a Cat
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // TypeScript knows it's Fish
  } else {
    animal.fly(); // TypeScript knows it's Bird
  }
}
\`\`\`

#### Type Assertions

\`\`\`typescript
// Angle bracket syntax
let value: unknown = "Hello World";
let strLength: number = (<string>value).length;

// As syntax (preferred in TSX)
let strLength2: number = (value as string).length;

// Non-null assertion
function processElement() {
  const element = document.getElementById('myElement');
  element!.style.display = 'none'; // ! tells TS element is not null
}

// Double assertion
let value2: unknown = "hello";
let number = (value2 as any) as number; // Not recommended!
\`\`\``,
        timestamp: 1730349005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: true,
    },
  },
  {
    id: 'conv_mno',
    title: 'SQL Joins Explained with Examples',
    pinned: false,
    createdAt: 1730262000000,
    updatedAt: 1730262600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Explain different types of SQL joins with code examples',
        timestamp: 1730262001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### SQL Joins Explained

SQL joins allow you to combine rows from two or more tables based on related columns.

#### INNER JOIN

Returns only matching records from both tables:

\`\`\`sql
SELECT users.name, orders.order_date, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
\`\`\`

#### LEFT JOIN (LEFT OUTER JOIN)

Returns all records from the left table and matched records from the right:

\`\`\`sql
SELECT users.name, orders.order_date
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- Returns all users, even if they have no orders
\`\`\`

#### RIGHT JOIN (RIGHT OUTER JOIN)

Returns all records from the right table and matched records from the left:

\`\`\`sql
SELECT users.name, orders.order_date
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
-- Returns all orders, even if user doesn't exist
\`\`\`

#### FULL OUTER JOIN

Returns all records when there's a match in either table:

\`\`\`sql
SELECT users.name, orders.order_date
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
-- Returns all users and all orders
\`\`\`

#### CROSS JOIN

Returns the Cartesian product of both tables:

\`\`\`sql
SELECT users.name, products.name
FROM users
CROSS JOIN products;
-- Every user with every product
\`\`\`

#### Self JOIN

Joining a table with itself:

\`\`\`sql
SELECT a.name AS employee, b.name AS manager
FROM employees a
LEFT JOIN employees b ON a.manager_id = b.id;
\`\`\``,
        timestamp: 1730262005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: false,
    },
  },
  {
    id: 'conv_pqr',
    title: 'Async/Await in JavaScript',
    pinned: true,
    createdAt: 1730175000000,
    updatedAt: 1730175600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Explain async/await and promises in JavaScript',
        timestamp: 1730175001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### Async/Await in JavaScript

Async/await is syntactic sugar for Promises, making asynchronous code easier to read and write.

#### Basic Promise Example

\`\`\`javascript
// Old way with callbacks
function fetchUser(id, callback) {
  setTimeout(() => {
    callback({ id, name: 'John' });
  }, 1000);
}

// Promise way
function fetchUserPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, name: 'John' });
    }, 1000);
  });
}

fetchUserPromise(1)
  .then(user => console.log(user))
  .catch(error => console.error(error));
\`\`\`

#### Async/Await Syntax

\`\`\`javascript
// Async function
async function fetchUserAsync(id) {
  try {
    const user = await fetchUserPromise(id);
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
fetchUserAsync(1);
\`\`\`

#### Multiple Async Operations

\`\`\`javascript
// Sequential (slower)
async function fetchSequential() {
  const user1 = await fetchUser(1);  // Wait 1s
  const user2 = await fetchUser(2);  // Wait 1s
  // Total: 2s
}

// Parallel (faster)
async function fetchParallel() {
  const [user1, user2] = await Promise.all([
    fetchUser(1),
    fetchUser(2)
  ]);
  // Total: 1s
}
\`\`\`

#### Real-world Example with Fetch API

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Usage
const user = await fetchUserData(123);
\`\`\``,
        timestamp: 1730175005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: true,
    },
  },
  {
    id: 'conv_stu',
    title: 'Tailwind CSS Utility Classes',
    pinned: false,
    createdAt: 1730088000000,
    updatedAt: 1730088600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Show me Tailwind CSS examples and best practices',
        timestamp: 1730088001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### Tailwind CSS Utility Classes

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs.

#### Basic Examples

\`\`\`tsx
// Button with multiple utilities
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>

// Card component
<div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
  <h2 className="text-xl font-bold mb-2">Card Title</h2>
  <p className="text-gray-700">Card content goes here</p>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-gray-100 p-4">Item 1</div>
  <div className="bg-gray-100 p-4">Item 2</div>
  <div className="bg-gray-100 p-4">Item 3</div>
</div>
\`\`\`

#### Dark Mode Support

\`\`\`tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold">Dark Mode Example</h1>
  <p>This text adapts to dark mode</p>
</div>
\`\`\`

#### Custom Component with Variants

\`\`\`tsx
function Button({ variant = 'primary', children }) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  
  return (
    <button className={\`\${baseClasses} \${variants[variant]}\`}>
      {children}
    </button>
  );
}
\`\`\`

#### Best Practices

1. **Use @apply for repeated patterns**
\`\`\`css
.btn {
  @apply px-4 py-2 rounded-lg font-medium;
}
\`\`\`

2. **Use arbitrary values when needed**
\`\`\`tsx
<div className="w-[calc(100%-2rem)] h-[500px]">
  Custom dimensions
</div>
\`\`\`

3. **Group related utilities**
\`\`\`tsx
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow
  hover:shadow-lg transition-shadow
">
  Content
</div>
\`\`\``,
        timestamp: 1730088005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: false,
    },
  },
  {
    id: 'conv_vwx',
    title: 'Docker Compose Configuration',
    pinned: false,
    createdAt: 1730001000000,
    updatedAt: 1730001600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'How to set up Docker Compose for a full-stack application?',
        timestamp: 1730001001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### Docker Compose Configuration

Docker Compose allows you to define and run multi-container Docker applications.

#### Basic docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend

  # Backend API
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - NODE_ENV=production
    depends_on:
      - db

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
\`\`\`

#### Dockerfile Example

\`\`\`dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
\`\`\`

#### Usage Commands

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Execute command in container
docker-compose exec backend npm run migrate
\`\`\``,
        timestamp: 1730001005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: true,
    },
  },
  {
    id: 'conv_yza',
    title: 'Algorithm: Binary Search Implementation',
    pinned: false,
    createdAt: 1729914000000,
    updatedAt: 1729914600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Implement binary search algorithm with code examples',
        timestamp: 1729914001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### Binary Search Algorithm

Binary search is a divide-and-conquer algorithm that finds the position of a target value within a sorted array.

#### Iterative Implementation

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}

// Usage
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sortedArray, 7)); // Output: 3
\`\`\`

#### Recursive Implementation

\`\`\`javascript
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) {
    return -1; // Not found
  }
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) {
    return mid;
  }
  
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}
\`\`\`

#### Python Implementation

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Usage
arr = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(arr, 7))  # Output: 3
\`\`\`

#### Time Complexity

- **Best Case**: O(1) - Target is at the middle
- **Average Case**: O(log n)
- **Worst Case**: O(log n)

#### Use Cases

- Searching in sorted arrays
- Finding insertion point
- Finding boundaries in sorted data
- Implementing search trees`,
        timestamp: 1729914005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: false,
    },
  },
  {
    id: 'conv_bcd',
    title: 'JWT Authentication in Node.js',
    pinned: false,
    createdAt: 1729827000000,
    updatedAt: 1729827600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'How to implement JWT authentication in Node.js?',
        timestamp: 1729827001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### JWT Authentication in Node.js

JSON Web Tokens (JWT) are a popular way to handle authentication in web applications.

#### Installation

\`\`\`bash
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
\`\`\`

#### Login Route (Token Generation)

\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user._id, email: user.email } });
});
\`\`\`

#### Authentication Middleware

\`\`\`javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

#### Refresh Token Implementation

\`\`\`javascript
// Generate refresh token
const refreshToken = jwt.sign(
  { userId: user._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token in database
await User.updateOne(
  { _id: user._id },
  { refreshToken: refreshToken }
);

// Refresh endpoint
app.post('/api/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  const newToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token: newToken });
});
\`\`\``,
        timestamp: 1729827005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: true,
    },
  },
  {
    id: 'conv_efg',
    title: 'Unit Testing with Jest',
    pinned: false,
    createdAt: 1729740000000,
    updatedAt: 1729740600000,
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Show me how to write unit tests with Jest',
        timestamp: 1729740001000,
      },
      {
        id: 'm2',
        role: 'assistant',
        contentMd: `### Unit Testing with Jest

Jest is a popular JavaScript testing framework that provides a complete testing solution.

#### Basic Test Example

\`\`\`javascript
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };

// math.test.js
const { add, multiply } = require('./math');

describe('Math functions', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('multiplies 3 * 4 to equal 12', () => {
    expect(multiply(3, 4)).toBe(12);
  });
});
\`\`\`

#### Testing Async Functions

\`\`\`javascript
// fetchUser.js
async function fetchUser(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}

// fetchUser.test.js
describe('fetchUser', () => {
  test('fetches user data successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'John' }),
      })
    );

    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'John' });
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });
});
\`\`\`

#### Mocking Dependencies

\`\`\`javascript
// userService.js
const db = require('./database');

async function getUserById(id) {
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}

// userService.test.js
jest.mock('./database');

describe('getUserById', () => {
  test('returns user data', async () => {
    const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
    db.query.mockResolvedValue(mockUser);

    const user = await getUserById(1);
    expect(user).toEqual(mockUser);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = ?',
      [1]
    );
  });
});
\`\`\`

#### Testing React Components

\`\`\`tsx
// Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
};

// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\``,
        timestamp: 1729740005000,
      },
    ],
    tools: {
      web: false,
      code: true,
      vision: false,
    },
    memory: {
      enabled: false,
    },
  },
]

export const mockFolders: ConversationFolder[] = [
  { id: 'folder_1', name: 'Frontend', color: '#3b82f6', icon: '📱' },
  { id: 'folder_2', name: 'Backend', color: '#10b981', icon: '⚙️' },
  { id: 'folder_3', name: 'Database', color: '#f59e0b', icon: '🗄️' },
]

export const samplePrompts = [
  'Explain React Hooks',
  'How to create REST API with Node.js',
  'Difference between let, const and var',
  'TypeScript usage guide',
  'Best practices for Git workflow',
  'Docker containerization guide',
  'SQL query optimization tips',
  'CSS Grid vs Flexbox',
]
