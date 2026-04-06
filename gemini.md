# Data Schema & Maintenance (gemini.md)

## Data-First Rule
*Coding begins once the "Payload" shape is confirmed.*

## Input Payload Schema (Client -> Future AI Backend)
```json
{
  "question": "Will I find success in my new vibe coding project?",
  "drawnCards": [
    {
      "id": 0,
      "name": "The Fool",
      "position": "Situation",
      "orientation": "upright"
    },
    {
      "id": 1,
      "name": "The Magician",
      "position": "Action",
      "orientation": "upright"
    },
    {
      "id": 10,
      "name": "Wheel of Fortune",
      "position": "Outcome",
      "orientation": "upright"
    }
  ]
}
```

## Output Payload Schema (Future AI Backend -> Client)
```json
{
  "reading": "The Fool indicates the start of your journey into the unknown..."
}
```

## Maintenance Log
- *To be populated upon deployment.*
