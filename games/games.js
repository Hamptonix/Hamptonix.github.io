
const GAMES = [
  {
    title: "Mining Game",
    tag: "Simulator",
    desc: "I made this game with ai because I was bored, its pretty bad",
    icon: "/assets/pick.webp",
    url: "https://hamptonix.com/games/localgames/mining.html",
    category: "Simulator"
  },
  {
    title: "Cube 2",
    tag: "Platformer",
    desc: "I made this game in 8th grade and its pretty cool",
    icon: "https://i.postimg.cc/4yd9ZYGv/cover-(1).jpg",
    url: "https://cube2game.itch.io/cube2",
    category: "Platformer"
  },
  {
    title: "Rocket League",
    tag: "Battle Royale",
    desc: "Fast-paced soccer with rocket-powered cars and insane aerial plays.",
    icon: "/assets/rocketleague.jpg",
    url: "https://www.xbox.com/en-US/play/games/rocket-league/C125W9BG2K0V",
    category: "Battle Royale"
  },
  {
    title: "Fortnite",
    tag: "Battle Royale",
    desc: "Drop in, loot, and fight to be the last one standing.",
    icon: "https://i.postimg.cc/g01bPQtz/16-BP-Trello-Image.webp",
    url: "https://www.xbox.com/en-US/play/games/fortnite/BT5P2X999VH2",
    category: "Battle Royale"
  },
  {
    title: "Buckshot Roulette",
    tag: "Strategy",
    desc: "A tense shotgun-based twist on Russian roulette.",
    icon: "https://gcdn.thunderstore.io/live/repository/icons/fungoid-BUCKSHOT_ROULETTE-1.0.0.png.256x256_q95.png",
    url: "https://buckshotroulette.online/steam/",
    category: "Strategy"
  },
  {
    title: "Five Nights at Epsteins",
    tag: "Horror",
    desc: "Survive the night in this Five Nights-style horror experience.",
    icon: "/assets/bige.jpg",
    url: "https://fivenightsatepsteins.org/fivenightsatepsteins-online/embed",
    category: "Horror"
  },
  {
    title: "Hypper Sandbox",
    tag: "Sandbox",
    desc: "Experiment, build, and explore in a physics-based sandbox.",
    icon: "/assets/hypper.png",
    url: "https://www.crazygames.com/game/hypper-sandbox",
    category: "Sandbox"
  },
  {
    title: "Smash Karts",
    tag: "Battle Royale",
    desc: "Multiplayer kart battles with weapons and chaos.",
    icon: "https://i.postimg.cc/gJp04f5C/poki-smash-karts-icon-filled-256.png",
    url: "https://smashkarts.io/",
    category: "Battle Royale"
  },
  {
    title: "Shell Shockers",
    tag: "FPS",
    desc: "Egg-based first-person shooter — surprisingly competitive.",
    icon: "https://i.postimg.cc/HWcpXWVr/unnamed.png",
    url: "https://shellshock.io/",
    category: "FPS"
  },
  {
    title: "Plinko",
    tag: "Arcade",
    desc: "Drop the ball and watch it bounce to victory.",
    icon: "/plinko.jpeg",
    url: "https://plinko-web-game.netlify.app/",
    category: "Arcade"
  },
  {
    title: "Crazy Cattle 3D",
    tag: "Battle Royale",
    desc: "Chaotic animal physics fun in a 3D environment.",
    icon: "https://i.postimg.cc/50GxYyvS/images.jpg",
    url: "https://crazycattle3d.com/#online-game/",
    category: "Battle Royale"
  },
  {
    title: "Minecraft 1.12.2",
    tag: "Survival",
    desc: "Classic Minecraft experience in your browser.",
    icon: "/assets/12.png",
    url: "https://eaglercraft.com/play/?version=1.12.2",
    category: "Survival"
  },
  {
    title: "Minecraft 1.8.8",
    tag: "Survival",
    desc: "Older Minecraft version with PvP-focused gameplay.",
    icon: "/assets/8.png",
    url: "https://eaglercraft.com/play/?version=1.8.8",
    category: "Survival"
  },
  {
    title: "Minecraft 1.5.2",
    tag: "Survival",
    desc: "Retro Minecraft version for nostalgic gameplay.",
    icon: "/assets/5.png",
    url: "https://eaglercraft.com/play/?version=1.5.2",
    category: "Survival"
  },
  {
    title: "COD Zombies",
    tag: "Survival",
    desc: "Survive endless waves of zombies.",
    icon: "https://gcdn.thunderstore.io/live/repository/icons/Omega115-COD_Zombies_Zosig_Voicelines-1.1.0.png.256x256_q95.jpg",
    url: "https://nzp.gay/",
    category: "Survival"
  },
  {
    title: "Skribbl.io",
    tag: "Party",
    desc: "Draw and guess words with friends online.",
    icon: "https://i.postimg.cc/ZnzFvRCJ/256x256bb-removebg-preview.png",
    url: "https://skribbl.io/",
    category: "Party"
  },
  {
    title: "Gartic Phone",
    tag: "Party",
    desc: "Telephone game meets drawing chaos.",
    icon: "https://cdn2.steamgriddb.com/icon/92a795b46873063e419773b4f310fc29.png",
    url: "https://garticphone.com/draw?2",
    category: "Party"
  },
  {
    title: "Wiki Race",
    tag: "Trivia",
    desc: "Navigate Wikipedia pages to reach a target article.",
    icon: "https://i.postimg.cc/9Q1hxw2F/Wikipedia-logo-v2-svg-removebg-preview.png",
    url: "https://wiki-race.com/",
    category: "Trivia"
  },
  {
    title: "TankSmith.io",
    tag: "Battle Royale",
    desc: "Build and battle tanks in this .io shooter.",
    icon: "https://i.postimg.cc/tJwjr4zC/unnamed.jpg",
    url: "http://tanksmith.io/",
    category: "Battle Royale"
  },
  {
    title: "Bloxd.io",
    tag: "Survival",
    desc: "Block-based multiplayer sandbox with parkour and combat.",
    icon: "https://i.postimg.cc/DZz3nXjw/unnamed-1.webp",
    url: "https://bloxd.io/",
    category: "Survival"
  },
  {
    title: "Basketball Random",
    tag: "Sports",
    desc: "Physics-based basketball with hilarious randomness.",
    icon: "https://1games.io/data/image/game/basket-random/banner/basket-random.png",
    url: "https://www.twoplayergames.org/game/basket-random",
    category: "Sports"
  },
  {
    title: "Run 3",
    tag: "Platformer",
    desc: "Endless runner through space tunnels.",
    icon: "https://funclap.com/uploads/2025/6/run-3-unblocked-funclap.png",
    url: "https://player03.com/run/3/beta/",
    category: "Platformer"
  },
  {
    title: "Florr.io",
    tag: "Battle Royale",
    desc: "Grow your flower and battle enemies in a colorful arena.",
    icon: "https://slope3online.io/data/image/game/florr-io-slope3online.io.png",
    url: "https://florr.io/",
    category: "Battle Royale"
  },
  {
    title: "Diep.io",
    tag: "Battle Royale",
    desc: "Upgrade your tank and dominate the arena.",
    icon: "https://play.gilect.com/images/icons/diepio.webp",
    url: "https://diep.io/",
    category: "Battle Royale"
  },
  {
    title: "Agar.io",
    tag: "Battle Royale",
    desc: "Eat smaller cells and grow bigger.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Agar.io_Logo.png",
    url: "https://agar.io/#ffa",
    category: "Battle Royale"
  },
  {
    title: "Krunker.io",
    tag: "Battle Royale",
    desc: "Fast-paced browser FPS with custom maps.",
    icon: "https://hillsofsteelgame.github.io/images/icon/krunker-io.jpg",
    url: "https://krunker.io/",
    category: "Battle Royale"
  },
  {
    title: "Happy Wheels",
    tag: "Physics",
    desc: "Ragdoll physics and brutal obstacle courses.",
    icon: "https://media.abcya3.net/images/300/happy-wheels-2.jpg",
    url: "https://totaljerkface.com/happy_wheels.tjf",
    category: "Physics"
  },
  {
    title: "Infinite Craft",
    tag: "Sandbox",
    desc: "Combine elements to create anything imaginable.",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8f/a6/51/8fa6513d-1dd5-3976-0c3c-0a272ad08584/AppIcon-0-0-1x_U007epad-0-85-220.png/256x256bb.jpg",
    url: "https://neal.fun/infinite-craft/",
    category: "Sandbox"
  },
  {
    title: "Slither.io",
    tag: "Battle Royale",
    desc: "Grow your snake and outmaneuver others.",
    icon: "https://i.postimg.cc/y8kprSjC/images.jpg",
    url: "https://slither.io/en/",
    category: "Battle Royale"
  },
  {
    title: "Snow Rider 3D",
    tag: "Racing",
    desc: "Snowboard down hills and dodge obstacles.",
    icon: "https://www.hoodamath.com/large/1024/snowrider3d_1024.png",
    url: "https://snowrider3d.com/",
    category: "Racing"
  },
  {
    title: "Hamptonix Old Games Collection",
    tag: "Scratch",
    desc: "A collection of my old games that I made on scratch.",
    icon: "https://hamptonix.com/oldgames.jpeg",
    url: "https://hamptonix.com/games/oldgames",
    category: "Scratch"
  }

];
