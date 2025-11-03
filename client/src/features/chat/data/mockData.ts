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
      code: false,
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

\`\`\`tsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
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

**Tuple**:
- Cannot be changed (immutable)
- Uses parentheses \`()\`
- Faster performance

\`\`\`python
# List
my_list = [1, 2, 3]
my_list.append(4)  # OK

# Tuple
my_tuple = (1, 2, 3)
my_tuple.append(4)  # Error!
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
]
