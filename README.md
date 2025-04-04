# @antivivi/jjt-difficulties

A library for managing and interacting with a collection of custom difficulties for a game or application. This package provides a structured way to define, organize, and retrieve difficulty levels, complete with metadata such as names, images, colors, and ratings.

## Installation

Install the package via npm:

```bash
npm install @antivivi/jjt-difficulties
```

Do ensure to properly configure the @antivivi organization.

1. Rojo project configuration should include @antivivi in rbxts_include:
```json
"rbxts_include": {
    "$path": "include",
    "node_modules": {
        "$className": "Folder",
        "@rbxts": {
            "$path": "node_modules/@rbxts"
        },
        "@antivivi": {
            "$path": "node_modules/@antivivi"
        }
    }
}
```

2. tsconfig.json should include @antivivi in typeRoots.
```json
"typeRoots": [
    "node_modules/@rbxts",
    "node_modules/@antivivi"
]
```

## Usage

### Importing the Library
```ts
import Difficulty from "@antivivi/jjt-difficulties";
```

### Accessing Predefined Difficulties

You can access predefined difficulties directly as static properties of the Difficulty class:
```ts
const firstDifficulty = Difficulty.TheFirstDifficulty;
console.log(firstDifficulty.name); // "The First Difficulty"
console.log(firstDifficulty.rating); // -10000010
```

### Retrieving Difficulties by ID

Use the `get` method to retrieve a difficulty by its unique ID:
```ts
const difficulty = Difficulty.get("TheLowerGap");
if (difficulty) {
    console.log(difficulty.name); // "The Lower Gap"
}
```

### Creating Custom Difficulties

You can create custom difficulties by chaining the provided methods:
```ts
const customDifficulty = new Difficulty()
    .setName("Custom Difficulty")
    .setImage(1234567890)
    .setColor(Color3.fromRGB(255, 0, 0))
    .setRating(42)
    .setClass(1);
const id = "CustomDifficulty";
Difficulty.set(id, customDifficulty);
```

## Development

### Prerequisites
- Node.js
- npm
- Roblox TypeScript (roblox-ts)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/evilbocchi/jjt-difficulties.git
cd jjt-difficulties
```

2. Install dependencies
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the ISC License. See the LICENSE file for details.