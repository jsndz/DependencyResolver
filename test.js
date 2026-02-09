
export const tasks = [
    "Design UI",          // 0
    "Setup Backend",      // 1
    "Create Database",    // 2
    "Build API",          // 3
    "Connect Frontend",   // 4
    "Deploy App"          // 5
  ];

export const dependencies = [
    { from: 0, to: 4 }, // Connect Frontend depends on Design UI
    { from: 2, to: 3 }, // Build API depends on Create Database
    { from: 1, to: 3 }, // Build API depends on Setup Backend
    { from: 3, to: 4 }, // Connect Frontend depends on Build API
    { from: 4, to: 5 }, // Deploy App depends on Connect Frontend
  ];


