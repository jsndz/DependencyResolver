Phase 1: 
Date: Feb 12, 2026

The Project Initial Idea was to build dependency resolver. It just served html css and js as static files

You have Task and Dependency,
You can get:
- Topoligical Order (meaning which order the task have to be solved) - Uses Topological sort Algo
- shortest Path between Task - BFS  

Each Task acted as a node and each dependency as a edge

Phase 2: Convert the project into server
Date: Feb 14, 2026
THe project had lot of files and everything was getting cluttered 
So converted to a server which serves static files and 
algorithm core will be handled in backend. 
Stack: bun.js with Typescript + Express

Added new features: 
- Parallel Planning of the Tasks - Uses Topological sort Algo
- Detect Cycle and Report It - DFS with cycle array
- Terminal Task(end nodes) - task with outdegree 0
- Unreachable Tasks - Visited as false

Phase 3: Build frontend
Date: Feb 15, 2026

To make UI better, build frontend 
Vibe coded the boiler plate code and then built features on top of that.

Phase 4: tasks -> workflow
Date: Feb 16, 2026

Rather than keeping it as a dependency resolver,
I plan to add commands and folder to the task input. 
This can help in building a Workflow dependency manager. 
You give task name, folder and command and these will be execute in the backend considering dependency.
The main motivation behind it was handle a big project which has lot of files and commands running.
Example will a microservice which has lot of services and commands you can,

lint build test and run each microservice separately and if one is dependent on other it will execute in order.

Phase 5: Upgrading the backend
Date: Feb 16, 2026

take command from frontend and store in in memory of bun. 
Then run the commands parallelly based on the parellel planning of task.
It ensures that after the level 0 run level 1 will run etc. And this ensures if one task fails downstream task will not run.
Used "child_process" to do this.
Also wrote Tests for this.

Phase 6: Serving the output in frontend
Date: Feb 16, 2026

The data needs to be streamed to the frontend.
Normal http won't work. So had to either go with websocket or SSE.
SSE is better since the whole process for frontend was read only.
So built a SSE end point "/execute".
Sent the data in chucks based on types like "terminal_create", "task_started" etc
In this phase i also had to deal with imaginary terminal creation like for the terminals of the 
same path only one terminal is enough to show the output in frontend.


Phase 7: Designing UI for graph and terminal
Date: Feb 17, 2026

Gave proper UI for graph and terminal


Phase 8: Designing UI and UX for the Project
Date:  Feb 17, 2026

Based on the recommendation of mentor, started improving UI/UX.
Designed user flow, wireframe(for some pages), colors, fonts and style.

I tried to get the folder through the browser input tag. But was restricted for relative path. I needed absoulte path.
Which was only possible if i switch from browser to actual application.
So for now user has to maually input the folder path.

Phase 8: yaml Parser
Date:  Feb 18, 2026

Since the whole workflow lives in-memory implemented a feature that converts the workflow to dag and then tag to yaml
This help in reusability.
integrated the yaml config in the project