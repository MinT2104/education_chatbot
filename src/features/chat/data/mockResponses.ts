// Mock responses in English for random generation
export const mockResponses = [
  // Math responses
  {
    category: 'math',
    content: `### Solving: 2x + 5 = 9

Let me walk you through this step by step:

**Step 1:** Subtract 5 from both sides
\`\`\`
2x + 5 - 5 = 9 - 5
2x = 4
\`\`\`

**Step 2:** Divide both sides by 2
\`\`\`
2x / 2 = 4 / 2
x = 2
\`\`\`

**Answer:** x = 2

**Verification:**
\`\`\`
2(2) + 5 = 4 + 5 = 9 ✓
\`\`\``,
  },
  {
    category: 'math',
    content: `### Understanding Linear Equations

A linear equation is an equation where the highest power of the variable is 1.

**General form:** ax + b = c

**Solving steps:**
1. Isolate the variable term
2. Simplify both sides
3. Solve for the variable

**Example:**
\`\`\`
2x + 5 = 9
2x = 4
x = 2
\`\`\`

Would you like to practice more similar problems?`,
  },
  {
    category: 'math',
    content: `### Quadratic Formula

The quadratic formula solves equations of the form: **ax² + bx + c = 0**

**Formula:**
\`\`\`
x = (-b ± √(b² - 4ac)) / 2a
\`\`\`

**Example:** Solve x² - 5x + 6 = 0

\`\`\`
a = 1, b = -5, c = 6
x = (5 ± √(25 - 24)) / 2
x = (5 ± 1) / 2
x₁ = 3, x₂ = 2
\`\`\`

**Answer:** x = 3 or x = 2`,
  },

  // Science responses
  {
    category: 'science',
    content: `### Newton's Second Law of Motion

**Formula:** F = ma

Where:
- **F** = Force (in Newtons)
- **m** = Mass (in kilograms)
- **a** = Acceleration (in m/s²)

**Explanation:**
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

**Example:**
If a 10kg object accelerates at 2 m/s²:
\`\`\`
F = ma
F = 10 kg × 2 m/s²
F = 20 N
\`\`\`

**Real-world application:** Pushing a shopping cart - more force = more acceleration!`,
  },
  {
    category: 'science',
    content: `### Why Does Ice Float on Water?

This is due to **density** and the unique structure of water.

**Key points:**
1. **Density:** Ice has a lower density (0.917 g/cm³) than liquid water (1.0 g/cm³)
2. **Molecular structure:** Water molecules form a hexagonal crystal structure in ice, creating more space between molecules
3. **Hydrogen bonds:** The hydrogen bonds in ice keep molecules further apart

**Why it matters:**
- Life on Earth depends on this property
- If ice sank, lakes and oceans would freeze from the bottom up
- Marine life would not survive winter

**Formula:** Density = Mass / Volume`,
  },

  // Computer Science responses
  {
    category: 'cs',
    content: `### For Loop vs While Loop

**For Loop:**
Use when you know the number of iterations beforehand.

\`\`\`javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
\`\`\`

**While Loop:**
Use when the number of iterations is unknown or depends on a condition.

\`\`\`javascript
// While loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}
\`\`\`

**Python Example:**
\`\`\`python
# For loop
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# While loop
i = 0
while i < 5:
    print(i)
    i += 1
\`\`\`

**Key difference:** For loops are more concise for counting, while loops are better for condition-based iteration.`,
  },
  {
    category: 'cs',
    content: `### JavaScript Array Methods

Here are some essential array methods:

**1. map()** - Transform each element
\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6]
\`\`\`

**2. filter()** - Select elements
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]
\`\`\`

**3. reduce()** - Accumulate values
\`\`\`javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 10
\`\`\`

**4. forEach()** - Execute for each element
\`\`\`javascript
const fruits = ['apple', 'banana', 'orange'];
fruits.forEach(fruit => console.log(fruit));
\`\`\``,
  },

  // Biology responses
  {
    category: 'biology',
    content: `### Mitochondria Function

**Mitochondria** are known as the "powerhouses of the cell."

**Main functions:**
1. **ATP Production:** Generate energy through cellular respiration
2. **Metabolism:** Break down nutrients to produce energy
3. **Cell signaling:** Regulate cell death (apoptosis)

**Structure:**
- Double membrane (inner and outer)
- Contains its own DNA (mtDNA)
- Has cristae (folds) to increase surface area

**Energy Production Process:**
\`\`\`
Glucose + Oxygen → ATP + CO₂ + H₂O
\`\`\`

**Interesting fact:** Mitochondria have their own DNA, suggesting they were once independent bacteria!`,
  },
  {
    category: 'biology',
    content: `### DNA vs RNA

**DNA (Deoxyribonucleic Acid):**
- **Structure:** Double helix (two strands)
- **Sugar:** Deoxyribose
- **Bases:** A, T, G, C (Thymine)
- **Location:** Nucleus
- **Function:** Stores genetic information

**RNA (Ribonucleic Acid):**
- **Structure:** Single strand
- **Sugar:** Ribose
- **Bases:** A, U, G, C (Uracil instead of Thymine)
- **Location:** Nucleus and cytoplasm
- **Function:** Protein synthesis

**Key Differences:**
\`\`\`
DNA:  Double-stranded, stable, permanent
RNA:  Single-stranded, unstable, temporary
\`\`\`

**Process:** DNA → RNA → Protein (Central Dogma)`,
  },

  // English responses
  {
    category: 'english',
    content: `### Correcting the Sentence

**Original:** "She don't likes coffee."

**Correction:** "She doesn't like coffee."

**Grammar rules:**
1. **Third person singular:** Use "doesn't" (not "don't") with "she"
2. **Verb form:** After "doesn't," use the base form "like" (not "likes")

**Correct forms:**
\`\`\`
✅ I/You/We/They don't like coffee
✅ He/She/It doesn't like coffee
❌ She don't like coffee
❌ She doesn't likes coffee
\`\`\`

**More examples:**
- "He doesn't like tea."
- "They don't like chocolate."
- "It doesn't work."`,
  },

  // Physics responses
  {
    category: 'physics',
    content: `### Frequency and Wavelength Relationship

**Formula:** c = f × λ

Where:
- **c** = Speed of light (3 × 10⁸ m/s for light, 343 m/s for sound in air)
- **f** = Frequency (Hz)
- **λ** = Wavelength (meters)

**Key relationship:**
Frequency and wavelength are **inversely proportional** - as frequency increases, wavelength decreases.

**Example (Sound):**
\`\`\`
If frequency = 440 Hz (musical note A)
Wavelength = 343 m/s ÷ 440 Hz ≈ 0.78 meters
\`\`\`

**Visual representation:**
\`\`\`
High frequency → Short wavelength (waves closer together)
Low frequency → Long wavelength (waves farther apart)
\`\`\`

**Real-world:** Higher-pitched sounds have shorter wavelengths!`,
  },

  // General coding responses
  {
    category: 'general',
    content: `### Understanding Variables: let, const, and var

**var** (old way, avoid):
\`\`\`javascript
var x = 1;  // Function-scoped, can be redeclared
x = 2;      // Can be reassigned
\`\`\`

**let** (modern, block-scoped):
\`\`\`javascript
let y = 1;  // Block-scoped, cannot be redeclared
y = 2;      // Can be reassigned
\`\`\`

**const** (constant):
\`\`\`javascript
const z = 1;  // Block-scoped, cannot be redeclared
z = 2;        // ❌ Error! Cannot be reassigned
\`\`\`

**Best practice:**
- Use **const** by default
- Use **let** when you need to reassign
- Avoid **var** in modern JavaScript`,
  },
  {
    category: 'general',
    content: `### TypeScript Type System

TypeScript adds static typing to JavaScript.

**Basic types:**
\`\`\`typescript
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
let scores: number[] = [90, 85, 95];
\`\`\`

**Interface:**
\`\`\`typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Optional property
}

const user: User = {
  name: "John",
  age: 25
};
\`\`\`

**Benefits:**
- Catch errors at compile time
- Better IDE support
- Self-documenting code`,
  },
  {
    category: 'general',
    content: `### Git Workflow Best Practices

**1. Branch Strategy:**
\`\`\`bash
git checkout -b feature/new-feature
# Make changes
git commit -m "Add new feature"
git push origin feature/new-feature
\`\`\`

**2. Commit Messages:**
- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Fix login bug" not "Fix bug"
- Include issue number: "Fix #123 login bug"

**3. Pull Requests:**
1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Create PR for review
5. Merge after approval

**Best practices:**
- Commit often, small commits
- Write clear commit messages
- Review your changes before committing`,
  },
  {
    category: 'general',
    content: `### React Component Structure

**Functional Component:**
\`\`\`tsx
import React, { useState } from 'react';

interface Props {
  name: string;
}

const Greeting: React.FC<Props> = ({ name }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Greeting;
\`\`\`

**Key concepts:**
- Props for passing data
- State for component data
- Hooks for lifecycle and side effects`,
  },
  {
    category: 'general',
    content: `### REST API Design Principles

**HTTP Methods:**
- **GET:** Retrieve data
- **POST:** Create new resource
- **PUT:** Update entire resource
- **PATCH:** Partially update resource
- **DELETE:** Remove resource

**Example API:**
\`\`\`
GET    /api/users          → List all users
GET    /api/users/:id      → Get specific user
POST   /api/users          → Create user
PUT    /api/users/:id      → Update user
DELETE /api/users/:id      → Delete user
\`\`\`

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error`,
  },
];

// Helper function to get random response
export function getRandomResponse(userInput?: string): string {
  // Try to match category based on keywords
  const lowerInput = (userInput || '').toLowerCase();
  
  let category: string | null = null;
  if (lowerInput.includes('math') || lowerInput.includes('solve') || lowerInput.includes('x =') || lowerInput.includes('equation')) {
    category = 'math';
  } else if (lowerInput.includes('physics') || lowerInput.includes('newton') || lowerInput.includes('force') || lowerInput.includes('frequency')) {
    category = 'physics';
  } else if (lowerInput.includes('biology') || lowerInput.includes('mitochondria') || lowerInput.includes('dna') || lowerInput.includes('rna')) {
    category = 'biology';
  } else if (lowerInput.includes('science') || lowerInput.includes('ice') || lowerInput.includes('water')) {
    category = 'science';
  } else if (lowerInput.includes('loop') || lowerInput.includes('array') || lowerInput.includes('code') || lowerInput.includes('javascript') || lowerInput.includes('programming')) {
    category = 'cs';
  } else if (lowerInput.includes('correct') || lowerInput.includes('sentence') || lowerInput.includes('grammar')) {
    category = 'english';
  }

  // Filter by category if matched, otherwise use all
  const filtered = category 
    ? mockResponses.filter(r => r.category === category)
    : mockResponses;

  // If no matches, use all responses
  const availableResponses = filtered.length > 0 ? filtered : mockResponses;

  // Return random response
  const randomIndex = Math.floor(Math.random() * availableResponses.length);
  return availableResponses[randomIndex].content;
}

