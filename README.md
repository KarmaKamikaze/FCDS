# FCDS (Food Courier Distribution Simulation)

This program is designed to simulate the effect of adding idle zones to a food courier delivery service.
The software is developed by the P2-Project SW2 B2-14 team.

<!-- GETTING STARTED -->
 ## Getting Started
 
 To get a local copy up and running, follow these steps. 
 
 ### Installation 

 1. Clone the repository

```sh
git clone https://github.com/KarmaKamikaze/FCDS.git
```

 2. Navigate to the root folder and run `npm install` to install all dependencies
```sh
npm install
```

 3. While in the root folder, start the server by running `index.js` with `NodeJS`
```sh
node node/index.js
```

 4. The site can be visited in a browser at the address `localhost:3190`

```sh
http://localhost:3190/
```

### Using the program

 1. **Graph visualization**

In graph visualization mode, the simulation runs visually and is updated in real-time.
This mode does not provide as much in-depth statistics, but the behaviour of couriers, idle zone generation etc. can be studied closely.

`Number of graphs:` The amount of simulations to show and run simultaneously.

`Graph size:` Specifies which of the graph presets to use (see [here](#graph-presets)).

`Simulation algorithm:` Specifies which of the shortest-path algorithms to use.

`Idle zones:` The maximum amount of idle zones to generate.

`Order frequency:` The rate at which orders are generated in each restaurant.

`Ticks per second:` The rate at which the simulation runs. 1 tick corresponds to one minute in simulation time.

`Courier frequency:` The maximum amount of couriers to generate.

`Obstruction level:` The number of edges to add random obstructions on (which affects the weight of an edge).


 2. **Headless simulation**

In headless simulation mode, the visual aspect of the simulation is removed entirely.
This means that the simulation performs faster, and provides many useful statistics which are updated in real-time.

### <a name="#graph-presets"></a>Graph presets (and legend)

![Graph presets](https://raw.githubusercontent.com/KarmaKamikaze/FCDS/master/.github/Graphs.png)
![Graph legend](https://raw.githubusercontent.com/KarmaKamikaze/FCDS/master/node/PublicResources/html/legend.png)

 <!-- LICENSE -->
 ## License
 
 Distributed under the GNU General Public License v3.0 License. See `LICENSE` for more information. 


 <!-- CONTACT --> 
 ## Contact 
 
 Project Link: [https://github.com/KarmaKamikaze/FCDS](https://github.com/KarmaKamikaze/FCDS)
