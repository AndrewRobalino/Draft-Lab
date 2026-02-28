import { getBrawlerImage } from "../utils/assets.js";

const RAW_BRAWLERS = [
  {
    "id": "8_bit",
    "name": "8-Bit",
    "image": "/assets/brawlers/8_bit.webp"
  },
  {
    "id": "alli",
    "name": "Alli",
    "image": "/assets/brawlers/alli.webp"
  },
  {
    "id": "amber",
    "name": "Amber",
    "image": "/assets/brawlers/amber.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "angelo",
    "name": "Angelo",
    "image": "/assets/brawlers/angelo.webp"
  },
  {
    "id": "ash",
    "name": "Ash",
    "image": "/assets/brawlers/ash.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "barley",
    "name": "Barley",
    "image": "/assets/brawlers/barley.webp",
    "role": "Thrower",
    "tags": [
      "Area Control"
    ]
  },
  {
    "id": "bea",
    "name": "Bea",
    "image": "/assets/brawlers/bea.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "belle",
    "name": "Belle",
    "image": "/assets/brawlers/belle.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "berry",
    "name": "Berry",
    "image": "/assets/brawlers/berry.webp"
  },
  {
    "id": "bibi",
    "name": "Bibi",
    "image": "/assets/brawlers/bibi.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "bo",
    "name": "Bo",
    "image": "/assets/brawlers/bo.webp"
  },
  {
    "id": "bonnie",
    "name": "Bonnie",
    "image": "/assets/brawlers/bonnie.webp"
  },
  {
    "id": "brock",
    "name": "Brock",
    "image": "/assets/brawlers/brock.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "bull",
    "name": "Bull",
    "image": "/assets/brawlers/bull.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "buster",
    "name": "Buster",
    "image": "/assets/brawlers/buster.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "buzz",
    "name": "Buzz",
    "image": "/assets/brawlers/buzz.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "byron",
    "name": "Byron",
    "image": "/assets/brawlers/byron.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "carl",
    "name": "Carl",
    "image": "/assets/brawlers/carl.webp"
  },
  {
    "id": "charlie",
    "name": "Charlie",
    "image": "/assets/brawlers/charlie.webp"
  },
  {
    "id": "chester",
    "name": "Chester",
    "image": "/assets/brawlers/chester.webp"
  },
  {
    "id": "chuck",
    "name": "Chuck",
    "image": "/assets/brawlers/chuck.webp"
  },
  {
    "id": "clancy",
    "name": "Clancy",
    "image": "/assets/brawlers/clancy.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "colette",
    "name": "Colette",
    "image": "/assets/brawlers/colette.webp"
  },
  {
    "id": "colt",
    "name": "Colt",
    "image": "/assets/brawlers/colt.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "cordelius",
    "name": "Cordelius",
    "image": "/assets/brawlers/cordelius.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "crow",
    "name": "Crow",
    "image": "/assets/brawlers/crow.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "darryl",
    "name": "Darryl",
    "image": "/assets/brawlers/darryl.webp"
  },
  {
    "id": "doug",
    "name": "Doug",
    "image": "/assets/brawlers/doug.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "draco",
    "name": "Draco",
    "image": "/assets/brawlers/draco.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "dynamike",
    "name": "Dynamike",
    "image": "/assets/brawlers/dynamike.webp",
    "role": "Thrower",
    "tags": [
      "Area Control"
    ]
  },
  {
    "id": "edgar",
    "name": "Edgar",
    "image": "/assets/brawlers/edgar.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "el_primo",
    "name": "El Primo",
    "image": "/assets/brawlers/el_primo.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "emz",
    "name": "Emz",
    "image": "/assets/brawlers/emz.webp"
  },
  {
    "id": "eve",
    "name": "Eve",
    "image": "/assets/brawlers/eve.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "fang",
    "name": "Fang",
    "image": "/assets/brawlers/fang.webp"
  },
  {
    "id": "finx",
    "name": "Finx",
    "image": "/assets/brawlers/finx.webp"
  },
  {
    "id": "frank",
    "name": "Frank",
    "image": "/assets/brawlers/frank.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "gale",
    "name": "Gale",
    "image": "/assets/brawlers/gale.webp"
  },
  {
    "id": "gene",
    "name": "Gene",
    "image": "/assets/brawlers/gene.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "gigi",
    "name": "Gigi",
    "image": "/assets/brawlers/gigi.webp"
  },
  {
    "id": "gray",
    "name": "Gray",
    "image": "/assets/brawlers/gray.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "griff",
    "name": "Griff",
    "image": "/assets/brawlers/griff.webp"
  },
  {
    "id": "grom",
    "name": "Grom",
    "image": "/assets/brawlers/grom.webp",
    "role": "Thrower",
    "tags": [
      "Area Control"
    ]
  },
  {
    "id": "gus",
    "name": "Gus",
    "image": "/assets/brawlers/gus.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "hank",
    "name": "Hank",
    "image": "/assets/brawlers/hank.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "jacky",
    "name": "Jacky",
    "image": "/assets/brawlers/jacky.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "jae_yong",
    "name": "Jae Yong",
    "image": "/assets/brawlers/jae_yong.webp"
  },
  {
    "id": "janet",
    "name": "Janet",
    "image": "/assets/brawlers/janet.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "jessie",
    "name": "Jessie",
    "image": "/assets/brawlers/jessie.webp"
  },
  {
    "id": "juju",
    "name": "Juju",
    "image": "/assets/brawlers/juju.webp"
  },
  {
    "id": "kaze",
    "name": "Kaze",
    "image": "/assets/brawlers/kaze.webp"
  },
  {
    "id": "kenji",
    "name": "Kenji",
    "image": "/assets/brawlers/kenji.webp"
  },
  {
    "id": "kit",
    "name": "Kit",
    "image": "/assets/brawlers/kit.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "larry_and_lawrie",
    "name": "Larry And Lawrie",
    "image": "/assets/brawlers/larry_and_lawrie.webp"
  },
  {
    "id": "leon",
    "name": "Leon",
    "image": "/assets/brawlers/leon.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "lily",
    "name": "Lily",
    "image": "/assets/brawlers/lily.webp"
  },
  {
    "id": "lola",
    "name": "Lola",
    "image": "/assets/brawlers/lola.webp"
  },
  {
    "id": "lou",
    "name": "Lou",
    "image": "/assets/brawlers/lou.webp"
  },
  {
    "id": "lumi",
    "name": "Lumi",
    "image": "/assets/brawlers/lumi.webp"
  },
  {
    "id": "maisie",
    "name": "Maisie",
    "image": "/assets/brawlers/maisie.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "mandy",
    "name": "Mandy",
    "image": "/assets/brawlers/mandy.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "max",
    "name": "Max",
    "image": "/assets/brawlers/max.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "meeple",
    "name": "Meeple",
    "image": "/assets/brawlers/meeple.webp"
  },
  {
    "id": "meg",
    "name": "Meg",
    "image": "/assets/brawlers/meg.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "melodie",
    "name": "Melodie",
    "image": "/assets/brawlers/melodie.webp"
  },
  {
    "id": "mico",
    "name": "Mico",
    "image": "/assets/brawlers/mico.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "mina",
    "name": "Mina",
    "image": "/assets/brawlers/mina.webp"
  },
  {
    "id": "moe",
    "name": "Moe",
    "image": "/assets/brawlers/moe.webp"
  },
  {
    "id": "mortis",
    "name": "Mortis",
    "image": "/assets/brawlers/mortis.webp",
    "role": "Assassin",
    "tags": [
      "Dive"
    ]
  },
  {
    "id": "mr_p",
    "name": "Mr. P",
    "image": "/assets/brawlers/mr_p.webp"
  },
  {
    "id": "nani",
    "name": "Nani",
    "image": "/assets/brawlers/nani.webp"
  },
  {
    "id": "nita",
    "name": "Nita",
    "image": "/assets/brawlers/nita.webp"
  },
  {
    "id": "ollie",
    "name": "Ollie",
    "image": "/assets/brawlers/ollie.webp"
  },
  {
    "id": "otis",
    "name": "Otis",
    "image": "/assets/brawlers/otis.webp"
  },
  {
    "id": "pam",
    "name": "Pam",
    "image": "/assets/brawlers/pam.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "pearl",
    "name": "Pearl",
    "image": "/assets/brawlers/pearl.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "penny",
    "name": "Penny",
    "image": "/assets/brawlers/penny.webp"
  },
  {
    "id": "piper",
    "name": "Piper",
    "image": "/assets/brawlers/piper.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "poco",
    "name": "Poco",
    "image": "/assets/brawlers/poco.webp",
    "role": "Support",
    "tags": [
      "Healer"
    ]
  },
  {
    "id": "r_t",
    "name": "R-T",
    "image": "/assets/brawlers/r_t.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "rico",
    "name": "Rico",
    "image": "/assets/brawlers/rico.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "rosa",
    "name": "Rosa",
    "image": "/assets/brawlers/rosa.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "ruffs",
    "name": "Ruffs",
    "image": "/assets/brawlers/ruffs.webp"
  },
  {
    "id": "sam",
    "name": "Sam",
    "image": "/assets/brawlers/sam.webp",
    "role": "Tank",
    "tags": [
      "Frontline"
    ]
  },
  {
    "id": "sandy",
    "name": "Sandy",
    "image": "/assets/brawlers/sandy.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "shade",
    "name": "Shade",
    "image": "/assets/brawlers/shade.webp"
  },
  {
    "id": "shelly",
    "name": "Shelly",
    "image": "/assets/brawlers/shelly.webp"
  },
  {
    "id": "spike",
    "name": "Spike",
    "image": "/assets/brawlers/spike.webp",
    "role": "Sharpshooter",
    "tags": [
      "Lane"
    ]
  },
  {
    "id": "sprout",
    "name": "Sprout",
    "image": "/assets/brawlers/sprout.webp",
    "role": "Thrower",
    "tags": [
      "Area Control"
    ]
  },
  {
    "id": "squeak",
    "name": "Squeak",
    "image": "/assets/brawlers/squeak.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "stu",
    "name": "Stu",
    "image": "/assets/brawlers/stu.webp"
  },
  {
    "id": "surge",
    "name": "Surge",
    "image": "/assets/brawlers/surge.webp"
  },
  {
    "id": "tara",
    "name": "Tara",
    "image": "/assets/brawlers/tara.webp",
    "role": "Control",
    "tags": [
      "Zone"
    ]
  },
  {
    "id": "tick",
    "name": "Tick",
    "image": "/assets/brawlers/tick.webp"
  },
  {
    "id": "trunk",
    "name": "Trunk",
    "image": "/assets/brawlers/trunk.webp"
  },
  {
    "id": "willow",
    "name": "Willow",
    "image": "/assets/brawlers/willow.webp"
  },
  {
    "id": "ziggy",
    "name": "Ziggy",
    "image": "/assets/brawlers/ziggy.webp"
  }
];

export const BRAWLERS = RAW_BRAWLERS.map((brawler) => ({
  ...brawler,
  image: getBrawlerImage(brawler.id),
}));
